import { useState, useEffect, useCallback } from 'react';

interface UseAudioContextReturn {
    audioContext: AudioContext | null;
    error: string | null;
    needsUserInteraction: boolean;
    resumeContext: () => Promise<void>;
}

export function useAudioContext(): UseAudioContextReturn {
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [needsUserInteraction, setNeedsUserInteraction] = useState(false);

    useEffect(() => {
        let ctx: AudioContext | null = null;

        const initializeContext = async () => {
            try {
                const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;

                if (!AudioContextClass) {
                    throw new Error('AudioContext not supported in this browser');
                }

                ctx = new AudioContextClass();

                if (ctx.state === 'suspended') {
                    setNeedsUserInteraction(true);
                }

                setAudioContext(ctx);
                setError(null);
            } catch (err) {
                const errorMessage = `Failed to initialize audio: ${
                    err instanceof Error ? err.message : 'Unknown error'
                }`;
                setError(errorMessage);
                console.error('AudioContext initialization failed:', err);
            }
        };

        initializeContext();

        return () => {
            if (ctx && ctx.state !== 'closed') {
                ctx.close().catch(console.error);
            }
        };
    }, []);

    const resumeContext = useCallback(async () => {
        if (audioContext && audioContext.state === 'suspended') {
            try {
                await audioContext.resume();
                setNeedsUserInteraction(false);
                setError(null);
            } catch (err) {
                setError('Failed to resume audio context');
                console.error('Failed to resume AudioContext:', err);
            }
        }
    }, [audioContext]);

    return {
        audioContext,
        error,
        needsUserInteraction,
        resumeContext,
    };
}
