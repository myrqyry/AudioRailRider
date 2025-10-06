import React, { useState, useEffect } from 'react';
import { useToast } from '../lib/ToastProvider';
import { isDevelopment, isDebugEnabled } from '../config/environment';

const DEFAULTS = { curlStrength: 0.12, noiseScale: 2.0, noiseSpeed: 0.12 };
const STORAGE_KEY = 'audiorailrider:dev:curlParams';
const VIS_KEY = 'audiorailrider:dev:visible';

const DevPanel: React.FC = () => {
  // Only render when development + debug enabled
  if (!isDevelopment() || !isDebugEnabled()) return null;

  const load = () => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return DEFAULTS;
  };
  const saved = load();
  const [curlStrength, setCurlStrength] = useState<number>(saved.curlStrength ?? DEFAULTS.curlStrength);
  const [noiseScale, setNoiseScale] = useState<number>(saved.noiseScale ?? DEFAULTS.noiseScale);
  const [noiseSpeed, setNoiseSpeed] = useState<number>(saved.noiseSpeed ?? DEFAULTS.noiseSpeed);
  const [visible, setVisible] = useState<boolean>(() => {
    try { return localStorage.getItem(VIS_KEY) === '1'; } catch (e) { return true; }
  });
  // Types for the shader uniform manifest
  type UniformControl = 'range' | 'number' | 'checkbox' | 'color' | 'select' | string;
  interface UniformDef {
    name: string;
    control: UniformControl;
    min?: number;
    max?: number;
    step?: number;
    default?: any;
    options?: string[];
  }

  const [uniformsManifest, setUniformsManifest] = useState<Record<string, UniformDef[]> | null>(null);
  const [uniformValues, setUniformValues] = useState<Record<string, any>>({});
  // quick lookup map built from manifest for validation/clamping
  const [uniformLookup, setUniformLookup] = useState<Record<string, UniformDef>>({});
  const { addToast } = (() => {
    try { return useToast(); } catch (e) { return { addToast: (m: string) => { /* noop when provider absent */ } }; }
  })();
  const PRESET_KEY = 'audiorailrider:dev:presets';
  const [presets, setPresets] = useState<Record<string, any>[]>(() => {
    try { return JSON.parse(localStorage.getItem(PRESET_KEY) || '[]'); } catch (e) { return []; }
  });

  useEffect(() => {
    const dispatch = () => {
      window.dispatchEvent(new CustomEvent('audiorailrider:dev:setCurlParams', { detail: { curlStrength, noiseScale, noiseSpeed } }));
    };
    // Dispatch on mount so VisualEffects picks up defaults
    dispatch();

    const onKey = (e: KeyboardEvent) => {
      // Ctrl+Shift+D toggles panel
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'd') {
        setVisible(v => { const nv = !v; try { localStorage.setItem(VIS_KEY, nv ? '1' : '0'); } catch (e) {} ; return nv; });
      }
      if (e.key === 'Escape') {
        setVisible(false);
        try { localStorage.setItem(VIS_KEY, '0'); } catch (e) {}
      }
    };
    window.addEventListener('keydown', onKey);

    return () => window.removeEventListener('keydown', onKey);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const detail = { curlStrength, noiseScale, noiseSpeed };
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(detail)); } catch (e) {}
    window.dispatchEvent(new CustomEvent('audiorailrider:dev:setCurlParams', { detail }));
  }, [curlStrength, noiseScale, noiseSpeed]);

  // Cache the manifest fetch in a module-level promise so multiple DevPanel
  // mounts (or React strict-mode double-invocation) don't fetch/log twice.
  let cachedManifestPromise: Promise<any> | null = (window as any).__audiorailrider_uniforms_manifest_promise || null;
  if (!cachedManifestPromise) {
    cachedManifestPromise = (async () => {
      try {
        const resp = await fetch('/shaders/shader-uniforms.json');
        if (!resp.ok) return null;
        return await resp.json();
      } catch (e) { return null; }
    })();
    (window as any).__audiorailrider_uniforms_manifest_promise = cachedManifestPromise;
  }

  useEffect(() => {
    let mounted = true;
    (async () => {
      const manifest = await cachedManifestPromise;
      if (!mounted || !manifest) return;
      setUniformsManifest(manifest);
      const lookup: Record<string, UniformDef> = {};
      for (const shader of Object.keys(manifest)) {
        for (const u of manifest[shader] as UniformDef[]) {
          lookup[u.name] = u;
        }
      }
      setUniformLookup(lookup);
      const vals: Record<string, any> = {};
      for (const shader of Object.keys(manifest)) {
        for (const u of manifest[shader] as UniformDef[]) {
          if (u.default !== undefined) vals[u.name] = u.default;
          else if (u.control === 'checkbox') vals[u.name] = !!u.default;
          else if (u.min !== undefined) vals[u.name] = u.min;
          else vals[u.name] = typeof u.default !== 'undefined' ? u.default : 0;
        }
      }
      setUniformValues(vals);
    })();
    return () => { mounted = false; };
  }, []);

  const reset = () => {
    setCurlStrength(DEFAULTS.curlStrength);
    setNoiseScale(DEFAULTS.noiseScale);
    setNoiseSpeed(DEFAULTS.noiseSpeed);
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  };

  const loadUniforms = async () => {
    try {
      const resp = await fetch('/shaders/shader-uniforms.json');
      if (!resp.ok) return;
      const manifest = await resp.json();
      console.log('Loaded shader manifest', manifest);
      setUniformsManifest(manifest);
      window.dispatchEvent(new CustomEvent('audiorailrider:dev:loadUniformsManifest', { detail: { manifest } }));
    } catch (e) { console.error(e); }
  };

  const applyCurlDefaults = () => {
    // dispatch a few likely uniform updates so users can see immediate effect
    window.dispatchEvent(new CustomEvent('audiorailrider:dev:applyUniform', { detail: { name: 'curlStrength', value: DEFAULTS.curlStrength } }));
    window.dispatchEvent(new CustomEvent('audiorailrider:dev:applyUniform', { detail: { name: 'noiseScale', value: DEFAULTS.noiseScale } }));
    window.dispatchEvent(new CustomEvent('audiorailrider:dev:applyUniform', { detail: { name: 'noiseSpeed', value: DEFAULTS.noiseSpeed } }));
  };

  const applyUniform = (name: string, value: any) => {
    // keep local state in sync
    setUniformValues(prev => ({ ...prev, [name]: value }));
    window.dispatchEvent(new CustomEvent('audiorailrider:dev:applyUniform', { detail: { name, value } }));
  };

  // Helpers for preset export/import and URL sharing
  const base64Encode = (obj: any) => {
    try {
      return btoa(unescape(encodeURIComponent(JSON.stringify(obj)))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    } catch (e) {
      return '';
    }
  };
  const base64Decode = (s: string) => {
    try {
      s = s.replace(/-/g, '+').replace(/_/g, '/');
      // pad
      while (s.length % 4) s += '=';
      return JSON.parse(decodeURIComponent(escape(atob(s))));
    } catch (e) {
      return null;
    }
  };

  const clamp = (name: string, value: any) => {
    const def = uniformLookup[name];
    if (!def) return value;
    if (typeof value === 'number' && typeof def.min === 'number' && typeof def.max === 'number') {
      return Math.min(def.max, Math.max(def.min, value));
    }
    return value;
  };

  const validateAndCoerce = (name: string, value: any) => {
    const def = uniformLookup[name];
    if (!def) return value;
    // handle booleans
    if (def.control === 'checkbox') return !!value;
    // handle selects
    if (def.control === 'select' && Array.isArray(def.options)) {
      if (def.options.includes(value)) return value;
      return def.options[0];
    }
    // handle color (simple hex validation)
    if (def.control === 'color') {
      if (typeof value === 'string' && /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(value)) return value;
      return def.default ?? '#000000';
    }
    // handle numeric
    if ((def.control === 'range' || def.control === 'number') && (typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value))))) {
      const num = typeof value === 'number' ? value : Number(value);
      if (typeof def.min === 'number' && typeof def.max === 'number') return Math.min(def.max, Math.max(def.min, num));
      return num;
    }
    return value;
  };

  const downloadJSON = (obj: any, filename = 'preset.json') => {
    const blob = new Blob([JSON.stringify(obj, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = async (text: string) => {
    if ((navigator as any).clipboard && (navigator as any).clipboard.writeText) {
      try { await (navigator as any).clipboard.writeText(text); return true; } catch (e) { /* fallthrough */ }
    }
    try { document.execCommand('copy'); return true; } catch (e) { return false; }
  };

  // when not using provider, addToast is a noop fallback handled above

  const savePreset = (name: string) => {
    const data: Record<string, any> = {};
    // snapshot current uniform values from React state
    for (const k of Object.keys(uniformValues)) {
      data[k] = uniformValues[k];
    }
    // also include curl params explicitly
    data.curlStrength = curlStrength;
    data.noiseScale = noiseScale;
    data.noiseSpeed = noiseSpeed;
    const newPresets = [...presets, { name, data }];
    setPresets(newPresets);
    try { localStorage.setItem(PRESET_KEY, JSON.stringify(newPresets)); } catch (e) {}
  };

  const exportPreset = (p: Record<string, any>) => {
    downloadJSON(p, `audiorailrider-preset-${Date.now()}.json`);
  };

  const sharePresetUrl = (p: Record<string, any>) => {
    const code = base64Encode(p);
    const url = `${location.origin}${location.pathname}?preset=${code}`;
    copyToClipboard(url).then(ok => {
      if (ok) addToast('Preset URL copied to clipboard', 'success');
      else addToast('Copy failed; showing URL', 'info');
    });
  };

  const importPresetFromFile = async (file: File | null) => {
    if (!file) return;
    try {
      const txt = await file.text();
      const json = JSON.parse(txt);
      // validate shape: expect object of name->value or {name,data}
      let data = json;
      if (json && json.data && typeof json.data === 'object') data = json.data;
      // clamp & apply
      const validated: Record<string, any> = {};
      for (const k of Object.keys(data)) {
        const coerced = validateAndCoerce(k, data[k]);
        validated[k] = clamp(k, coerced);
      }
      loadPreset(validated);
      addToast('Preset imported and applied', 'success');
    } catch (e) { console.error('Failed to import preset', e); }
  };

  // On mount: if there's a ?preset=<b64> parameter, try to apply it
  useEffect(() => {
    try {
      const params = new URLSearchParams(location.search);
      const code = params.get('preset');
      if (code) {
        const obj = base64Decode(code);
        if (obj) {
          const data = obj.data && typeof obj.data === 'object' ? obj.data : obj;
          const validated: Record<string, any> = {};
          for (const k of Object.keys(data)) {
            const coerced = validateAndCoerce(k, data[k]);
            validated[k] = clamp(k, coerced);
          }
          // apply
          loadPreset(validated);
        }
      }
    } catch (e) {}
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const loadPreset = (p: Record<string, any>) => {
    // apply preset values into state and dispatch to visuals
    for (const k of Object.keys(p)) {
      const raw = p[k];
      const v = typeof raw === 'string' && !isNaN(Number(raw)) ? Number(raw) : raw;
      if (k === 'curlStrength' && typeof v === 'number') setCurlStrength(v);
      if (k === 'noiseScale' && typeof v === 'number') setNoiseScale(v);
      if (k === 'noiseSpeed' && typeof v === 'number') setNoiseSpeed(v);
      setUniformValues(prev => ({ ...prev, [k]: v }));
      // dispatch apply for each uniform so visuals update
      window.dispatchEvent(new CustomEvent('audiorailrider:dev:applyUniform', { detail: { name: k, value: v } }));
    }
  };

  if (!visible) return null;

  return (
    <div className="fixed right-4 top-4 z-50 w-72 p-3 bg-gray-900/80 border border-gray-700 rounded-lg text-sm text-gray-200 backdrop-blur-md">
      <h3 className="font-semibold text-gray-100 mb-2">Dev Panel</h3>
      <div className="mb-2">
        <label className="block text-xs text-gray-300">Curl Strength: {curlStrength.toFixed(2)}</label>
        <input type="range" min="0" max="1" step="0.01" value={curlStrength} onChange={(e) => setCurlStrength(Number(e.target.value))} className="w-full" />
      </div>
      <div className="mb-2">
        <label className="block text-xs text-gray-300">Noise Scale: {noiseScale.toFixed(2)}</label>
        <input type="range" min="0.1" max="8" step="0.1" value={noiseScale} onChange={(e) => setNoiseScale(Number(e.target.value))} className="w-full" />
      </div>
      <div className="mb-3">
        <label className="block text-xs text-gray-300">Noise Speed: {noiseSpeed.toFixed(2)}</label>
        <input type="range" min="0" max="1" step="0.01" value={noiseSpeed} onChange={(e) => setNoiseSpeed(Number(e.target.value))} className="w-full" />
      </div>
      <div className="flex gap-2">
        <button onClick={reset} className="flex-1 px-3 py-1 bg-gray-800 border border-gray-600 rounded">Reset</button>
        <button onClick={() => window.dispatchEvent(new CustomEvent('audiorailrider:dev:dump', { detail: { curlStrength, noiseScale, noiseSpeed } }))} className="px-3 py-1 bg-cyan-600 rounded">Log</button>
      </div>
      <div className="mt-3 flex gap-2">
        <button onClick={loadUniforms} className="flex-1 px-3 py-1 bg-gray-800 border border-gray-600 rounded">Load Uniforms</button>
        <button onClick={applyCurlDefaults} className="px-3 py-1 bg-emerald-600 rounded">Apply Curl Defaults</button>
      </div>
      {uniformsManifest ? (
        <div className="mt-3">
          <h4 className="font-medium text-gray-100 mb-1">Shader Uniforms</h4>
          <div className="space-y-2 max-h-48 overflow-auto pr-2">
            {Object.entries(uniformsManifest).map(([shader, uniforms]) => (
              <div key={shader} className="mb-2">
                <div className="text-xs text-gray-400">{shader}</div>
                {uniforms.map((u: any) => (
                  <div key={u.name} className="mt-1">
                    <label className="block text-xs text-gray-300">{u.name}</label>
                    {u.control === 'range' && (
                      <input data-uniform={`$${u.name}`} type="range" min={u.min ?? 0} max={u.max ?? 1} step={u.step ?? 0.01} value={uniformValues[u.name] ?? (u.min ?? 0)} onChange={(e) => applyUniform(u.name, Number(e.target.value))} className="w-full" />
                    )}
                    {u.control === 'number' && (
                      <input data-uniform={`$${u.name}`} type="number" min={u.min ?? 0} max={u.max ?? 16} step={u.step ?? 1} value={uniformValues[u.name] ?? (u.min ?? 0)} onChange={(e) => applyUniform(u.name, Number(e.target.value))} className="w-full" />
                    )}
                    {u.control === 'checkbox' && (
                      <input data-uniform={`$${u.name}`} type="checkbox" checked={!!uniformValues[u.name]} onChange={(e) => applyUniform(u.name, e.target.checked)} />
                    )}
                    {u.control === 'color' && (
                      <input data-uniform={`$${u.name}`} type="color" value={uniformValues[u.name] ?? '#000000'} onChange={(e) => applyUniform(u.name, e.target.value)} />
                    )}
                    {u.control === 'select' && u.options && (
                      <select data-uniform={`$${u.name}`} value={uniformValues[u.name] ?? u.options[0]} onChange={(e) => applyUniform(u.name, e.target.value)} className="w-full">
                        {u.options.map((opt: string) => <option key={opt} value={opt}>{opt}</option>)}
                      </select>
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="mt-2 flex gap-2">
            <input id="presetName" placeholder="Preset name" className="flex-1 px-2 py-1 bg-gray-800 border border-gray-700 rounded text-sm" />
            <button onClick={() => { const el = document.getElementById('presetName') as HTMLInputElement | null; if (el && el.value) savePreset(el.value); }} className="px-3 py-1 bg-blue-600 rounded">Save</button>
          </div>
          <div className="mt-2 flex gap-2">
            <button onClick={() => {
              const sel = presets[presets.length - 1];
              if (sel) exportPreset(sel.data);
            }} className="px-2 py-1 bg-gray-800 rounded">Export Last</button>
            <button onClick={() => {
              if (presets.length === 0) { addToast('No presets to share', 'info'); return; }
              const sel = presets[presets.length - 1];
              sharePresetUrl(sel.data);
            }} className="px-2 py-1 bg-cyan-600 rounded">Share URL</button>
            <label className="px-2 py-1 bg-emerald-600 rounded cursor-pointer">
              Import
              <input id="presetFile" type="file" accept="application/json" className="hidden" onChange={(e) => importPresetFromFile(e.target.files ? e.target.files[0] : null)} />
            </label>
          </div>
          {presets.length > 0 && (
            <div className="mt-2">
              <div className="text-xs text-gray-400 mb-1">Presets</div>
              <div className="space-y-1">
                {presets.map((p, idx) => (
                  <div key={idx} className="flex gap-2 items-center">
                    <div className="text-sm flex-1">{p.name}</div>
                    <button onClick={() => loadPreset(p.data)} className="px-2 py-1 bg-gray-800 rounded">Load</button>
                    <button onClick={() => exportPreset(p.data)} className="px-2 py-1 bg-blue-600 rounded">Export</button>
                    <button onClick={() => sharePresetUrl(p.data)} className="px-2 py-1 bg-cyan-600 rounded">Share</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        {/* Toasts rendered by ToastProvider at app root */}
        </div>
      ) : null}
    </div>
  );
};

export default DevPanel;
