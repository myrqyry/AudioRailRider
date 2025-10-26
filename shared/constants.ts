export const TRACK_STYLES = ['classic', 'extreme', 'flowing', 'technical', 'experimental'];
export const WORLD_THEMES = ['fantasy', 'cyberpunk', 'aurora', 'desert', 'space', 'underwater', 'noir'];
export const VISUAL_STYLES = ['photorealistic', 'stylized', 'painterly', 'lowpoly', 'retro'];
export const DETAIL_LEVELS = ['low', 'medium', 'high'];
export const CAMERA_PRESETS = ['epic', 'immersive', 'first_person', 'wide_angle'];
export const EVENT_PRESETS = ['fog', 'fireworks', 'starshow', 'lightBurst', 'sparkRing', 'confetti'];

export const RIDE_CONFIG = {
  // Camera settings
  CAMERA_BASE_FOV: 75,
  CAMERA_MAX_FOV_BOOST: 25,
  CAMERA_SPEED_FOV_FACTOR: 5,

  // Track building settings
  INITIAL_TRACK_SEGMENT_LENGTH: 50,
  INITIAL_TRACK_SEGMENT_SPACING: 2.5,
  TRACK_SEGMENT_RESOLUTION: 100,

  // Sky colors
  DEFAULT_SKY_COLOR_2: '#1a0b2e',

  // Particle system settings
  PARTICLE_COUNT: 10000,
  PARTICLE_SPAWN_COUNT: 200,
  PARTICLE_BASE_SIZE: 0.5,
} as const;

export const DEFAULT_SPACING = 2.5;