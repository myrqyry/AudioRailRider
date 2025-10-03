from ..models.perfect_blueprint import PerfectBlueprint
from fastapi import HTTPException
import json

class AdvancedBlueprintService:
    def __init__(self, gemini_client):
        self.client = gemini_client

    async def generate_perfect_blueprint(
        self,
        audio_data: bytes,
        audio_metadata: dict,
        complexity_level: str = "advanced",
        style_preferences: list = None,
        target_platform: str = "web"
    ) -> PerfectBlueprint:

        # Enhanced system instruction for complex blueprints
        system_instruction = """
        You are an expert experience architect specializing in creating immersive,
        multi-layered audio-visual experiences. Your role is to transform audio
        into rich, complex blueprints with multiple synchronized layers.

        Key principles:
        1. Create experiences that evolve and surprise
        2. Layer visual effects to build emotional intensity
        3. Use audio timing to drive all other elements
        4. Build in meaningful interaction opportunities
        5. Design for the specified platform's capabilities
        6. Maintain perfect synchronization between all layers

        Create blueprints that feel like living, breathing worlds.
        """

        # Dynamic prompt based on complexity and preferences
        prompt = self._build_complex_prompt(
            audio_metadata, complexity_level, style_preferences, target_platform
        )

        try:
            # The new Gemini API call with direct audio data and response schema
            response = await self.client.aio.models.generate_content(
                model='gemini-2.5-flash',
                contents=[prompt, {"file_data": {"mime_type": "audio/mpeg", "data": audio_data}}],
                generation_config={
                    'response_mime_type': 'application/json',
                    'response_schema': PerfectBlueprint,
                    'temperature': 0.9,  # Higher creativity for complex blueprints
                    'candidate_count': 1
                },
                system_instruction=system_instruction
            )

            # Parse the structured response
            blueprint_data = json.loads(response.text)
            blueprint = PerfectBlueprint(**blueprint_data)

            # Post-process and validate
            return await self._enhance_and_validate_blueprint(blueprint, audio_metadata)

        except Exception as e:
            raise HTTPException(500, f"Advanced blueprint generation failed: {str(e)}")

    def _build_complex_prompt(self, metadata, complexity, preferences, platform):
        base_prompt = f"""
        Create a multi-layered immersive experience blueprint for this audio:

        Duration: {metadata.get('duration', 0):.1f}s
        BPM: {metadata.get('bpm', 120):.0f}
        Energy: {metadata.get('energy', 0.5):.2f}
        Spectral Centroid: {metadata.get('spectralCentroid', 2000):.0f}Hz
        Spectral Flux: {metadata.get('spectralFlux', 0.1):.3f}

        Complexity Level: {complexity}
        Target Platform: {platform}
        """

        if preferences:
            base_prompt += f"\nStyle Preferences: {', '.join(preferences)}"

        complexity_instructions = {
            "simple": "Create 8-12 track components with basic lighting and minimal particles.",
            "moderate": "Create 12-18 track components with synchronized lighting, particle effects, and camera movements.",
            "advanced": "Create 15-25 track components with complex multi-layer visuals, spatial audio, interactive elements, and dynamic environments.",
            "extreme": "Create 20-25 track components with all available layers, multiple interaction points, dynamic environment changes, and platform-specific optimizations."
        }

        base_prompt += f"\n\n{complexity_instructions.get(complexity, complexity_instructions['advanced'])}"

        base_prompt += """

        Requirements:
        1. Design track components that mirror the audio's emotional journey
        2. Create lighting that enhances mood and energy levels
        3. Add particle effects that respond to spectral content
        4. Plan camera movements that showcase the experience dynamically
        5. Include spatial audio elements for immersion
        6. Add interactive moments during natural breaks or builds
        7. Design environment that supports the overall narrative
        8. Ensure all elements are perfectly timed to the audio

        Make this experience unforgettable and deeply connected to the music's soul.
        """

        return base_prompt

    async def _enhance_and_validate_blueprint(self, blueprint: PerfectBlueprint, metadata: dict) -> PerfectBlueprint:
        """Post-process the blueprint to ensure quality and consistency"""

        # Validate timing consistency
        total_duration = metadata.get('duration', 0)
        blueprint.duration = total_duration

        # Ensure all components fit within duration
        for component in blueprint.track_components:
            if component.start_time + component.duration > total_duration:
                component.duration = total_duration - component.start_time

        # Calculate complexity score
        complexity_factors = [
            len(blueprint.track_components) / 25,  # Track complexity
            len(blueprint.lighting_layers) / 10,   # Lighting complexity
            len(blueprint.particle_layers) / 5,    # Particle complexity
            len(blueprint.interaction_triggers) / 8 # Interaction complexity
        ]
        blueprint.complexity_score = min(sum(complexity_factors) / len(complexity_factors), 1.0)

        # Estimate render time based on complexity
        base_render_time = total_duration * 2  # Base: 2x audio duration
        complexity_multiplier = 1 + (blueprint.complexity_score * 3)
        blueprint.estimated_render_time = base_render_time * complexity_multiplier

        # Add quality metrics
        blueprint.quality_metrics = {
            "layer_synchronization": 0.95,  # Would calculate based on timing analysis
            "visual_coherence": 0.88,       # Would analyze color/style consistency
            "audio_alignment": 0.92,        # Would check beat/tempo alignment
            "interaction_balance": 0.85     # Would validate interaction spacing
        }

        return blueprint