import random
import math
import numpy as np
from typing import List, Dict, Any, Tuple
from ..models.enhanced_models import TrackComponent, TrackComponentType, AudioReactiveProperties, VisualEffects

class AdvancedTrackGenerator:
    """Generates exciting, varied coaster tracks based on detailed audio analysis"""
    def __init__(self):
        self.component_energy_map = self._build_component_energy_map()
        self.transition_rules = self._build_transition_rules()

    def _build_component_energy_map(self):
        return {}

    def _build_transition_rules(self):
        return {}

    def generate_track(self, audio_features: Dict[str, Any]) -> List[TrackComponent]:
        """Generate an exciting track based on comprehensive audio analysis"""
        # Extract detailed features
        duration = audio_features.get("duration", 60)
        bpm = audio_features.get("bpm", 120)
        overall_energy = audio_features.get("energy", 0.5)
        frame_analyses = audio_features.get("frameAnalyses", [])
        # Create energy timeline from frame analysis
        energy_timeline = self._create_energy_timeline(frame_analyses, duration)
        # Determine track structure based on song structure
        track_sections = self._analyze_song_structure(energy_timeline, bpm, duration)
        # Generate track components for each section
        track_components = []
        current_position = 0
        for section in track_sections:
            section_components = self._generate_section_components(
                section, audio_features, current_position
            )
            track_components.extend(section_components)
            current_position += sum(comp.length for comp in section_components)
        return self._optimize_track_flow(track_components, audio_features)

    def _optimize_track_flow(self, track_components, audio_features):
        return track_components

    def _create_energy_timeline(self, frame_analyses: List[Dict], duration: float) -> List[float]:
        """Create smooth energy progression from frame analysis"""
        if not frame_analyses:
            return [0.5] * 100  # Default moderate energy
        # Extract energy values and smooth them
        raw_energies = [frame.get("energy", 0.0) for frame in frame_analyses]
        # Apply smoothing filter to avoid jagged transitions
        smoothed = np.convolve(raw_energies, np.ones(5)/5, mode='same')
        # Normalize to 0-1 range
        min_energy, max_energy = np.min(smoothed), np.max(smoothed)
        if max_energy > min_energy:
            normalized = (smoothed - min_energy) / (max_energy - min_energy)
        else:
            normalized = np.full_like(smoothed, 0.5)
        return normalized.tolist()

    def _analyze_song_structure(self, energy_timeline: List[float], bpm: float, duration: float) -> List[Dict]:
        """Identify song sections (intro, verse, chorus, bridge, outro)"""
        # Calculate typical section lengths based on BPM
        typical_section_length = 16 * (60 / bpm)  # 16 beats per section
        num_sections = max(4, int(duration / typical_section_length))
        sections = []
        section_length = duration / num_sections
        for i in range(num_sections):
            start_time = i * section_length
            end_time = (i + 1) * section_length
            # Calculate average energy for this section
            start_idx = int((start_time / duration) * len(energy_timeline))
            end_idx = int((end_time / duration) * len(energy_timeline))
            end_idx = min(end_idx, len(energy_timeline))
            if start_idx < end_idx:
                section_energy = np.mean(energy_timeline[start_idx:end_idx])
            else:
                section_energy = 0.5
            # Classify section type based on position and energy
            section_type = self._classify_section_type(i, num_sections, section_energy)
            sections.append({
                "type": section_type,
                "start_time": start_time,
                "end_time": end_time,
                "duration": section_length,
                "energy": section_energy,
                "position": i / num_sections
            })
        return sections

    def _classify_section_type(self, section_index: int, total_sections: int, energy: float) -> str:
        """Classify what type of coaster section this should be"""
        position = section_index / total_sections
        if position < 0.15:
            return "intro"  # Gentle start, build anticipation
        elif position < 0.3:
            return "buildup"  # Climbing, increasing intensity
        elif position < 0.7:
            if energy > 0.7:
                return "climax"  # Main thrills, drops, loops
            else:
                return "development"  # Varied elements, moderate thrills
        elif position < 0.9:
            return "finale"  # Final big moments
        else:
            return "outro"  # Cool down, return to station

    def _generate_section_components(self, section: Dict, audio_features: Dict, position: float) -> List[TrackComponent]:
        """Generate track components for a specific section"""
        section_type = section["type"]
        energy = section["energy"]
        duration = section["duration"]
        bpm = audio_features.get("bpm", 120)
        # Select appropriate components for section type
        component_pool = self._get_section_component_pool(section_type, energy)
        components = []
        remaining_duration = duration
        while remaining_duration > 10:  # Minimum component duration
            # Select component based on energy and context
            component_type = self._select_component(component_pool, energy, len(components))
            # Generate component with appropriate properties
            component = self._create_component(
                component_type,
                energy,
                bpm,
                remaining_duration,
                audio_features
            )
            components.append(component)
            remaining_duration -= component.length
        return components

    def _select_component(self, component_pool, energy, length):
        return random.choice(component_pool)

    def _get_section_component_pool(self, section_type: str, energy: float) -> List[TrackComponentType]:
        """Get appropriate components for each section type"""
        pools = {
            "intro": [
                TrackComponentType.GENTLE_CURVE,
                TrackComponentType.GENTLE_HILL,
                TrackComponentType.STRAIGHT,
                TrackComponentType.BANKING_TURN
            ],
            "buildup": [
                TrackComponentType.STEEP_CLIMB,
                TrackComponentType.LAUNCH_HILL,
                TrackComponentType.S_CURVE,
                TrackComponentType.BANKING_TURN,
                TrackComponentType.GENTLE_DROP
            ],
            "development": [
                TrackComponentType.AIRTIME_HILL,
                TrackComponentType.BUNNY_HOP,
                TrackComponentType.CORKSCREW,
                TrackComponentType.BANKING_TURN,
                TrackComponentType.HELIX,
                TrackComponentType.BARREL_ROLL
            ],
            "climax": [
                TrackComponentType.VERTICAL_DROP,
                TrackComponentType.VERTICAL_LOOP,
                TrackComponentType.COBRA_ROLL,
                TrackComponentType.ZERO_G_ROLL,
                TrackComponentType.SPIRAL_DROP,
                TrackComponentType.TWISTED_ELEMENT
            ],
            "finale": [
                TrackComponentType.LAUNCH_SECTION,
                TrackComponentType.DOUBLE_DOWN,
                TrackComponentType.PRETZEL_KNOT,
                TrackComponentType.HEARTLINE_ROLL,
                TrackComponentType.SPEED_BOOST
            ],
            "outro": [
                TrackComponentType.GENTLE_CURVE,
                TrackComponentType.BRAKE_RUN,
                TrackComponentType.STRAIGHT,
                TrackComponentType.GENTLE_DROP
            ]
        }
        base_pool = pools.get(section_type, pools["development"])
        # Add energy-appropriate components
        if energy > 0.8:
            base_pool.extend([
                TrackComponentType.VERTICAL_LOOP,
                TrackComponentType.VERTICAL_DROP,
                TrackComponentType.LAUNCH_SECTION
            ])
        elif energy > 0.6:
            base_pool.extend([
                TrackComponentType.AIRTIME_HILL,
                TrackComponentType.CORKSCREW,
                TrackComponentType.STEEP_DROP
            ])
        return base_pool

    def _create_component(self,
        component_type: TrackComponentType,
        energy: float,
        bpm: float,
        max_length: float,
        audio_features: Dict
    ) -> TrackComponent:
        """Create a track component with realistic and exciting properties"""
        # Base length calculation
        base_length = self._calculate_base_length(component_type, bpm)
        length = min(base_length, max_length * 0.8)  # Don't use all remaining length
        # Energy-based property modifiers
        energy_multiplier = 0.5 + (energy * 1.5)  # 0.5x to 2.0x
        # Create component with detailed properties
        component = TrackComponent(
            component=component_type,
            length=length,
            **self._generate_component_properties(component_type, energy, bpm, audio_features)
        )
        return component

    def _calculate_base_length(self, component_type, bpm):
        return 100

    def _generate_component_properties(self,
        component_type: TrackComponentType,
        energy: float,
        bpm: float,
        audio_features: Dict
    ) -> Dict[str, Any]:
        """Generate detailed properties for each component type"""
        properties = {}
        # Physical properties based on component type
        if "drop" in component_type.value:
            properties["height"] = -(20 + energy * 180)  # Drops: -20 to -200 meters
            properties["g_force"] = 2.0 + energy * 3.0    # 2.0 to 5.0 G
            properties["speed_modifier"] = 1.2 + energy * 0.8
        elif "loop" in component_type.value:
            properties["height"] = 15 + energy * 35       # Loops: 15 to 50 meters
            properties["radius"] = 8 + energy * 22        # 8 to 30 meters
            properties["g_force"] = 3.0 + energy * 2.5
            properties["inversions"] = 1
        elif "climb" in component_type.value or "hill" in component_type.value:
            properties["height"] = 10 + energy * 90       # Climbs: 10 to 100 meters
            properties["g_force"] = 0.8 + energy * 0.7
            properties["speed_modifier"] = 0.6 + energy * 0.4
        elif "turn" in component_type.value or "curve" in component_type.value:
            properties["banking"] = energy * 60           # 0 to 60 degrees
            properties["radius"] = 25 + (1-energy) * 75   # Tighter turns at high energy
            properties["g_force"] = 1.5 + energy * 1.0
        elif "roll" in component_type.value:
            properties["twist_angle"] = 360 * (1 + int(energy * 2))  # 360 to 1080 degrees
            properties["g_force"] = 2.0 + energy * 2.0
            properties["inversions"] = 1 + int(energy * 2)
        # Audio-reactive properties
        audio_props = AudioReactiveProperties(
            beat_sync=energy > 0.6 and random.random() < 0.4,
            energy_reactive=energy > 0.4,
            bass_responsive="drop" in component_type.value or "launch" in component_type.value,
            amplitude_multiplier=0.8 + energy * 0.4
        )
        properties["audio_properties"] = audio_props
        # Visual effects
        effects = VisualEffects(
            lighting_type="pulsing" if energy > 0.6 else "static",
            fog_density=energy * 0.4,
            speed_lines=properties.get("speed_modifier", 1.0) > 1.3,
            camera_shake=energy > 0.8,
            particle_system="sparks" if energy > 0.7 else None,
            trail_effect=energy > 0.5
        )
        properties["effects"] = effects
        # Energy threshold for activation
        properties["energy_threshold"] = max(0.1, energy - 0.2)
        return properties
