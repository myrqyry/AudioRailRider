import React, { useState, useEffect } from 'react';
import { useValidatedAppState } from './hooks/useValidatedAppState';
import { useAppInitialization } from './hooks/useAppInitialization';
import { useAudioAnalysis } from './lib/useAudioAnalysis';
import { useAppStore } from './lib/store';
import AppUIRenderer from './components/AppUIRenderer';
import DevPanel from './components/DevPanel';

const App: React.FC = React.memo(function App() {
    useAppInitialization();
    const appState = useValidatedAppState();
    const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
    const audioSource = useAppStore((state) => state.audioSource);

    useEffect(() => {
        const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
        setAudioContext(ctx);

        return () => {
            if (ctx.state !== 'closed') {
                ctx.close();
            }
        };
    }, []);

    useAudioAnalysis({
        status: appState.status,
        audioFile: appState.audioFile,
        audioSource,
        audioContext,
    });

    return (
        <main className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 z-0 bg-[url('/stardust.png')] opacity-20"></div>
            <AppUIRenderer {...appState} audioContext={audioContext} />
            <DevPanel />
        </main>
    );
});

export default App;
