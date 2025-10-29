import React from 'react';

interface TrackSettingsControlProps {
  placeUnderCamera: boolean;
  verticalOffset: number;
  trackRadius: number;
  trackDefaultOpacity: number;
  trackInsideOpacity: number;
  trackOpacityLerpSpeed: number;
  outlineMode: boolean;
  outlineOpacity: number;
  glowOpacity: number;
  forceInside: boolean;
  onPlaceUnderCameraChange: (value: boolean) => void;
  onVerticalOffsetChange: (value: number) => void;
  onTrackRadiusChange: (value: number) => void;
  onTrackDefaultOpacityChange: (value: number) => void;
  onTrackInsideOpacityChange: (value: number) => void;
  onTrackOpacityLerpSpeedChange: (value: number) => void;
  onOutlineModeChange: (value: boolean) => void;
  onOutlineOpacityChange: (value: number) => void;
  onGlowOpacityChange: (value: number) => void;
  onForceInsideToggle: () => void;
  onRebuildTrack: () => void;
}

const TrackSettingsControl: React.FC<TrackSettingsControlProps> = ({
  placeUnderCamera,
  verticalOffset,
  trackRadius,
  trackDefaultOpacity,
  trackInsideOpacity,
  trackOpacityLerpSpeed,
  outlineMode,
  outlineOpacity,
  glowOpacity,
  forceInside,
  onPlaceUnderCameraChange,
  onVerticalOffsetChange,
  onTrackRadiusChange,
  onTrackDefaultOpacityChange,
  onTrackInsideOpacityChange,
  onTrackOpacityLerpSpeedChange,
  onOutlineModeChange,
  onOutlineOpacityChange,
  onGlowOpacityChange,
  onForceInsideToggle,
  onRebuildTrack,
}) => {
  return (
    <div className="mt-4">
      <h4 className="font-medium text-gray-100 mb-1">Track Settings</h4>
      <div className="mb-2 text-xs text-gray-300">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={placeUnderCamera} onChange={(e) => onPlaceUnderCameraChange(e.target.checked)} />
          Place track under camera
        </label>
      </div>
      <div className="mb-2">
        <label className="block text-xs text-gray-300">Vertical Offset: {verticalOffset.toFixed(2)}</label>
        <input type="range" min="0" max="3" step="0.01" value={verticalOffset} onChange={(e) => onVerticalOffsetChange(Number(e.target.value))} className="w-full" />
      </div>
      <div className="mb-2">
        <label className="block text-xs text-gray-300">Track Radius: {trackRadius.toFixed(2)}</label>
        <input type="range" min="0.05" max="2" step="0.01" value={trackRadius} onChange={(e) => onTrackRadiusChange(Number(e.target.value))} className="w-full" />
      </div>
      <div className="mb-2">
        <label className="block text-xs text-gray-300">Default Opacity: {trackDefaultOpacity.toFixed(2)}</label>
        <input type="range" min="0" max="1" step="0.01" value={trackDefaultOpacity} onChange={(e) => onTrackDefaultOpacityChange(Number(e.target.value))} className="w-full" />
      </div>
      <div className="mb-2">
        <label className="block text-xs text-gray-300">Inside Opacity: {trackInsideOpacity.toFixed(2)}</label>
        <input type="range" min="0" max="1" step="0.01" value={trackInsideOpacity} onChange={(e) => onTrackInsideOpacityChange(Number(e.target.value))} className="w-full" />
      </div>
      <div className="mb-3">
        <label className="block text-xs text-gray-300">Opacity Lerp Speed: {trackOpacityLerpSpeed.toFixed(2)}</label>
        <input type="range" min="0.1" max="12" step="0.1" value={trackOpacityLerpSpeed} onChange={(e) => onTrackOpacityLerpSpeedChange(Number(e.target.value))} className="w-full" />
      </div>
      <div className="flex gap-2 mb-3">
        <button onClick={onForceInsideToggle} className="px-3 py-1 bg-orange-600 rounded">{forceInside ? 'Release Inside' : 'Force Inside'}</button>
        <button onClick={onRebuildTrack} className="px-3 py-1 bg-blue-600 rounded">Rebuild Track</button>
      </div>
      <div className="mb-3 text-xs text-gray-300">
        <label className="inline-flex items-center gap-2">
          <input type="checkbox" checked={outlineMode} onChange={(e) => onOutlineModeChange(e.target.checked)} />
          Outline Mode (minimal wireframe + glow)
        </label>
      </div>
      <div className="mb-2">
        <label className="block text-xs text-gray-300">Outline Opacity: {outlineOpacity.toFixed(2)}</label>
        <input type="range" min="0" max="1" step="0.01" value={outlineOpacity} onChange={(e) => onOutlineOpacityChange(Number(e.target.value))} className="w-full" />
      </div>
      <div className="mb-3">
        <label className="block text-xs text-gray-300">Glow Opacity: {glowOpacity.toFixed(2)}</label>
        <input type="range" min="0" max="1" step="0.01" value={glowOpacity} onChange={(e) => onGlowOpacityChange(Number(e.target.value))} className="w-full" />
      </div>
    </div>
  );
};

export default TrackSettingsControl;
