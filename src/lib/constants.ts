export const RIDE_CONFIG = {
    // === Camera & Rendering ===
    CAMERA_BASE_FOV: 75,
    CAMERA_SPEED_FOV_FACTOR: 0.05,
    CAMERA_MAX_FOV_BOOST: 20,

    // === Visual Effects ===
    STARS_COUNT: 10000,
    PARTICLE_COUNT: 20000,
    PARTICLE_SPAWN_COUNT: 50,
    PARTICLE_BASE_SIZE: 5.0,
    PARTICLE_LIFETIME: 2.0, // in seconds
    PARTICLE_GRAVITY: -9.8,

    // === Audio Analysis & Ride Logic ===
    BASS_KICK_THRESHOLD: 15,

    // === Track Building ===
    TRACK_SEGMENT_RESOLUTION: 100,
    INITIAL_TRACK_SEGMENT_LENGTH: 10,
    INITIAL_TRACK_SEGMENT_SPACING: 2,
    DEFAULT_SKY_COLOR_2: '#000000',
} as const satisfies RideConfig;

export const DEFAULT_SPACING = 1.0;

type HexColor = `#${string}`;

interface RideConfig {
    // === Camera & Rendering ===
    CAMERA_BASE_FOV: number;
    CAMERA_SPEED_FOV_FACTOR: number;
    CAMERA_MAX_FOV_BOOST: number;

    // === Visual Effects ===
    STARS_COUNT: number;
    PARTICLE_COUNT: number;
    PARTICLE_SPAWN_COUNT: number;
    PARTICLE_BASE_SIZE: number;
    PARTICLE_LIFETIME: number;
    PARTICLE_GRAVITY: number;

    // === Audio Analysis & Ride Logic ===
    BASS_KICK_THRESHOLD: number;

    // === Track Building ===
    TRACK_SEGMENT_RESOLUTION: number;
    INITIAL_TRACK_SEGMENT_LENGTH: number;
    INITIAL_TRACK_SEGMENT_SPACING: number;
    DEFAULT_SKY_COLOR_2: HexColor;
}
