import React, { createContext, useContext, useState, useCallback } from 'react';

/**
 * Defines the structure of a single toast notification.
 */
type Toast = {
  /** A unique identifier for the toast. */
  id: string;
  /** The message to be displayed. */
  message: string;
  /** The type of the toast, affecting its color and icon. */
  type?: 'success' | 'error' | 'info';
  /** Whether the toast is currently visible (used for animations). */
  visible?: boolean;
};

/**
 * Defines the value provided by the ToastContext.
 */
type ToastContextValue = {
  /**
   * Adds a new toast notification.
   * @param {string} message - The message to display.
   * @param {Toast['type']} [type] - The type of the toast.
   * @param {number} [ttl] - The time-to-live for the toast in milliseconds.
   */
  addToast: (message: string, type?: Toast['type'], ttl?: number) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

/**
 * A hook to access the toast context.
 * Provides a function to add new toasts.
 * @returns {ToastContextValue} The toast context value.
 * @throws {Error} If used outside of a ToastProvider.
 */
export const useToast = () => {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used within a ToastProvider');
  return ctx;
};

/**
 * A provider component that manages the state of toast notifications
 * and makes the `addToast` function available to its children.
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components.
 * @returns {React.ReactElement} The rendered provider with the toast container.
 */
export const ToastProvider: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

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
