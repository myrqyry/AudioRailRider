import { useMemo, useCallback, useRef, useEffect } from 'react';
import { useAppStore } from '../lib/store';
import { TrackDataSchema } from '../lib/schemas';
import { shallow } from 'zustand/shallow';

export const useValidatedAppState = () => {
    // Select primitives separately to avoid creating a new object inside the
    // selector on every subscription. Returning a fresh object from the
    // selector can trigger React's "getSnapshot should be cached" warning
    // and cause subscription loops. Selecting primitives and composing them
    // in a memo avoids that.
    const status = useAppStore((s) => s.status);
    const trackDataSnapshot = useAppStore((s) => s.trackData);
    const generationProgress = useAppStore((s) => s.generationProgress);
    const audioFile = useAppStore((s) => s.audioFile);

    const rawState = useMemo(() => ({ status, trackData: trackDataSnapshot, generationProgress, audioFile }), [status, trackDataSnapshot, generationProgress, audioFile]);

    // Ref that signals whether the last validation failed. We set this inside
    // the memo to avoid causing state updates during render, then react to it
    // in an effect (which runs after paint) to call store actions safely.
    const validationFailedRef = useRef(false);

    const memoed = useMemo(() => {
        let validatedTrackData = null;
        validationFailedRef.current = false;

        if (rawState.trackData) {
            // If the runtime track data contains a `path` array (Three.js-ready shape),
            // accept it as valid without strict Zod parsing to avoid mismatches between
            // serialized schemas and in-memory runtime shapes.
            try {
                const hasRuntimeShape = Array.isArray((rawState.trackData as any).path) && Array.isArray((rawState.trackData as any).upVectors);
                if (hasRuntimeShape) {
                    validatedTrackData = rawState.trackData as any;
                } else {
                    validatedTrackData = TrackDataSchema.parse(rawState.trackData);
                }
            } catch (error) {
                console.error('Track data validation failed:', error);
                // Mark that validation failed; we will set the error in an effect
                validationFailedRef.current = true;
            }
        }

        return {
            ...rawState,
            trackData: validatedTrackData,
            audioFeatures: validatedTrackData?.audioFeatures
        };
    }, [rawState]);

    // Post-render: if validation failed, set an application-level error
    // via the store actions. Doing this in an effect avoids triggering
    // synchronous state updates during render which cause nested update loops.
    useEffect(() => {
        if (validationFailedRef.current) {
            // Clear the flag before calling into the store to avoid races.
            validationFailedRef.current = false;
            useAppStore.getState().actions.setError({
                title: 'Validation Error',
                message: 'Invalid track data received from the server.'
            });
        }
    }, [memoed.trackData]);

    return memoed;
};
