
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

// Polyfill for libraries that expect Node's `global` variable to exist in the runtime.
// Some third-party libs (bundled for web) reference `global.CONFIG` etc. directly.
// Assigning to window.global and globalThis.global makes the identifier available in the global scope.
try {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (typeof global === 'undefined') (window as any).global = window;
  // Also ensure globalThis points to the same object
  (globalThis as any).global = globalThis;
} catch (e) {
  // ignore
}

// Populate a runtime-safe import.meta.env replica and process.env shim so other modules
// can read environment variables without referencing `import.meta` directly. We avoid
// referencing `import.meta` at the top level in order to keep this file parseable by Jest
// (which can transform ESM but may not support raw import.meta everywhere).
try {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const metaEnv = (typeof import.meta !== 'undefined' ? (import.meta as any).env : undefined) || {};
  // Expose as a global readable by environment module
  (globalThis as any).__import_meta_env__ = metaEnv;

  // Also populate a process.env shim for libraries that check process.env directly in the browser
  if (typeof (window as any).process === 'undefined') {
    (window as any).process = { env: {} };
  }
  if (!(window as any).process.env) (window as any).process.env = {};

  // Copy values from import.meta.env into window.process.env for compatibility
  Object.keys(metaEnv).forEach((k) => {
    try {
      (window as any).process.env[k] = metaEnv[k];
    } catch (e) {
      // ignore
    }
  });
} catch (e) {
  // ignore
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

// Dynamically import App and ToastProvider after we've set up environment shims so
// modules that read env at import-time will observe the injected values.
const root = ReactDOM.createRoot(rootElement);
Promise.all([import('./components/SafeAppWrapper'), import('./lib/ToastProvider')])
  .then(([{ default: SafeAppWrapper }, { default: ToastProvider }]) => {
    root.render(
      <React.StrictMode>
        <ToastProvider>
          <SafeAppWrapper />
        </ToastProvider>
      </React.StrictMode>
    );
  })
  .catch((err) => {
    // If dynamic import fails, surface the error to aid debugging
    // eslint-disable-next-line no-console
    console.error('Failed to initialize app:', err);
    throw err;
  });
