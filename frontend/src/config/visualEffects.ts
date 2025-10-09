export const VISUAL_EFFECTS_CONFIG = {
    PARTICLE: {
        MAX_COUNT: 8192,
        SPAWN_COUNT: 32,
        BASE_SIZE: 0.8,
        LIFETIME: {
            MIN: 1.5,
            MAX: 4.0
        }
    },
    PERFORMANCE: {
        TARGET_FPS: 50,
        CHECK_INTERVAL: 2000,
        DEBOUNCE_MS: 3000,
        WARMUP_PERIOD: 5000
    },
    AUDIO: {
        BASS_GLOW_MIN: 0.3,
        BASS_GLOW_MAX: 1.8,
        LERP_FACTOR: 0.12
    },
    TRACK: {
        RADIUS: 0.9,
        GHOST_RIBBON_RADIUS: 1.6,
        HIGH_QUALITY_SEGMENTS: 2,
        LOW_QUALITY_SEGMENTS: 1,
    }
} as const;