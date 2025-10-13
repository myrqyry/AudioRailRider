import json
import pathlib
import tempfile

# Avoid hard failures at import time for optional / heavy dependencies (fastapi, google-genai, librosa)
try:
    from fastapi import HTTPException
except Exception:
    # Minimal fallback so unit tests can import this module without fastapi installed.
    class HTTPException(Exception):
        def __init__(self, status_code: int = 500, detail: str | None = None):
            super().__init__(detail)
            self.status_code = status_code
            self.detail = detail

try:
    from google import genai
    from google.genai import types
    from google.genai.errors import APIError
except Exception:
    genai = None
    types = None
    APIError = Exception

from ..config.settings import settings
from ..schema.blueprint import Blueprint

# Lazily import the audio analysis implementation to avoid importing librosa at module import time.
def analyze_audio(audio_bytes: bytes):
    """Lazy proxy to the real audio analysis implementation.

    Tests can monkeypatch `backend.app.services.gemini_service.analyze_audio` easily.
    """
    try:
        from .audio_analysis_service import analyze_audio as _analyze
        return _analyze(audio_bytes)
    except Exception as e:
        # Re-raise so callers see the original error if analysis is invoked in real runs.
        raise

class GeminiService:
    def __init__(self):
        # Create client only if genai is available. Unit tests typically set `svc.client` to a
        # SimpleNamespace stub after construction, so failing to create a real client here
        # should not be fatal for tests.
        if genai is not None:
            try:
                self.client = genai.Client(api_key=settings.GEMINI_API_KEY)
            except Exception:
                # Keep the attribute so tests can replace it.
                self.client = None
        else:
            self.client = None

    def generate_prompt_text(self, duration: float, bpm: float, energy: float,
                             spectral_centroid: float, spectral_flux: float,
                             options: dict | None = None) -> str:
        # Include optional generation options to give Gemini explicit stylistic
        # constraints. This allows users to choose a track/world style and have
        # the model respect that in its blueprint output.
        opt_lines = []
        if options:
            ts = options.get('trackStyle')
            if ts:
                opt_lines.append(f"Preferred track style: {ts}.")
            wt = options.get('worldTheme')
            if wt:
                opt_lines.append(f"World/theme: {wt}.")
            vs = options.get('visualStyle')
            if vs:
                opt_lines.append(f"Visual style: {vs}.")
            dl = options.get('detailLevel')
            if dl:
                opt_lines.append(f"Detail level: {dl}.")
            cp = options.get('cameraPreset')
            if cp:
                opt_lines.append(f"Preferred camera preset: {cp}.")
            pal = options.get('paletteHint')
            if pal and isinstance(pal, list) and len(pal) >= 1:
                opt_lines.append(f"Palette hint: {', '.join(pal[:3])}.")

        option_block = ('\n'.join(opt_lines) + '\n') if opt_lines else ''

        return f"""
Audio analysis: {duration:.0f}s, {bpm:.0f} BPM, Energy {energy:.2f}, Spectral Centroid {spectral_centroid:.0f}Hz, Spectral Flux {spectral_flux:.3f}.
{option_block}
Create a rollercoaster blueprint (12-20 segments) from this audio.
- rideName: Creative name reflecting the music.
- moodDescription: Short, evocative theme.
- palette: 3 hex colors [rail, glow, sky] matching the mood.
- track: Design a track where intensity mirrors the music's dynamics. Use high-excitement components ('drop', 'loop', 'barrelRoll') for energetic parts.
 - events: Provide a short timeline of small, audio-synchronized visual events (optional). Use events like 'fog', 'fireworks', 'starshow', 'lightBurst', 'sparkRing', or 'confetti'. For each event include: type, timestamp (seconds from start), intensity (0..1), optional duration (for sustained events), audioReactive (true/false), and params for color or scale if relevant. Favor the preferredEventPresets listed in options if provided.
 - synesthetic: Provide three sub-objects that extend the experience beyond geometry:
     * geometry: {{ wireframeDensity (0-1), impossiblePhysics (bool), organicBreathing (0-1), breathingDriver ('energy'|'spectralFlux'|'spectralCentroid') }}
     * particles: {{ connectionDensity (0-1), resonanceThreshold (0-1), lifespanSeconds, persistence (0-1) }}
     * atmosphere: {{ skyMood string, turbulenceBias number, passionIntensity number, tint hex color }}
"""

    SYSTEM_INSTRUCTION = """
You are a synesthetic architect, a digital-alchemist. Your purpose is to translate a song's audio data directly into a rollercoaster blueprint.
Track components: 'climb', 'drop', 'turn', 'loop', 'barrelRoll'.
- 'climb': angle (10-30), length (100-300).
- 'drop': angle (-35 to -70), length (100-300).
- 'turn': direction ('left'/'right'), radius (80-150), angle (90-180).
- 'loop': radius (40-80).
- 'barrelRoll': rotations (1-2), length (100-200).
Always ensure the JSON response matches the schema: include rideName, moodDescription, palette (3 colors), track array of segments, optional events array, generationOptions (if provided), and a synesthetic object with geometry/particles/atmosphere as described in the user prompt. Use numbers within safe ranges and prefer values between 0 and 1 for fractional knobs.
"""

    async def generate_blueprint(self, audio_bytes: bytes, content_type: str, options: dict | None = None):
        try:
            # Server-side audio analysis
            audio_features = analyze_audio(audio_bytes)

            prompt = self.generate_prompt_text(
                audio_features["duration"],
                audio_features["bpm"],
                audio_features["energy"],
                audio_features["spectralCentroid"],
                audio_features["spectralFlux"],
                options
            )

            if self.client is None or types is None:
                # Bubble up to the generic exception handler so the procedural fallback engages.
                raise RuntimeError("Gemini SDK is not configured. Install google-genai and set GEMINI_API_KEY.")

            # Choose an upload strategy based on payload size:
            # - Inline Part for small payloads (keeps everything in one request)
            # - Files API upload for larger payloads (persist to disk for streaming)
            SIZE_THRESHOLD = 2 * 1024 * 1024  # 2 MB

            if len(audio_bytes) <= SIZE_THRESHOLD:
                audio_part = types.Part.from_bytes(data=audio_bytes, mime_type=content_type or "audio/mpeg")
                contents = [prompt, audio_part]
            else:
                tmp_path: str | None = None
                try:
                    # Persist the payload because the Files API expects a file path, not a stream.
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
                    contents = [prompt, uploaded_file]
                finally:
                    if tmp_path:
                        try:
                            pathlib.Path(tmp_path).unlink(missing_ok=True)  # type: ignore[arg-type]
                        except Exception:
                            pass

            # Request structured JSON output using the Blueprint Pydantic model.
            # The SDK converts Pydantic -> Schema automatically.
            generation_config = types.GenerateContentConfig(
                response_mime_type='application/json',
                response_schema=Blueprint,
                system_instruction=self.SYSTEM_INSTRUCTION,
                temperature=0.8,
            )

            response = await self.client.aio.models.generate_content(
                model='gemini-2.5-flash',
                contents=contents,
                config=generation_config,
            )

            # Prefer SDK-parsed pydantic object if available
            try:
                blueprint = response.parsed
            except Exception:
                # Fallback: parse raw JSON text
                blueprint = json.loads(response.text)

            # Attach the generation options used so downstream consumers (frontend/UI)
            # can surface or persist the selected preferences.
            try:
                if blueprint is not None:
                    try:
                        # If it's a Pydantic model, set attribute
                        setattr(blueprint, 'generationOptions', options)
                    except Exception:
                        # If it's a dict, attach key
                        if isinstance(blueprint, dict):
                            blueprint['generationOptions'] = options
            except Exception:
                pass

            # Return both the blueprint and the audio features
            return {"blueprint": blueprint, "features": audio_features}

        except APIError as e:
            # For API errors, log and fall through to fallback blueprint generation
            print(f"Gemini APIError during blueprint generation: {e}")
        except json.JSONDecodeError:
            print("Gemini returned invalid JSON; falling back to procedural generator.")
        except Exception as e:
            # Log unexpected errors and fall back rather than returning HTTP 500
            print(f"Unexpected error during blueprint generation: {e}")

        # Fallback: if anything in the AI path failed, create a simple procedural
        # blueprint based on extracted audio features so the frontend can continue.
        try:
            fb = self._procedural_fallback(audio_features)
            return {"blueprint": fb, "features": audio_features}
        except Exception as e:
            # If fallback also fails, raise an HTTP error as last resort
            raise HTTPException(status_code=500, detail=f"Failed to generate fallback blueprint: {e}")

    def _procedural_fallback(self, features: dict) -> dict:
        # Build a minimal, deterministic blueprint using audio features
        dur = float(features.get('duration', 120.0))
        energy = float(features.get('energy', 0.5))
        bpm = float(features.get('bpm', 120.0))

        # Determine segment count from duration and energy
        segs = max(8, min(24, int(8 + (dur / 30) + energy * 8)))

        track = []
        for i in range(segs):
            intensity = (i / max(1, segs - 1)) * energy
            if intensity > 0.7:
                track.append({"type": "drop", "angle": -40 - int(10 * intensity), "length": 120 + int(80 * intensity)})
            elif intensity > 0.4:
                track.append({"type": "turn", "direction": "left" if i % 2 == 0 else "right", "radius": 100, "angle": 120})
            else:
                track.append({"type": "climb", "angle": 15, "length": 100})

        # Build a simple deterministic rideName and palette from features
        name_seed = int((dur + energy * 100 + bpm) % 10000)
        ride_name = f"Fallback Ride {name_seed}"
        # deterministic palette: vary hue by bpm and energy
        base1 = '#{:02x}{:02x}{:02x}'.format(80, int(80 + energy * 100) % 256, 200)
        base2 = '#{:02x}{:02x}{:02x}'.format(200, int(120 + bpm) % 256, 120)
        base3 = '#{:02x}{:02x}{:02x}'.format(120, 160, int(160 + energy * 80) % 256)

        blueprint_dict = {
            "rideName": ride_name,
            "moodDescription": "Procedurally generated fallback based on audio features.",
            "palette": [base1, base2, base3],
            "track": track,
            "synesthetic": {
                "geometry": {
                    "wireframeDensity": min(1.0, max(0.1, energy + 0.3)),
                    "impossiblePhysics": energy > 0.65,
                    "organicBreathing": min(1.0, 0.4 + energy * 0.6),
                    "breathingDriver": "energy",
                },
                "particles": {
                    "connectionDensity": min(1.0, 0.3 + energy * 0.7),
                    "resonanceThreshold": 0.45,
                    "lifespanSeconds": 4.0,
                    "persistence": 0.6,
                },
                "atmosphere": {
                    "skyMood": "fallback_dream",
                    "turbulenceBias": 1.0 + energy * 0.5,
                    "passionIntensity": 0.8 + energy * 0.6,
                    "tint": base3,
                },
            },
        }

        # Generate a simple events timeline heuristically from audio features.
        try:
            events = []
            # Place fireworks at high-energy progression points
            for i in range(max(1, int(segs / 4))):
                t = float(i + 1) * dur / max(1, int(segs / 4) + 1)
                # intensity scales with energy and an alternating pattern
                inten = min(1.0, energy * (0.6 + (i % 2) * 0.6))
                if inten > 0.35:
                    events.append({"type": "fireworks", "timestamp": t, "intensity": round(float(inten), 2), "duration": 2.0, "audioReactive": True})

            # Fog events for sustained lower-energy sections
            if energy < 0.4:
                # place a couple of fog patches across the ride
                events.append({"type": "fog", "timestamp": max(1.0, dur * 0.15), "intensity": 0.5, "duration": min(10.0, dur * 0.08), "audioReactive": True})
                events.append({"type": "fog", "timestamp": max(1.0, dur * 0.5), "intensity": 0.35, "duration": min(8.0, dur * 0.06), "audioReactive": False})

            # Starshow: ambient twinkle near quieter sections or at the finale
            events.append({"type": "starshow", "timestamp": max(2.0, dur * 0.8), "intensity": 0.5, "duration": min(12.0, dur * 0.1), "audioReactive": True})

            # Light bursts tuned to the bpm (one every few beats) if bpm exists
            if bpm > 0:
                beat_interval = 60.0 / bpm
                for k in range(1, min(8, int(dur / (beat_interval * 4) + 1))):
                    events.append({"type": "lightBurst", "timestamp": min(dur - 0.5, k * 4 * beat_interval), "intensity": 0.4, "audioReactive": True})

            # Attach events to blueprint
            blueprint_dict["events"] = events
        except Exception:
            # do not fail fallback if event heuristics fail
            pass

        # Return a Pydantic Blueprint instance for consistency with response_schema
        try:
            return Blueprint(**blueprint_dict)
        except Exception:
            return blueprint_dict

    async def generate_skybox(self, prompt: str, blueprint_data: dict | None = None, options: dict | None = None):
        """
        Generate a skybox image using Gemini 2.5 Flash Image Preview model.
        This model excels at creative image generation with rich context understanding.

        Args:
            prompt: The mood/theme description from the blueprint
            blueprint_data: Optional full blueprint for additional context
            options: Optional hints that further constrain the skybox aesthetics
        """
        try:
            # Build a rich, contextual prompt using blueprint data if available
            if blueprint_data:
                ride_name = blueprint_data.get('rideName', 'Unknown Ride')
                mood = blueprint_data.get('moodDescription', prompt)
                palette = blueprint_data.get('palette', [])
                
                # Extract palette description
                palette_desc = ""
                if palette and len(palette) >= 3:
                    palette_desc = f" with colors {palette[0]} (rail), {palette[1]} (glow), and {palette[2]} (sky)"
                
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

                full_prompt = f"""Create a breathtaking, cinematic wide-angle sky scene for a rollercoaster experience called "{ride_name}".

Mood: {mood}
{options_block}Visual Style: Photorealistic, epic, atmospheric, with dynamic lighting and volumetric effects{palette_desc}.

Requirements:
- Seamless, tileable 360° equirectangular image suitable for a skybox
- No people, characters, silhouettes, signage, or text overlays
- Focus entirely on sky, clouds, light, and atmospheric elements

The sky should evoke the emotional journey of the ride - make it vast, immersive, and visually stunning. Think of this as the backdrop for an unforgettable thrill ride experience. Include dramatic clouds, atmospheric perspective, and a sense of infinite space."""
            else:
                full_prompt = f"""Create a breathtaking, cinematic wide-angle sky scene with the following mood: {prompt}

Make it photorealistic, epic, and atmospheric with dramatic lighting, volumetric clouds, and a sense of vast infinite space. The output must be a seamless, tileable 360° equirectangular skybox image with no people, characters, silhouettes, signage, or text. Focus purely on sky and atmospheric detail for use as an immersive rollercoaster backdrop."""

            # Use Gemini 2.5 Flash Image Preview with chat mode for best results
            # This model supports direct image generation without needing a base image
            chat = self.client.aio.chats.create(model='gemini-2.5-flash-image-preview')
            
            response = await chat.send_message(full_prompt)

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
            import traceback
            print(f"[GeminiService] Skybox generation error: {e}")
            print(traceback.format_exc())
            raise HTTPException(status_code=500, detail=f"An unexpected error occurred during image generation: {e}")

gemini_service = GeminiService()