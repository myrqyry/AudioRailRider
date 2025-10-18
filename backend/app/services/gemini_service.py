import json
import structlog
import pathlib
import tempfile
import asyncio
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
from ..schema.blueprint import Blueprint, TrackLayout, SegmentDefinition, ClimbSegment, DropSegment, TurnSegment, LoopSegment, BarrelRollSegment

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
    A service class to interact with the Gemini API.
    """
    def __init__(self):
        """
        Initializes the GeminiService, setting up the Gemini client.
        """
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

    def generate_layout_prompt(self, audio_features: dict, options: dict | None = None) -> str:
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
Duration: {audio_features.get('duration', 0):.0f}s | BPM: {audio_features.get('bpm', 0):.0f} | Energy: {audio_features.get('energy', 0):.2f}/1.0
{option_block}

🎢 CREATIVE MISSION: HIGH-LEVEL LAYOUT 🎢
You are a master rollercoaster designer, planning the overall emotional journey of a ride based on a song's essence.
Your task is to define the high-level structure of the ride by creating a sequence of segment definitions.

DESIGN PRINCIPLES:
- Translate the song's structure into a sequence of 5-20 high-level track segments.
- Each segment should have a type, a duration percentage, and an intensity score.
- The sum of all `duration_percentage` values should be 100.
- Use the audio features to inform your design choices. High energy might suggest drops and loops, while lower energy sections might be turns or climbs.
- Create a compelling emotional arc with peaks and valleys of intensity.

OUTPUT: Return ONLY valid JSON matching the TrackLayout schema.
"""

    def generate_segment_prompt(self, segment_definition: dict) -> str:
        segment_type = segment_definition.get('segment_type', 'turn')
        intensity = segment_definition.get('intensity', 50)

        return f"""
🎢 SEGMENT DESIGN MISSION: {segment_type.upper()} 🎢
Intensity: {intensity:.2f}/100

Based on the high-level segment definition and the overall audio essence, design a detailed track segment.

- For turns, specify direction, angle, and radius.
- For drops and climbs, specify length and angle.
- For loops, specify radius and rotations.
- For barrel rolls, specify rotations and length.

Be creative and ensure the segment's parameters reflect the specified intensity.
A higher intensity should result in more extreme values (e.g., sharper turns, steeper drops).

OUTPUT: Return ONLY a single valid JSON object matching the {segment_type.capitalize()}Segment schema.
"""

    SYSTEM_INSTRUCTION = """
You are a synesthetic architect and impossible geometry artist specializing in audio-reactive experiences.
Your designs transcend conventional rollercoaster logic, creating rides that exist at the intersection of sound, emotion, and surreal physics.
Always output strictly valid JSON. Push creativity to the MAXIMUM while respecting the schema.
"""

    async def generate_layout(self, audio_features: dict, options: dict | None = None) -> dict:
        if not self.client or not types:
            raise RuntimeError("Gemini SDK is not configured.")

        prompt = self.generate_layout_prompt(audio_features, options)
        generation_config = types.GenerateContentConfig(
            response_mime_type='application/json', response_schema=TrackLayout,
            system_instruction=self.SYSTEM_INSTRUCTION, temperature=1.2,
        )
        response = await self.client.aio.models.generate_content(
            model='gemini-2.0-flash', contents=[prompt], config=generation_config,
        )
        return self._convert_to_dict(response.parsed if hasattr(response, 'parsed') else json.loads(response.text))

    async def generate_detailed_segment(self, segment_definition: dict) -> dict:
        if not self.client or not types:
            raise RuntimeError("Gemini SDK is not configured.")
            
        prompt = self.generate_segment_prompt(segment_definition)
        segment_type_name = segment_definition.get('segment_type', 'turn').capitalize()
        SegmentSchema = {
            'Climb': ClimbSegment,
            'Drop': DropSegment,
            'Turn': TurnSegment,
            'Loop': LoopSegment,
            'BarrelRoll': BarrelRollSegment,
        }.get(segment_type_name, TurnSegment)

        generation_config = types.GenerateContentConfig(
            response_mime_type='application/json', response_schema=SegmentSchema,
            system_instruction=self.SYSTEM_INSTRUCTION, temperature=1.0,
        )
        response = await self.client.aio.models.generate_content(
            model='gemini-2.0-flash', contents=[prompt], config=generation_config,
        )
        return self._convert_to_dict(response.parsed if hasattr(response, 'parsed') else json.loads(response.text))

    def _convert_to_dict(self, obj):
        if hasattr(obj, 'model_dump'):
            return obj.model_dump(mode='json')
        elif isinstance(obj, str):
            try:
                return json.loads(obj)
            except json.JSONDecodeError:
                logger.error("Failed to decode JSON string from Gemini", detail=obj)
                return {}
        elif isinstance(obj, dict):
            return obj
        return {}

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

class TrackGeneratorService:
    def __init__(self, gemini_service: GeminiService):
        self.gemini_service = gemini_service
        self.blueprint_cache = TTLCache(maxsize=100, ttl=3600)
        self._cache_lock = asyncio.Lock()

    def _generate_cache_key(self, audio_bytes: bytes, options: dict | None) -> str:
        hasher = hashlib.sha256()
        hasher.update(audio_bytes)
        if options:
            serialized_options = json.dumps(options, sort_keys=True).encode('utf-8')
            hasher.update(serialized_options)
        return hasher.hexdigest()

    async def generate_full_blueprint(self, audio_bytes: bytes, content_type: str, options: dict | None = None):
        cache_key = self._generate_cache_key(audio_bytes, options)
        async with self._cache_lock:
            if cache_key in self.blueprint_cache:
                return self.blueprint_cache[cache_key]

        audio_features = await analyze_audio(audio_bytes)

        try:
            layout = await self.gemini_service.generate_layout(audio_features, options)

            detailed_segments = []
            for segment_def in layout.get('segments', []):
                detailed_segment = await self.gemini_service.generate_detailed_segment(segment_def)
                detailed_segments.append(detailed_segment)

            blueprint = {
                "rideName": layout.get('ride_name'),
                "moodDescription": layout.get('mood_description'),
                "palette": layout.get('palette'),
                "track": detailed_segments,
                "generationOptions": options,
                "synesthetic": None
            }

            result = {"blueprint": blueprint, "features": audio_features}

            async with self._cache_lock:
                self.blueprint_cache[cache_key] = result
            return result

        except Exception as e:
            logger.error("Blueprint generation failed, falling back to procedural.", error=str(e), exc_info=True)
            fb = self._procedural_fallback(audio_features)
            return {"blueprint": fb, "features": audio_features}

    def _procedural_fallback(self, features: dict) -> dict:
        import math
        duration = features.get('duration', 120)
        num_segments = max(12, min(30, int(duration / 8)))
        track = []
        for i in range(num_segments):
            intensity = 50 + (25 * math.sin(i * math.pi / num_segments))
            if intensity > 70:
                segment = {'component': 'drop', 'length': 80, 'angle': -45}
            elif intensity > 55:
                segment = {'component': 'turn', 'direction': 'left' if i%2 else 'right', 'angle': 90, 'radius': 100, 'length': 100}
            else:
                segment = {'component': 'climb', 'length': 60, 'angle': 20}
            track.append(segment)

        palette = ['#FF6B6B', '#FFA500', '#FFD700']

        return {
            'rideName': 'Procedural Fallback Ride',
            'moodDescription': 'A procedurally generated ride created as a fallback.',
            'palette': palette,
            'track': track,
        }

gemini_service = GeminiService()