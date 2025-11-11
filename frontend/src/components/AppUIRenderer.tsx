import React from 'react';
import { ThreeErrorBoundary, ThreeCanvas, UploadView } from '@/components';
import { AppStatus } from 'shared/types';

interface AppUIRendererProps {
    status: AppStatus;
    audioContext: AudioContext | null;
    // ... other props
}

const AppUIRenderer: React.FC<AppUIRendererProps> = (props) => {
    const { status } = props;

    const renderView = () => {
        switch (status) {
            case AppStatus.Idle:
                return <UploadView />;
            case AppStatus.Riding:
            case AppStatus.Ready:
                return (
                    <ThreeErrorBoundary>
                        <ThreeCanvas {...props} />
                    </ThreeErrorBoundary>
                );
            // ... other cases
            default:
                // A default case is useful for handling unexpected states.
                return (
                    <div className="text-white text-center">
                        <h2 className="text-xl mb-4">Loading Experience...</h2>
                        <p>App status: {status}</p>
                    </div>
                );
        }
    };

    return <>{renderView()}</>;
};

export default AppUIRenderer;
