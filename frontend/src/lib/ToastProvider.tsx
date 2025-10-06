import React, { createContext, useContext, useState, useCallback } from 'react';

type Toast = { id: string; message: string; type?: 'success' | 'error' | 'info'; visible?: boolean };

type ToastContextValue = { addToast: (message: string, type?: Toast['type'], ttl?: number) => void };

const ToastContext = createContext<ToastContextValue | null>(null);

export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
};

export const ToastProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Immediately mark toast invisible then remove after animation duration
  const remove = useCallback((id: string) => {
    // mark invisible
    setToasts(prev => prev.map(t => t.id === id ? { ...t, visible: false } : t));
    // actual removal after animation (200ms)
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 250);
  }, []);

  const addToast = useCallback((message: string, type: Toast['type'] = 'info', ttl = 3000) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const t: Toast = { id, message, type, visible: true };
    setToasts(prev => [...prev, t]);
    // schedule hide
    setTimeout(() => remove(id), ttl);
  }, [remove]);

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}

      {/* Toast container: ARIA live region, accessible, simple animations */}
      <div aria-live="polite" aria-atomic="true" className="fixed left-4 bottom-4 z-60 pointer-events-none">
        <div className="flex flex-col gap-2">
          {toasts.map(t => (
            <div key={t.id} className={`pointer-events-auto flex items-center justify-between gap-3 px-3 py-2 rounded text-sm text-white shadow-lg transform transition-all duration-200 ${t.visible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-2 scale-95'} ${t.type === 'success' ? 'bg-emerald-600' : t.type === 'error' ? 'bg-red-600' : 'bg-gray-800'}`}>
              <div className="flex-1 pr-2">{t.message}</div>
              <button aria-label="Dismiss" onClick={() => remove(t.id)} className="ml-2 text-white/90 hover:text-white px-1 py-1 rounded focus:outline-none">
                ✕
              </button>
            </div>
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
};

export default ToastProvider;
