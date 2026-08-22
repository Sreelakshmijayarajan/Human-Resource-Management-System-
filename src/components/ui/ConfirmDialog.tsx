import React, { useEffect } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { cn } from './StatusBadge';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  confirmLabel?: string;
  cancelText?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'primary' | 'success';
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose?: () => void;
  onCancel?: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmText,
  confirmLabel,
  cancelText,
  cancelLabel,
  variant,
  isDestructive = false,
  isLoading = false,
  onConfirm,
  onClose,
  onCancel,
}) => {
  const handleClose = () => {
    if (onClose) onClose();
    if (onCancel) onCancel();
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  if (!isOpen) return null;

  const resolvedConfirmText = confirmText || confirmLabel || 'Confirm';
  const resolvedCancelText = cancelText || cancelLabel || 'Cancel';
  const isDanger = variant === 'danger' || isDestructive;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in"
      aria-modal="true"
      role="dialog"
    >
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                  isDanger
                    ? 'bg-red-50 text-red-600'
                    : variant === 'success'
                    ? 'bg-emerald-50 text-emerald-600'
                    : 'bg-indigo-50 text-indigo-600'
                )}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900">{title}</h3>
            </div>
            <button
              onClick={handleClose}
              className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="mt-3 text-sm text-slate-600 leading-relaxed">{message}</p>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-semibold text-slate-700 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors disabled:opacity-50"
            >
              {resolvedCancelText}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={isLoading}
              className={cn(
                'px-4 py-2 text-sm font-semibold text-white rounded-xl shadow-xs transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50',
                isDanger
                  ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                  : variant === 'success'
                  ? 'bg-emerald-600 hover:bg-emerald-700 focus:ring-emerald-500'
                  : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
              )}
            >
              {isLoading ? 'Processing...' : resolvedConfirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
