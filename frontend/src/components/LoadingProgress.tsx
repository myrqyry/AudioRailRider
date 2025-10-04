import React from 'react';

interface LoadingProgressProps {
  stage: 'analyzing' | 'generating' | 'building';
  progress?: number;
}

export const LoadingProgress: React.FC<LoadingProgressProps> = ({ stage, progress }) => {
  const stages = {
    analyzing: {
      title: 'Analyzing Audio',
      description: 'Extracting musical features from your track...',
      icon: '🎵',
    },
    generating: {
      title: 'Generating Blueprint',
      description: 'AI is designing your roller coaster...',
      icon: '🎢',
    },
    building: {
      title: 'Building Track',
      description: 'Creating the 3D visualization...',
      icon: '🏗️',
    },
  };

  const { title, description, icon } = stages[stage];

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/90 z-50">
      <div className="text-center max-w-md px-8">
        <div className="text-6xl mb-6 animate-bounce">{icon}</div>
        <h2 className="text-3xl font-bold mb-3 text-white">{title}</h2>
        <p className="text-gray-400 mb-8">{description}</p>
        
        {progress !== undefined && (
          <div className="w-full bg-gray-800 rounded-full h-3 overflow-hidden mb-4">
            <div
              className="h-full bg-gradient-to-r from-purple-600 to-pink-600 transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
        )}
        
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-purple-600 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
          <div className="w-3 h-3 bg-purple-600 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
          <div className="w-3 h-3 bg-purple-600 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};
