import React from 'react';

const ReglOverlayErrorFallback: React.FC = () => (
  <div className="absolute inset-0 bg-black/80 flex items-center justify-center text-white z-50">
    <p>The waveform visualizer could not be loaded.</p>
  </div>
);

export default ReglOverlayErrorFallback;
