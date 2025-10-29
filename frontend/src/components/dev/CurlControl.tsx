import React from 'react';

interface CurlControlProps {
  curlStrength: number;
  noiseScale: number;
  noiseSpeed: number;
  onCurlStrengthChange: (value: number) => void;
  onNoiseScaleChange: (value: number) => void;
  onNoiseSpeedChange: (value: number) => void;
  onReset: () => void;
  onLog: () => void;
}

const CurlControl: React.FC<CurlControlProps> = ({
  curlStrength,
  noiseScale,
  noiseSpeed,
  onCurlStrengthChange,
  onNoiseScaleChange,
  onNoiseSpeedChange,
  onReset,
  onLog,
}) => {
  return (
    <div className="mb-3">
      <h4 className="font-medium text-gray-100 mb-1">Curl Noise</h4>
      <div className="mb-2">
        <label className="block text-xs text-gray-300">Curl Strength: {curlStrength.toFixed(2)}</label>
        <input type="range" min="0" max="1" step="0.01" value={curlStrength} onChange={(e) => onCurlStrengthChange(Number(e.target.value))} className="w-full" />
      </div>
      <div className="mb-2">
        <label className="block text-xs text-gray-300">Noise Scale: {noiseScale.toFixed(2)}</label>
        <input type="range" min="0.1" max="8" step="0.1" value={noiseScale} onChange={(e) => onNoiseScaleChange(Number(e.target.value))} className="w-full" />
      </div>
      <div className="mb-3">
        <label className="block text-xs text-gray-300">Noise Speed: {noiseSpeed.toFixed(2)}</label>
        <input type="range" min="0" max="1" step="0.01" value={noiseSpeed} onChange={(e) => onNoiseSpeedChange(Number(e.target.value))} className="w-full" />
      </div>
      <div className="flex gap-2">
        <button onClick={onReset} className="flex-1 px-3 py-1 bg-gray-800 border border-gray-600 rounded">Reset</button>
        <button onClick={onLog} className="px-3 py-1 bg-cyan-600 rounded">Log</button>
      </div>
    </div>
  );
};

export default CurlControl;
