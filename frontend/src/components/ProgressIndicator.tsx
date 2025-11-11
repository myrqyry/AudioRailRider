import React from 'react';
import { useAppStore } from '@/lib';
import { AppStatus } from 'shared/types';

const ProgressIndicator: React.FC = () => {
    const status = useAppStore((state) => state.status);
    const statusMessage = useAppStore((state) => state.statusMessage);
    const workflowProgress = useAppStore((state) => state.workflowProgress);
    const generationProgress = useAppStore((state) => state.generationProgress);

    const shouldShow = status === AppStatus.Loading ||
                        status === AppStatus.Generating ||
                        status === AppStatus.Building;

    if (!shouldShow) return null;

    const progressPercent = status === AppStatus.Generating
        ? generationProgress
        : workflowProgress;

    const getStatusLabel = () => {
        switch (status) {
            case AppStatus.Loading:
                return 'Loading Audio...';
            case AppStatus.Generating:
                return 'Generating Blueprint...';
            case AppStatus.Building:
                return 'Building Track...';
            default:
                return 'Processing...';
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
            <div className="bg-gray-900 rounded-lg p-8 max-w-md w-full mx-4">
                <h2 className="text-2xl font-bold text-white mb-4">
                    {getStatusLabel()}
                </h2>

                {statusMessage && (
                    <p className="text-gray-300 mb-4 text-sm">
                        {statusMessage}
                    </p>
                )}

                <div className="relative w-full h-2 bg-gray-700 rounded-full overflow-hidden">
                    <div
                         className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300 ease-out"
                        style={{ width: `${progressPercent}%` }}
                    >
                        <div className="absolute inset-0 bg-white opacity-30 animate-pulse" />
                    </div>
                </div>

                <div className="mt-4 flex justify-between text-sm text-gray-400">
                    <span>{Math.round(progressPercent)}%</span>
                    <span>Please wait...</span>
                </div>

                {status === AppStatus.Generating && (
                    <div className="mt-4 text-xs text-gray-500 text-center">
                        This may take a minute. We're analyzing your audio to create a unique experience.
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProgressIndicator;
