import React from 'react';

const ThreeCanvasErrorFallback: React.FC<{ error: Error | null }> = ({ error }) => (
  <div className="w-full h-full flex items-center justify-center bg-red-900/50 p-4">
    <div className="text-center">
      <h2 className="text-2xl font-bold text-red-100">3D Canvas Error</h2>
      <p className="mt-2 text-red-200">The 3D visualization encountered a critical error.</p>
      {error && <pre className="mt-4 text-xs text-left bg-black/50 p-2 rounded">{error.message}</pre>}
      <p className="mt-4 text-sm text-red-300">Please try refreshing the page. If the problem persists, the track data may be corrupted.</p>
    </div>
  </div>
);

export default ThreeCanvasErrorFallback;
