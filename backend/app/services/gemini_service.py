import json
import structlog
import pathlib
import tempfile
from io import BytesIO
from contextlib import asynccontextmanager

# Configure logging
logger = structlog.get_logger(__name__)

# Avoid hard failures at import time for optional / heavy dependencies
try:
    from fastapi import HTTPException
except ImportError:
    class HTTPException(Exception):
        def __init__(self, status_code: int = 500, detail: str | None = None):
            super().__init__(detail)
            self.status_code = status_code
            self.detail = detail

try:
    from google import genai
    from google.genai import types
    from google.genai.errors import APIError, ClientError
    # Alias for backward compatibility
    BadResponseError = ClientError
except ImportError as e:
    logger.debug(f"Failed to import google-genai: {e}")
    genai = None
    types = None
    APIError = Exception
    ClientError = Exception
    BadResponseError = Exception

import hashlib
from cachetools import TTLCache
from ..config.settings import settings
from ..schema.blueprint import Blueprint

# Lazily import the audio analysis implementation to avoid importing librosa at module import time.
async def analyze_audio(audio_bytes: bytes):
    """Lazy proxy to the real audio analysis implementation."""
    try:
        from .audio_analysis_service import analyze_audio as _analyze
        return await _analyze(audio_bytes)
    except Exception as e:
        logger.error(f"Audio analysis lazy import/call failed: {e}", exc_info=True)
        raise

class GeminiService:
    """
    A service class to interact with the Gemini API for generating ride blueprints and skyboxes.
    It includes caching for blueprints and a context manager for handling file uploads.
    """
    def __init__(self):
        """
        Initializes the GeminiService, setting up the Gemini client and a cache.
        """
        # Initialize the Gemini client
        if genai and settings.GEMINI_API_KEY:
            try:
                self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
                logger.info("Gemini client initialized successfully")
            except Exception as e:
                logger.error("Failed to initialize Gemini client", error=str(e), exc_info=True)
                self.client = None
        else:
            if not genai:
                logger.warning("Gemini client not initialized: google-genai module not available")
            elif not settings.GEMINI_API_KEY:
                logger.warning("Gemini client not initialized: GEMINI_API_KEY not set")
            self.client = None

        # Initialize a time-to-live (TTL) cache
        # Caches up to 100 blueprints for 1 hour (3600 seconds)
        self.blueprint_cache = TTLCache(maxsize=100, ttl=3600)
    @asynccontextmanager
    async def _managed_file_upload(self, audio_bytes: bytes, content_type: str):
        """Context manager for uploading and cleaning up temporary files.

        Strategy:
        1. Try to upload the bytes stream directly (most SDKs accept file-like objects).
        2. If stream upload fails, fall back to writing a temporary file and uploading by path.
        3. Ensure remote file is deleted after use and local temp file is removed.
        """
        if not self.client:
            raise HTTPException(status_code=503, detail="Gemini client not available for file upload.")

        tmp_path: str | None = None
        uploaded_file = None
        try:
            logger.info(
                "Uploading file to Gemini",
                size_kb=round(len(audio_bytes) / 1024, 1),
                upload_type="stream"
            )
            # First try stream upload using an in-memory buffer.
            try:
                buffer = BytesIO(audio_bytes)
                # Some SDK versions accept a mime_type kwarg; others accept an UploadFileConfig.
                if types and hasattr(types, 'UploadFileConfig') and content_type:
                    try:
                        upload_config = types.UploadFileConfig(mime_type=content_type)
                        uploaded_file = await self.client.aio.files.upload(file=buffer, config=upload_config)
                    except Exception:
                        uploaded_file = await self.client.aio.files.upload(file=buffer, mime_type=content_type or "audio/mpeg")
                else:
                    uploaded_file = await self.client.aio.files.upload(file=buffer, mime_type=content_type or "audio/mpeg")
                yield uploaded_file
                return
            except Exception as e:
                logger.debug(
                    "Stream upload failed, falling back to tempfile-based upload.",
                    error=str(e),
                    exc_info=True
                )

            # Fallback: persist to a temporary file and upload by path
            mime_map = {
                'audio/mpeg': '.mp3',
                'audio/mp3': '.mp3',
                'audio/wav': '.wav',
                'audio/x-wav': '.wav',
                'audio/flac': '.flac',
                'audio/aac': '.aac',
                'audio/ogg': '.ogg',
            }
            suffix = mime_map.get((content_type or '').lower(), '.mp3')
            with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
                tmp.write(audio_bytes)
                tmp_path = tmp.name

            upload_kwargs: dict[str, object] = {'file': tmp_path}
            if types and hasattr(types, 'UploadFileConfig') and content_type:
                try:
                    upload_kwargs['config'] = types.UploadFileConfig(mime_type=content_type)
                except Exception:
                    # Some SDK versions may not expose UploadFileConfig; continue without it.
                    pass

            uploaded_file = await self.client.aio.files.upload(**upload_kwargs)
            yield uploaded_file
        finally:
            # Attempt to delete the uploaded remote file if present
            if uploaded_file:
                try:
                    if hasattr(uploaded_file, 'name'):
                        await self.client.aio.files.delete(name=uploaded_file.name)
                except Exception as e:
                    logger.warning(
                        "Failed to delete uploaded remote file",
                        file_name=getattr(uploaded_file, 'name', 'unknown'),
                        error=str(e),
                        exc_info=True
                    )

            # Remove local temporary file if we created one
            if tmp_path:
                try:
                    pathlib.Path(tmp_path).unlink(missing_ok=True)  # type: ignore[arg-type]
                except Exception as e:
                    logger.debug("Failed to remove temporary file", path=tmp_path, error=str(e), exc_info=True)

    def generate_prompt_text(self, duration: float, bpm: float, energy: float,
                             spectral_centroid: float, spectral_flux: float,
                             options: dict | None = None) -> str:
        """
        Generates the text prompt for the Gemini API to create a ride blueprint.

        Args:
            duration: The duration of the audio in seconds.
            bpm: The beats per minute of the audio.
            energy: The energy level of the audio.
            spectral_centroid: The spectral centroid of the audio.
            spectral_flux: The spectral flux of the audio.
            options: Optional dictionary with user-selected generation options.

        Returns:
            A formatted string to be used as the prompt.
        """
        opt_lines = []
        if options:
            if options.get('worldTheme'):
                opt_lines.append(f"World Theme: {options['worldTheme']}")
            if options.get('visualStyle'):
                opt_lines.append(f"Visual Style: {options['visualStyle']}")
            if options.get('paletteHint') and isinstance(options['paletteHint'], list):
                opt_lines.append(f"Palette Hint: {', '.join(options['paletteHint'][:3])}")
        option_block = ('\n'.join(opt_lines) + '\n') if opt_lines else ''

        return f"""
🎵 AUDIO ESSENCE 🎵
Duration: {duration:.0f}s | BPM: {bpm:.0f} | Energy: {energy:.2f}/1.0
Spectral Centroid: {spectral_centroid:.0f}Hz | Spectral Flux: {spectral_flux:.3f}
{option_block}

🎢 CREATIVE MISSION 🎢
You are a synesthetic architect designing an IMPOSSIBLY IMAGINATIVE rollercoaster experience. 
This is not a normal ride - it's a journey through sound made visible, where physics bends to emotion and geometry dances with rhythm.

DESIGN PHILOSOPHY:
• Let the audio's personality guide WILD, UNEXPECTED segment combinations
• If the energy is high, consider explosive drops into tight barrel rolls, loops that defy gravity, climbs that pierce dimensional barriers
• If the BPM is fast, weave rapid turns and quick transitions that feel like controlled chaos
• If spectral flux is high, introduce jarring contrasts: serene climbs suddenly collapsing into vertiginous drops
• AVOID predictable patterns - surprise the rider with impossible transitions
• Think of segments as emotional beats: joy, terror, wonder, transcendence, euphoria
• Use 24-40 segments (MORE SEGMENTS = MORE EVENTS = MORE EXCITEMENT)
• Mix segment types creatively for dynamic flow
• Vary segment lengths (8-20) to create rhythm and pacing

SEGMENT CREATIVITY GUIDELINES:
• climbs: Can be gentle ascents or desperate clawing toward light/chaos
• drops: From gentle descents to reality-shattering plunges  
• turns: Sharp hairpins, sweeping curves, spiral descents through dimensions
• loops: Single perfect circles or dizzying multi-rotation vortexes
• barrelRolls: Quick twists or prolonged tumbling through space-time

EXCITING COMBINATIONS:
• Alternate between different segment types to create variety
• Mix sharp maneuvers with flowing transitions
• Use loops and barrel rolls as dramatic punctuation
• Create crescendos and releases in intensity

SYNESTHETIC LAYER (CRUCIAL):
• geometry.wireframeDensity (0-1): How much the track dissolves into pure energy
• geometry.impossiblePhysics (bool): Track segments that couldn't exist in reality
• geometry.organicBreathing (0-1): Track pulses with music, as if alive
• particles.connectionDensity (0-1): Intensity of particle swarms connecting to the track
• particles.resonanceThreshold (0-1): How aggressively particles react to audio peaks
• atmosphere.skyMood: "transcendent-euphoria", "menacing-void", "crystalline-serenity", "chaotic-ecstasy"
• atmosphere.turbulenceBias (-1 to 1): Negative = smooth, positive = chaotic
• atmosphere.passionIntensity (0+): Emotional intensity of atmospheric effects

NAMING & MOOD:
• rideName: Should be EVOCATIVE and MEMORABLE - examples: "Fracture Point", "The Ascending Scream", "Dopamine Cascade", "Temporal Vertigo"
• moodDescription: Paint a vivid 50-200 word picture of the emotional/sensory journey
• palette: 3-5 hex colors that capture the audio's emotional temperature (vibrant, muted, neon, organic, etc.)

OUTPUT: Return ONLY valid JSON matching the Blueprint schema. Be MAXIMALLY CREATIVE while respecting schema constraints.
"""

    SYSTEM_INSTRUCTION = """
You are a synesthetic architect and impossible geometry artist specializing in audio-reactive experiences.
Your designs transcend conventional rollercoaster logic, creating rides that exist at the intersection of sound, emotion, and surreal physics.

CORE PRINCIPLES:
1. Audio is your blueprint - every frequency, every rhythm shift, every dynamic surge should manifest in track geometry
2. Embrace the impossible - tracks can breathe, dissolve, defy gravity, fold through dimensions
3. Emotional storytelling - each segment transition tells a story of transformation
4. Surprise and delight - avoid predictable patterns, create moments of unexpected wonder
5. Synesthetic integration - deeply specify the synesthetic layer to create immersive, impossible beauty

CREATIVE MANTRAS:
• "What would this sound look like if geometry could dream?"
• "How does this rhythm want to move through space?"
• "What emotion is hiding in this frequency range?"

Always output strictly valid JSON. Push creativity to the MAXIMUM while respecting the schema.
"""

    def _generate_cache_key(self, audio_bytes: bytes, options: dict | None) -> str:
        """Generates a stable cache key from audio content and options."""
        hasher = hashlib.sha256()
        hasher.update(audio_bytes)
        if options:
            # Serialize options in a consistent order
            serialized_options = json.dumps(options, sort_keys=True).encode('utf-8')
            hasher.update(serialized_options)
        return hasher.hexdigest()

    async def generate_blueprint(self, audio_bytes: bytes, content_type: str, options: dict | None = None):
        """
        Generates a ride blueprint by analyzing the audio and querying the Gemini API.

        This method orchestrates the audio analysis, prompt generation, and API call.
        It uses caching to avoid re-processing identical requests and includes a
        procedural fallback if the API call fails.

        Args:
            audio_bytes: The raw bytes of the audio file.
            content_type: The MIME type of the audio file.
            options: Optional dictionary with user-selected generation options.

        Returns:
            A dictionary containing the generated blueprint and the extracted audio features.

        Raises:
            HTTPException: If the initial audio analysis fails and no fallback can be generated.
        """
        # Generate a cache key based on the audio content and generation options
        cache_key = self._generate_cache_key(audio_bytes, options)

        # Check if a valid result is already in the cache
        if cache_key in self.blueprint_cache:
            logger.info("Blueprint found in cache.", cache_key=cache_key)
            return self.blueprint_cache[cache_key]

        audio_features = {}
        try:
            logger.info("Generating new blueprint (not found in cache).", cache_key=cache_key)
            # Asynchronously analyze audio first. If this fails, we can't proceed.
            audio_features = await analyze_audio(audio_bytes)

            prompt = self.generate_prompt_text(
                audio_features["duration"], audio_features["bpm"], audio_features["energy"],
                audio_features["spectralCentroid"], audio_features["spectralFlux"], options
            )

            if not self.client or not types:
                raise RuntimeError("Gemini SDK is not configured. Install google-genai and set GEMINI_API_KEY.")

            # Choose an upload strategy based on payload size:
            # - Inline Part for small payloads (keeps everything in one request)
            # - Files API upload for larger payloads (persist to disk for streaming)
            SIZE_THRESHOLD = 2 * 1024 * 1024  # 2 MB
            if len(audio_bytes) <= SIZE_THRESHOLD:
                audio_part = types.Part.from_bytes(data=audio_bytes, mime_type=content_type or "audio/mpeg")
                contents = [prompt, audio_part]
            else:
                async with self._managed_file_upload(audio_bytes, content_type) as uploaded_file:
                    contents = [prompt, uploaded_file]

            generation_config = types.GenerateContentConfig(
                response_mime_type='application/json', response_schema=Blueprint,
                system_instruction=self.SYSTEM_INSTRUCTION, temperature=1.2,
            )

            response = await self.client.aio.models.generate_content(
                model='gemini-2.0-flash', contents=contents, config=generation_config,
            )

            # Get the blueprint data, preferring parsed Pydantic model
            blueprint_obj = response.parsed if hasattr(response, 'parsed') else json.loads(response.text)
            
            # Convert Pydantic model to dict for consistent JSON serialization
            if blueprint_obj and hasattr(blueprint_obj, 'model_dump'):
                # Pydantic v2 style
                blueprint = blueprint_obj.model_dump(mode='json')
            elif blueprint_obj and hasattr(blueprint_obj, 'dict'):
                # Pydantic v1 style
                blueprint = blueprint_obj.dict()
            else:
                # Already a dict
                blueprint = blueprint_obj
            
            # Add generation options to the blueprint dict
            if blueprint and isinstance(blueprint, dict):
                blueprint['generationOptions'] = options

            result = {"blueprint": blueprint, "features": audio_features}

            # Store the successful result in the cache
            self.blueprint_cache[cache_key] = result
            logger.info("Stored new blueprint in cache.", cache_key=cache_key)

            return result

        except (APIError, BadResponseError) as e:
            logger.error("Gemini API error during blueprint generation", error=str(e), exc_info=True)
            # Fall through to procedural fallback
        except json.JSONDecodeError as e:
            logger.error("Gemini returned invalid JSON", error=str(e), exc_info=True)
            # Fall through to procedural fallback
        except Exception as e:
            # Catch other exceptions (e.g., from audio analysis) and attempt fallback
            logger.error("Unexpected error during blueprint generation", error=str(e), exc_info=True)
            # If audio features are missing, we cannot run fallback.
            if not audio_features:
                raise HTTPException(status_code=500, detail=f"Failed to generate blueprint due to an initial error: {e}")

        # Fallback path
        try:
            logger.warning("Falling back to procedural blueprint generation.")
            fb = self._procedural_fallback(audio_features)
            return {"blueprint": fb, "features": audio_features}
        except Exception as e:
            logger.error("Procedural fallback failed", error=str(e), exc_info=True)
            raise HTTPException(status_code=500, detail=f"Failed to generate fallback blueprint: {e}")

    def _procedural_fallback(self, features: dict) -> dict:
        """
        Generate a simple procedural blueprint when Gemini API is unavailable.
        Creates a basic but valid track structure based on audio features.
        """
        import math
        
        duration = features.get('duration', 120)
        bpm = features.get('bpm', 120)
        energy = features.get('energy', 0.5)
        
        # Calculate number of segments based on duration (aim for ~8-12 seconds per segment)
        num_segments = max(12, min(30, int(duration / 8)))
        
        # Create a simple track with variety
        track = []
        segment_types = ['climb', 'drop', 'turn', 'loop', 'barrelRoll']
        
        for i in range(num_segments):
            # Vary intensity based on position and energy
            intensity = 30 + (energy * 40) + (20 * math.sin(i * math.pi / num_segments))
            
            # Choose segment type based on intensity and position
            if intensity > 70:
                if i % 5 == 0:
                    segment = {
                        'component': 'loop',
                        'radius': 50 + (intensity * 0.5),
                        'intensity': intensity,
                    }
                elif i % 3 == 0:
                    segment = {
                        'component': 'barrelRoll',
                        'rotations': 1,
                        'length': 80,
                        'intensity': intensity,
                    }
                else:
                    segment = {
                        'component': 'drop',
                        'length': 60 + (intensity * 0.8),
                        'angle': -30 - (intensity * 0.3),
                        'intensity': intensity,
                    }
            elif intensity > 45:
                if i % 2 == 0:
                    segment = {
                        'component': 'turn',
                        'length': 70,
                        'direction': 'left' if i % 4 == 0 else 'right',
                        'angle': 45 + (intensity * 0.5),
                        'radius': 100,
                        'intensity': intensity,
                    }
                else:
                    segment = {
                        'component': 'climb',
                        'length': 60,
                        'angle': 20 + (intensity * 0.2),
                        'intensity': intensity,
                    }
            else:
                segment = {
                    'component': 'climb',
                    'length': 50,
                    'angle': 10,
                    'intensity': intensity,
                }
            
            track.append(segment)
        
        # Generate a simple color palette based on energy
        if energy > 0.7:
            palette = ['#FF6B6B', '#FFA500', '#FFD700']  # Warm, energetic
        elif energy > 0.4:
            palette = ['#4ECDC4', '#45B7D1', '#96CEB4']  # Cool, balanced
        else:
            palette = ['#9B59B6', '#8E44AD', '#E8DAEF']  # Purple, calm
        
        return {
            'rideName': 'Procedural Ride',
            'moodDescription': f'A procedurally generated ride with {num_segments} segments, matching the audio\'s energy level of {energy:.2f}.',
            'palette': palette,
            'track': track,
        }

    def generate_skybox_prompt(self, prompt: str, blueprint_data: dict | None = None, options: dict | None = None) -> str:
        """
        Generates a detailed, contextual prompt for the skybox image generation.

        Args:
            prompt: The base prompt or mood description.
            blueprint_data: Optional full blueprint for additional context.
            options: Optional hints that further constrain the skybox aesthetics.

        Returns:
            A rich, formatted string to be used as the prompt for image generation.
        """
        # Build a rich, contextual prompt using blueprint data if available
        if blueprint_data:
            ride_name = blueprint_data.get('rideName', 'Unknown Ride')
            mood = blueprint_data.get('moodDescription', prompt)
            palette = blueprint_data.get('palette', [])

            palette_desc = ""
            if palette and len(palette) >= 3:
                palette_desc = f"\n• Color Palette: A harmonious blend of {palette[0]} (dominant), {palette[1]} (accent), and {palette[2]} (ambient)."

            # Integrate generation options if provided
            opt_lines = []
            if options:
                if options.get('worldTheme'):
                    opt_lines.append(f"Theme: {options.get('worldTheme')}")
                if options.get('visualStyle'):
                    opt_lines.append(f"Visual style: {options.get('visualStyle')}")
                if options.get('paletteHint') and isinstance(options.get('paletteHint'), list):
                    opt_lines.append(f"Palette hint: {', '.join(options.get('paletteHint')[:3])}")

            options_block = ('\n'.join(opt_lines) + '\n') if opt_lines else ''

            return f"""🌌 SKYBOX VISION FOR "{ride_name}" 🌌

EMOTIONAL NARRATIVE:
{mood}

ARTISTIC DIRECTION:
You are creating the celestial stage for an impossible journey - a sky that transcends reality itself.
This is not merely a backdrop, but an active participant in the ride's emotional arc.

CORE AESTHETICS:
• Style: Surreal photorealism blending dreamlike wonder with cinematic grandeur{palette_desc}
• Atmosphere: {', '.join([c for c in palette[:3]]) if palette else 'Emotionally resonant colors'} dominating the color palette
• Mood Keywords: Transcendent, breathtaking, otherworldly, immersive, infinite
{options_block}
CREATIVE VISION:
- Imagine skies that exist beyond Earth: nebulae weaving through aurora, crystalline cloud formations, bioluminescent atmospheres
- If mood is intense/energetic: Dramatic storm fronts, swirling vortexes, lightning dancing across dimensional rifts
- If mood is serene/contemplative: Ethereal twilight gradients, soft volumetric god rays, floating islands of cumulus
- If mood is chaotic/ecstatic: Reality-bending color explosions, geometric fractals in cloud formations, impossible light phenomena
- Incorporate DEEP atmospheric perspective - distant layers fading into cosmic infinity
- Use volumetric lighting as emotional punctuation: divine rays, soft glows, lens flares suggesting something beyond

TECHNICAL SPECS:
- Format: Seamless 360° equirectangular projection (perfect tiling required)
- Content Restrictions: ZERO people, characters, silhouettes, text, signage, recognizable landmarks
- Focus: Pure atmospheric poetry - sky, clouds, light, color, space, celestial phenomena

ARTISTIC INFLUENCES:
Think: Terrence Malick cinematography meets Alex Grey cosmic visions meets Roger Deakins lighting mastery meets Studio Ghibli dreamscapes.

OUTPUT: A skybox that makes riders feel they're hurtling through a realm where physics and beauty merge into pure emotional experience."""
        else:
            return f"""🌌 CREATE AN IMPOSSIBLE SKY 🌌

MOOD ESSENCE: {prompt}

ARTISTIC MANDATE:
Design a celestial environment that transcends earthly skies. This is a dreamscape, a visual poem, a cosmic stage for an impossible journey.

CREATIVE FREEDOM:
- Blend surreal beauty with photorealistic detail
- Imagine skies from alien worlds, parallel dimensions, abstract emotional planes
- Use color, light, and form to tell an emotional story
- Volumetric clouds that feel alive, light that behaves impossibly, atmospheres that breathe

STYLE INSPIRATION:
Cinematic mastery (Roger Deakins lighting) × Cosmic wonder (Hubble imagery) × Dreamlike surrealism (Studio Ghibli) × Emotional intensity (Terrence Malick)

TECHNICAL REQUIREMENTS:
- Perfect 360° equirectangular projection (seamless tiling)
- NO people, characters, text, signage, recognizable objects
- Pure atmospheric poetry: sky, clouds, light, space, celestial phenomena

OUTPUT: A skybox that transforms a ride into a journey through living emotion made visible."""

    async def generate_skybox(self, prompt: str, blueprint_data: dict | None = None, options: dict | None = None):
        """
        Generates a skybox image using the Gemini API.

        This method constructs a detailed prompt and calls the image generation model.

        Args:
            prompt: The base prompt (mood/theme) for the image.
            blueprint_data: Optional full blueprint for additional context.
            options: Optional hints that further constrain the skybox aesthetics.

        Returns:
            A dictionary containing the `imageUrl` of the generated skybox.

        Raises:
            HTTPException: If the Gemini client is unavailable or if the API call fails.
        """
        # Check if Gemini client is available
        if not self.client:
            raise HTTPException(
                status_code=503,
                detail="Gemini client not available. Please check GEMINI_API_KEY configuration."
            )

        try:
            full_prompt = self.generate_skybox_prompt(prompt, blueprint_data, options)

            # Use Gemini 2.5 Flash Image for conversational image generation
            # This model excels at contextual, conversational image generation
            response = await self.client.aio.models.generate_content(
                model='gemini-2.5-flash-image',
                contents=[full_prompt],
                config=types.GenerateContentConfig(
                    response_modalities=['Image'],  # Request only image output
                )
            )

            # Extract the generated image from response parts
            image_bytes = None
            for part in response.candidates[0].content.parts:
                if part.inline_data is not None:
                    image_bytes = part.inline_data.data
                    break
            
            if not image_bytes:
                raise Exception("No image generated in response")

            import base64
            base64_image = base64.b64encode(image_bytes).decode('utf-8')

            return {"imageUrl": f"data:image/jpeg;base64,{base64_image}"}
            
        except APIError as e:
            if hasattr(e, 'status'):
                if e.status == 401:
                    raise HTTPException(status_code=401, detail="Authentication failed. Please check the API key.")
                elif e.status == 400:
                    raise HTTPException(status_code=400, detail=f"Invalid request for skybox generation: {str(e)}")
            raise HTTPException(status_code=500, detail=f"API error during skybox generation: {str(e)}")
        except Exception as e:
            logger.error("Skybox generation error", error=str(e), exc_info=True)
            raise HTTPException(status_code=500, detail=f"An unexpected error occurred during image generation: {e}")

gemini_service = GeminiService()