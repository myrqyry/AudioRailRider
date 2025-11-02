import { useMemo, useCallback } from 'react';
import { useAppStore } from '../lib/store';
import { TrackDataSchema } from '../lib/schemas';

export const useValidatedAppState = () => {
    const rawState = useAppStore(
        useCallback((state) => ({
            status: state.status,
            trackData: state.trackData,
            generationProgress: state.generationProgress
        }), [])
    );

    return useMemo(() => {
        let validatedTrackData = null;

        if (rawState.trackData) {
            try {
                validatedTrackData = TrackDataSchema.parse(rawState.trackData);
            } catch (error) {
                console.error('Track data validation failed:', error);
                // Handle invalid data gracefully
                useAppStore.getState().actions.setError({
                    title: 'Validation Error',
                    message: 'Invalid track data received from the server.'
                });
            }
        }

        return {
            ...rawState,
            trackData: validatedTrackData,
            audioFeatures: validatedTrackData?.audioFeatures
        };
    }, [rawState]);
};
