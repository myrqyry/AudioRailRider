import React, { useEffect, useState } from 'react';

/**
 * Checks if the WebGL renderer is likely a software implementation.
 * @param {string | null} renderer - The renderer string from WebGL debug info.
 * @param {string | null} vendor - The vendor string from WebGL debug info.
 * @returns {boolean} True if the renderer is likely software-based, false otherwise.
 */
const isSoftwareRenderer = (renderer: string | null, vendor: string | null) => {
  if (!renderer && !vendor) return false;
  const r = (renderer || '').toLowerCase();
  const v = (vendor || '').toLowerCase();
  // SwiftShader and ANGLE vendor strings frequently indicate software paths
  if (r.includes('swiftshader') || v === 'google inc. (google)') return true;
  return false;
};

/**
 * A component that displays a warning message if the application is using a
 * software-based WebGL renderer, which may result in poor performance.
 * @returns {React.ReactElement | null} The rendered warning component or null if not needed.
 */
const RendererWarning: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [renderer, setRenderer] = useState<string | null>(null);
  const [vendor, setVendor] = useState<string | null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) return;
      // @ts-ignore
      const dbg = gl.getExtension('WEBGL_debug_renderer_info');
      if (dbg) {
        // @ts-ignore
        const r = gl.getParameter(dbg.UNMASKED_RENDERER_WEBGL) as string | null;
        // @ts-ignore
        const v = gl.getParameter(dbg.UNMASKED_VENDOR_WEBGL) as string | null;
        setRenderer(r);
        setVendor(v);
        if (isSoftwareRenderer(r, v)) setVisible(true);
      }
    } catch (e) {
      // ignore — don't block the app
    }
  }, []);

  if (!visible) return null;

  return (
    <div role="status" className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-yellow-900/90 border border-yellow-700 text-yellow-100 px-4 py-3 rounded-md shadow-lg">
      <div className="flex items-center gap-3">
        <div className="flex-1 text-sm">VisualEffects is running on a software renderer ({renderer || 'unknown'}). Performance may be reduced. For best visuals enable hardware acceleration or run with a GPU-enabled browser.</div>
        <button aria-label="dismiss" onClick={() => setVisible(false)} className="ml-3 px-3 py-1 bg-yellow-800/60 rounded">Dismiss</button>
      </div>
    </div>
  );
};

export default RendererWarning;
