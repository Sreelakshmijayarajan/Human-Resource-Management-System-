import React from 'react';
import { useToast, ToastMessage } from '../../context/ToastContext';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';
import { cn } from './StatusBadge';

const ToastItem: React.FC<{ toast: ToastMessage; onClose: (id: string) => void }> = ({ toast, onClose }) => {
  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-500" />,
    error: <XCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-blue-500" />,
  };

  const bgColors = {
    success: 'bg-emerald-50 border-emerald-100',
    error: 'bg-red-50 border-red-100',
    info: 'bg-blue-50 border-blue-100',
  };

  return (
    <div className={cn('flex items-start gap-3 p-4 rounded-xl border shadow-lg pointer-events-auto animate-fade-in transition-all', bgColors[toast.type])}>
      {icons[toast.type]}
      <p className="flex-1 text-sm font-medium text-slate-800">{toast.message}</p>
      <button onClick={() => onClose(toast.id)} className="text-slate-400 hover:text-slate-600 transition-colors">
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 pointer-events-none max-w-sm w-full">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
      ))}
    </div>
  );
};
