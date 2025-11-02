import { z } from 'zod';

// Define comprehensive schemas
export const AudioFeaturesSchema = z.object({
    energy: z.number().min(0).max(1),
    valence: z.number().min(0).max(1),
    tempo: z.number().positive(),
    loudness: z.number(),
    danceability: z.number().min(0).max(1),
    speechiness: z.number().min(0).max(1),
    acousticness: z.number().min(0).max(1),
    instrumentalness: z.number().min(0).max(1),
    liveness: z.number().min(0).max(1)
});

export const TrackDataSchema = z.object({
    id: z.string().uuid(),
    name: z.string().min(1),
    duration: z.number().positive(),
    audioFeatures: AudioFeaturesSchema,
    generatedPath: z.array(z.object({
        x: z.number(),
        y: z.number(),
        z: z.number(),
        timestamp: z.number().nonnegative()
    }))
});

// Type exports
export type AudioFeatures = z.infer<typeof AudioFeaturesSchema>;
export type TrackData = z.infer<typeof TrackDataSchema>;
