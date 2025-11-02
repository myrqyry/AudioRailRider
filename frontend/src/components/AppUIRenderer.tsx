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
}

const AppUIRenderer: React.FC<AppUIRendererProps> = React.memo(({ status, trackData, audioFeatures, generationProgress }) => {
    const SAFE_STATUS_COMPONENTS = {
        [AppStatus.Idle]: IdleUI,
        [AppStatus.Ready]: ReadyUI,
        [AppStatus.Finished]: FinishedUI,
        [AppStatus.Error]: ErrorUI,
    } as const;

    const getSafeComponent = (status: AppStatus): React.ComponentType => {
        if (status in SAFE_STATUS_COMPONENTS) {
            return SAFE_STATUS_COMPONENTS[status as keyof typeof SAFE_STATUS_COMPONENTS];
        }
        return ErrorUI;
    };

    const ContentComponent = useMemo(() => getSafeComponent(status), [status]);

    const shouldShowCanvas = useMemo(
        () => (status === AppStatus.Riding || status === AppStatus.Ready) && trackData,
        [status, trackData]
    );

    return (
        <>
            {status === AppStatus.Analyzing && <LoadingProgress stage="analyzing" />}
            {status === AppStatus.Generating && (
                <LoadingProgress stage="generating" progress={generationProgress} />
            )}

            {ContentComponent && (
                <div className="relative z-20 p-4">
                    <RendererWarning />
                    <ContentComponent />
                </div>
            )}

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
