import React, { useState, useEffect, useCallback } from 'react';
import { useValidatedAppState } from './hooks/useValidatedAppState';
import { useAppInitialization } from './hooks/useAppInitialization';
import { useAudioAnalysis } from './lib/useAudioAnalysis';
import { useAppStore } from './lib/store';
import AppUIRenderer from './components/AppUIRenderer';
import DevPanel from './components/DevPanel';

const App: React.FC = React.memo(function App() {
    const [isInitialized, setIsInitialized] = useState(false);
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
    const [audioContextError, setAudioContextError] = useState<string | null>(null);
    const [needsUserInteraction, setNeedsUserInteraction] = useState(false);
    const [backgroundLoaded, setBackgroundLoaded] = useState(false);
    const [backgroundError, setBackgroundError] = useState(false);

    useAppInitialization();
    const appState = useValidatedAppState();
    const audioSource = useAppStore((state) => state.audioSource);

    const initializeAudioContext = useCallback(async () => {
        try {
            const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContextClass) {
                throw new Error('AudioContext not supported in this browser');
            }
            const ctx = new AudioContextClass();
            if (ctx.state === 'suspended') {
                setNeedsUserInteraction(true);
            }
            setAudioContext(ctx);
            setAudioContextError(null);
            return ctx;
        } catch (error) {
            const errorMessage = `Failed to initialize audio: ${error instanceof Error ? error.message : 'Unknown error'}`;
            setAudioContextError(errorMessage);
            console.error('AudioContext initialization failed:', error);
            return null;
        }
    }, []);

    const handleUserInteraction = useCallback(async () => {
        if (audioContext && audioContext.state === 'suspended') {
            try {
                await audioContext.resume();
                setNeedsUserInteraction(false);
            } catch (error) {
                setAudioContextError('Failed to resume audio context');
            }
        } else {
            await initializeAudioContext();
        }
    }, [audioContext, initializeAudioContext]);

    useEffect(() => {
        setIsInitialized(true);
    }, []);

    useEffect(() => {
        initializeAudioContext();
        return () => {
            if (audioContext && audioContext.state !== 'closed') {
                audioContext.close();
            }
        };
    }, [initializeAudioContext]);

    useEffect(() => {
        const img = new Image();
        img.onload = () => setBackgroundLoaded(true);
        img.onerror = () => setBackgroundError(true);
        img.src = '/stardust.png';
    }, []);

    useAudioAnalysis({
        status: appState.status,
        audioFile: appState.audioFile,
        audioSource,
        audioContext,
    });

    if (!isInitialized) {
        return (
            <main className="relative w-full h-screen bg-black flex items-center justify-center">
                <div className="text-white">Initializing AudioRailRider...</div>
            </main>
        );
    }

    if (needsUserInteraction) {
        return (
            <main className="relative w-full h-screen bg-black flex items-center justify-center">
                <div className="text-white text-center">
                    <h1 className="text-2xl mb-4">Audio Context is suspended</h1>
                    <p className="mb-4">Browser requires user interaction to start audio.</p>
                    <button onClick={handleUserInteraction} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">
                        Click to start
                    </button>
                </div>
            </main>
        );
    }

    if (audioContextError) {
        return (
            <main className="relative w-full h-screen bg-black flex items-center justify-center">
                <div className="text-white text-center">
                    <h1 className="text-2xl mb-4">Audio Error</h1>
                    <p className="mb-4">{audioContextError}</p>
                </div>
            </main>
        );
    }

    return (
        <main className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center">
            <div
                className={`absolute inset-0 z-0 ${
                    backgroundLoaded
                        ? "bg-[url('/stardust.png')] opacity-20"
                        : backgroundError
                        ? "bg-gradient-to-b from-gray-900 to-black"
                        : "bg-black"
                }`}
            ></div>
            {!backgroundLoaded && !backgroundError && (
                <div className="absolute inset-0 z-0 bg-black animate-pulse"></div>
            )}
            <AppUIRenderer {...appState} audioContext={audioContext} />
            <DevPanel />
        </main>
    );
});

export default App;
