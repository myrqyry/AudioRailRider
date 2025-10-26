import React, { useEffect, Suspense } from 'react';
import { AppStatus } from '../../shared/types';
import { useAppStore } from './lib/store';
import { useAudioProcessor } from './hooks/useAudioProcessor';
import { startPreload } from './lib/preloader';
import { LoadingProgress } from './components/LoadingProgress';
import { ErrorBoundary } from './components/ErrorBoundary';
const ThreeCanvas = React.lazy(() => import('./components/ThreeCanvas'));
import ReglOverlay from './components/ReglOverlay';
import DevPanel from './components/DevPanel';
import RendererWarning from './components/RendererWarning';
import IdleUI from './components/views/IdleUI';
import ReadyUI from './components/views/ReadyUI';
import FinishedUI from './components/views/FinishedUI';
import ErrorUI from './components/views/ErrorUI';

/**
 * The main application component.
 * It orchestrates the overall UI and state transitions based on the application status.
 * It renders the appropriate UI view (Idle, Ready, Finished, Error) or the 3D canvas
 * for the ride visualization.
 * @returns {React.ReactElement} The rendered App component.
 */
const App: React.FC = () => {
        const breathingIntensity = useAppStore((state) => state.breathingIntensity);
        const setBreathingIntensity = useAppStore((state) => state.actions.setBreathingIntensity);
    const status = useAppStore((state) => state.status);
    const statusMessage = useAppStore((state) => state.statusMessage);
    const trackData = useAppStore((state) => state.trackData);
    const audioFeatures = useAppStore((state) => state.trackData?.audioFeatures);

    // Start preloading resources as soon as the app mounts
    useEffect(() => {
        startPreload();
    }, []);

    // This custom hook manages the audio processing workflow.
    useAudioProcessor();

    const statusToComponent: Record<AppStatus, React.ComponentType | null> = {
        [AppStatus.Idle]: IdleUI,
        [AppStatus.Ready]: ReadyUI,
        [AppStatus.Finished]: FinishedUI,
        [AppStatus.Error]: ErrorUI,
        [AppStatus.Analyzing]: null,
        [AppStatus.Generating]: null,
        [AppStatus.Riding]: null,
    };

    const ContentComponent = statusToComponent[status] || ErrorUI;

    return (
        <main className="relative w-full h-screen bg-black overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 z-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>

            {status === AppStatus.Analyzing && <LoadingProgress stage="analyzing" />}
            {status === AppStatus.Generating && <LoadingProgress stage="generating" progress={useAppStore.getState().generationProgress} />}

            {/* Only show UI overlay when not riding */}
            {ContentComponent && (
                <div className="relative z-20 p-4">
                    <RendererWarning />
                    <ContentComponent />
                    {/* Breathing Intensity Slider */}
                    <div className="mt-6 flex flex-col items-center">
                        <label htmlFor="breathing-intensity-slider" className="text-xs text-white mb-1">Breathing Intensity</label>
                        <input
                            id="breathing-intensity-slider"
                            type="range"
                            min={0}
                            max={2}
                            step={0.01}
                            value={breathingIntensity}
                            onChange={e => setBreathingIntensity(Number(e.target.value))}
                            className="w-48 accent-pink-500"
                        />
                        <span className="text-xs text-white mt-1">{breathingIntensity.toFixed(2)}</span>
                    </div>
                </div>
            )}

            {(status === AppStatus.Riding || status === AppStatus.Ready) && trackData && (
                <ErrorBoundary>
                    <Suspense fallback={<LoadingProgress stage="loading" />}>
                        <ThreeCanvas />
                    </Suspense>
                    {/* Only show waveform overlay when Ready, hide during Riding */}
                    {status === AppStatus.Ready && <ReglOverlay audioFeatures={audioFeatures || null} />}
                </ErrorBoundary>
            )}
            <DevPanel />
        </main>
    );
};

export default App;
