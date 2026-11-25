'use client';

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from 'react';

type ToastKind = 'success' | 'error' | 'info';
interface ToastState {
  id: number;
  message: string;
  kind: ToastKind;
}

const ToastContext = createContext<(message: string, kind?: ToastKind) => void>(() => {});

/** Show a short, screen-reader-announced notification ("Copied to clipboard"). */
export function useToast() {
  return useContext(ToastContext);
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const counter = useRef(0);

  const show = useCallback((message: string, kind: ToastKind = 'success') => {
    counter.current += 1;
    setToast({ id: counter.current, message, kind });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setToast(null), 2600);
  }, []);

  // Both pairs meet WCAG AA contrast in light and dark themes.
  const tone =
    toast?.kind === 'error'
      ? 'border border-danger/40 bg-danger-soft text-danger'
      : 'bg-fg text-bg';

  return (
    <ToastContext.Provider value={show}>
      {children}
      <div
        aria-live="polite"
        role="status"
        className="pointer-events-none fixed inset-x-0 bottom-6 z-[60] flex justify-center px-4"
      >
        {toast ? (
          <div
            key={toast.id}
            className={`rounded-lg px-4 py-2.5 text-sm font-medium shadow-lg ${tone}`}
          >
            {toast.message}
          </div>
        ) : null}
      </div>
    </ToastContext.Provider>
  );
}
