import React, { useEffect } from 'react';
import { AppStatus } from '../../shared/types';
import { useAppStore } from './lib/store';
import { runAudioProcessingWorkflow } from './lib/workflow';
import { startPreload } from './lib/preloader';
import { LoadingProgress } from './components/LoadingProgress';
import { ErrorBoundary } from './components/ErrorBoundary';
import ThreeCanvas from './components/ThreeCanvas';
import ReglOverlay from './components/ReglOverlay';
import DevPanel from './components/DevPanel';
import RendererWarning from './components/RendererWarning';
import IdleUI from './components/views/IdleUI';
import ReadyUI from './components/views/ReadyUI';
import FinishedUI from './components/views/FinishedUI';
import ErrorUI from './components/views/ErrorUI';

const App: React.FC = () => {
    const status = useAppStore((state) => state.status);
    const statusMessage = useAppStore((state) => state.statusMessage);
    const audioFile = useAppStore((state) => state.audioFile);
    const trackData = useAppStore((state) => state.trackData);
    const audioFeatures = useAppStore((state) => state.trackData?.audioFeatures);
    const generationOptions = useAppStore(state => state.generationOptions);

    // Start preloading resources as soon as the app mounts
    useEffect(() => {
        startPreload();
    }, []);

    // This effect runs the main audio processing workflow whenever a new audio file is set
    // and the generation options are available. It includes cancellation logic to prevent
    // race conditions if the user selects a new file while a previous one is processing.
    useEffect(() => {
        // Do nothing if there's no audio file.
        if (!audioFile) {
            return;
        }

        // Create an AbortController to manage the lifecycle of the workflow.
        const controller = new AbortController();

        // Run the workflow with the audio file, options, and the abort signal.
        runAudioProcessingWorkflow(audioFile, {
            generationOptions,
            signal: controller.signal,
        });

        // The cleanup function for this effect will be called when the component
        // unmounts or when the dependencies (audioFile, generationOptions) change.
        // This is the key to preventing race conditions.
        return () => {
            console.log("Cancelling previous audio processing workflow.");
            controller.abort();
        };
    }, [audioFile, generationOptions]);

    const renderContent = () => {
        switch (status) {
            case AppStatus.Error:
                return <ErrorUI />;
            case AppStatus.Idle:
                return <IdleUI />;
            case AppStatus.Ready:
                return <ReadyUI />;
            case AppStatus.Finished:
                return <FinishedUI />;
            default:
                return null; // Riding, Analyzing, Generating, etc., are handled by overlays
        }
    };

    return (
        <main className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
            
            {status === AppStatus.Analyzing && <LoadingProgress stage="analyzing" />}
            {status === AppStatus.Generating && (
                statusMessage.includes('Translating') ? <LoadingProgress stage="generating" /> :
                statusMessage.includes('Refining') ? <LoadingProgress stage="generating" progress={50} /> :
                <LoadingProgress stage="building" progress={75} />
            )}
            
            {/* Only show UI overlay when not riding */}
            {status !== AppStatus.Riding && (
                <div className="relative z-20 p-4">
                    <RendererWarning />
                    {renderContent()}
                </div>
            )}
            
            {(status === AppStatus.Riding || status === AppStatus.Ready) && trackData && (
                <ErrorBoundary>
                    <ThreeCanvas />
                    {/* Only show waveform overlay when Ready, hide during Riding */}
                    {status === AppStatus.Ready && <ReglOverlay audioFeatures={audioFeatures || null} />}
                </ErrorBoundary>
            )}
            <DevPanel />
        </main>
    );
};

export default App;
