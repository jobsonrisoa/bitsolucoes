"use client";
import { createContext, useContext, useState, ReactNode } from 'react';
import { Toast, ToastProps } from '@/components/ui/Toast';

interface ToastContextData {
  addToast: (toast: Omit<ToastProps, 'onClose'>) => void;
}

const ToastContext = createContext<ToastContextData>({ addToast: () => {} });

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<(Omit<ToastProps, 'onClose'> & { id: number })[]>([]);

  const addToast = (toast: Omit<ToastProps, 'onClose'>) => {
    setToasts((prev) => [...prev, { ...toast, id: Date.now() }]);
  };

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2">
        {toasts.map((t) => (
          <Toast key={t.id} {...t} onClose={() => removeToast(t.id)} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export const useToast = () => useContext(ToastContext);
