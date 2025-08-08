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
};
