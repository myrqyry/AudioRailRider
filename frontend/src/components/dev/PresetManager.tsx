import React from 'react';

interface Preset {
  name: string;
  data: Record<string, any>;
}

interface PresetManagerProps {
  presets: Preset[];
  onSavePreset: (name: string) => void;
  onExportPreset: (data: Record<string, any>) => void;
  onSharePreset: (data: Record<string, any>) => void;
  onImportPreset: (file: File | null) => void;
  onLoadPreset: (data: Record<string, any>) => void;
}

const PresetManager: React.FC<PresetManagerProps> = ({
  presets,
  onSavePreset,
  onExportPreset,
  onSharePreset,
  onImportPreset,
  onLoadPreset,
}) => {
  return (
    <div className="mt-3">
      <h4 className="font-medium text-gray-100 mb-1">Presets</h4>
      <div className="mt-2 flex gap-2">
        <input id="presetName" placeholder="Preset name" className="flex-1 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm" />
        <button onClick={() => { const el = document.getElementById('presetName') as HTMLInputElement | null; if (el && el.value) onSavePreset(el.value); }} className="px-3 py-1 bg-blue-600 rounded">Save</button>
      </div>
      <div className="mt-2 flex gap-2">
        <button onClick={() => {
          const sel = presets[presets.length - 1];
          if (sel) onExportPreset(sel.data);
        }} className="px-2 py-1 bg-gray-800 rounded">Export Last</button>
        <button onClick={() => {
          if (presets.length === 0) { console.warn('No presets to share'); return; }
          const sel = presets[presets.length - 1];
          onSharePreset(sel.data);
        }} className="px-2 py-1 bg-cyan-600 rounded">Share URL</button>
        <label className="px-2 py-1 bg-emerald-600 rounded cursor-pointer">
          Import
          <input id="presetFile" type="file" accept="application/json" className="hidden" onChange={(e) => onImportPreset(e.target.files ? e.target.files[0] : null)} />
        </label>
      </div>
      {presets.length > 0 && (
        <div className="mt-2">
          <div className="text-xs text-gray-400 mb-1">Presets</div>
          <div className="space-y-1">
            {presets.map((p, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <div className="text-sm flex-1">{p.name}</div>
                <button onClick={() => onLoadPreset(p.data)} className="px-2 py-1 bg-gray-800 rounded">Load</button>
                <button onClick={() => onExportPreset(p.data)} className="px-2 py-1 bg-blue-600 rounded">Export</button>
                <button onClick={() => onSharePreset(p.data)} className="px-2 py-1 bg-cyan-600 rounded">Share</button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PresetManager;
