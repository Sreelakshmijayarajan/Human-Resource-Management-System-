import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-indigo-600 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-200 bg-emerald-50/90 text-emerald-950',
    error: 'border-red-200 bg-red-50/90 text-red-950',
    info: 'border-indigo-200 bg-indigo-50/90 text-indigo-950',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-slide-up max-w-md">
      <div
        className={`flex items-start gap-3 p-4 rounded-2xl border shadow-xl backdrop-blur-md transition-all ${borders[toast.type]}`}
      >
        {icons[toast.type]}
        <div className="flex-1 pr-2">
          <p className="text-sm font-bold tracking-tight">{toast.title}</p>
          {toast.message && <p className="text-xs opacity-90 mt-0.5">{toast.message}</p>}
        </div>
        <button
          onClick={onDismiss}
          className="p-1 rounded-lg hover:bg-black/5 text-slate-500 transition-colors"
          aria-label="Dismiss toast"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
