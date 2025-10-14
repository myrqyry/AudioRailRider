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

const App: React.FC = () => {
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

    const ContentComponent = statusToComponent[status];

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
            {ContentComponent && (
                <div className="relative z-20 p-4">
                    <RendererWarning />
                    <ContentComponent />
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
