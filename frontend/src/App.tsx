import React, { useState, useEffect } from 'react';
import { useValidatedAppState, useAppInitialization, useAudioContext } from '@/hooks';
import { useAudioAnalysis, useAppStore } from '@/lib';
import { AppUIRenderer, DevPanel, ProgressIndicator } from '@/components';

const App: React.FC = React.memo(function App() {
    const [isInitialized, setIsInitialized] = useState(false);
    const [backgroundLoaded, setBackgroundLoaded] = useState(false);
    const [backgroundError, setBackgroundError] = useState(false);

    const { audioContext, error: audioContextError, needsUserInteraction, resumeContext } = useAudioContext();

    useAppInitialization();
    const appState = useValidatedAppState();
    const audioSource = useAppStore((state) => state.audioSource);

    useEffect(() => {
        setIsInitialized(true);
    }, []);

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
                    <button
                         onClick={resumeContext}
                         className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                    >
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
                className={`absolute inset-0 z-0 transition-opacity duration-300 ${
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
            <ProgressIndicator />
            <DevPanel />
        </main>
    );
});

export default App;