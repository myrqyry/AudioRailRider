import React, { useMemo, Suspense } from 'react';
import { AppStatus } from '../../../shared/types';
import { LoadingProgress } from './LoadingProgress';
import { EnhancedErrorBoundary } from './ErrorBoundary';
const ThreeCanvas = React.lazy(() => import('./ThreeCanvas'));
import ReglOverlay from './ReglOverlay';
import RendererWarning from './RendererWarning';
import IdleUI from './views/IdleUI';
import ReadyUI from './views/ReadyUI';
import FinishedUI from './views/FinishedUI';
import ErrorUI from './views/ErrorUI';
import ThreeCanvasErrorFallback from './views/ThreeCanvasErrorFallback';
import ReglOverlayErrorFallback from './views/ReglOverlayErrorFallback';
import { TrackData, AudioFeatures } from '../../../shared/types';

interface AppUIRendererProps {
    status: AppStatus;
    trackData: TrackData | null;
    audioFeatures: AudioFeatures | null;
    generationProgress: number;
    audioContext: AudioContext | null;
}

const AppUIRenderer: React.FC<AppUIRendererProps> = React.memo(({ status, trackData, audioFeatures, generationProgress, audioContext }) => {
    const SAFE_STATUS_COMPONENTS = {
        [AppStatus.Idle]: () => <IdleUI audioContext={audioContext} />,
        [AppStatus.Ready]: ReadyUI,
        [AppStatus.Finished]: FinishedUI,
        [AppStatus.Error]: ErrorUI,
    } as const;

    const getSafeComponent = (status: AppStatus): React.ComponentType | (() => JSX.Element) => {
        if (status in SAFE_STATUS_COMPONENTS) {
            return SAFE_STATUS_COMPONENTS[status as keyof typeof SAFE_STATUS_COMPONENTS];
        }
        return ErrorUI;
    };

    const ContentComponent = useMemo(() => getSafeComponent(status), [status, audioContext]);

    const shouldShowCanvas = useMemo(
        () => (status === AppStatus.Riding || status === AppStatus.Ready) && trackData,
        [status, trackData]
    );

    // Debug component for development
    const DebugInfo = () => (
        process.env.NODE_ENV === 'development' ? (
            <div className="fixed top-4 left-4 bg-gray-800 text-white p-2 rounded text-sm z-50">
                <div>Status: {status}</div>
                <div>TrackData: {trackData ? '✓' : '✗'}</div>
                <div>AudioFeatures: {audioFeatures ? '✓' : '✗'}</div>
                <div>AudioContext: {audioContext ? audioContext.state : '✗'}</div>
            </div>
        ) : null
    );

    return (
        <>
            <DebugInfo />
            {status === AppStatus.Analyzing && <LoadingProgress stage="analyzing" />}
            {status === AppStatus.Generating && (
                <LoadingProgress stage="generating" progress={generationProgress} />
            )}

            <div className="relative z-20 p-4">
                <RendererWarning />
                {ContentComponent ? (
                    <ContentComponent />
                ) : (
                    <div className="text-white text-center">
                        <h2 className="text-xl mb-4">Unknown State</h2>
                        <p>App status: {status}</p>
                        <p>Something went wrong. Please refresh the page.</p>
                    </div>
                )}
            </div>

            {shouldShowCanvas && (
                <EnhancedErrorBoundary fallback={ThreeCanvasErrorFallback}>
                    <Suspense fallback={<LoadingProgress stage="loading" />}>
                        <ThreeCanvas />
                    </Suspense>
                    {status === AppStatus.Ready && (
                        <EnhancedErrorBoundary fallback={ReglOverlayErrorFallback}>
                            <ReglOverlay audioFeatures={audioFeatures || null} />
                        </EnhancedErrorBoundary>
                    )}
                </EnhancedErrorBoundary>
            )}
        </>
    );
});

export default AppUIRenderer;
