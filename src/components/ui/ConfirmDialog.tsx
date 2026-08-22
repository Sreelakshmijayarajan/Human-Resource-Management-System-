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
      <div className="relative w-full max-w-md bg-white dark:bg-[#161E28] rounded-2xl shadow-2xl border border-slate-100 dark:border-white/[0.08] overflow-hidden transform transition-all">
        <div className="p-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                  isDanger
                    ? 'bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400'
                    : variant === 'success'
                    ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                    : 'bg-blue-50 dark:bg-blue-500/10 text-[#0c8fe9] dark:text-[#36abf8]'
                )}
              >
                <AlertTriangle className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-[#F5F7FA]">{title}</h3>
            </div>
            <button
              onClick={handleClose}
              className="p-1 text-slate-400 hover:text-slate-600 dark:text-[#707A87] dark:hover:text-[#E5E7EB] rounded-lg hover:bg-slate-100 dark:hover:bg-[#1B2531] transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <p className="mt-3 text-sm text-slate-600 dark:text-[#A7B0BC] leading-relaxed">{message}</p>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="px-4 py-2 text-sm font-semibold text-slate-700 dark:text-[#E5E7EB] bg-white dark:bg-[#121821] border border-slate-200 dark:border-white/[0.08] rounded-xl hover:bg-slate-50 dark:hover:bg-[#1B2531] transition-colors disabled:opacity-50"
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
                  : 'bg-[#0c8fe9] hover:bg-[#0070c7] focus:ring-[#0c8fe9]'
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
