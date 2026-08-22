import React, { useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
import { cn } from './StatusBadge';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
  isDestructive?: boolean;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isDestructive = false
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm animate-fade-in" 
        onClick={onCancel}
      />
      
      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden animate-slide-up border border-slate-100">
        <div className="p-6">
          <div className="flex items-start gap-4">
            <div className={cn('p-3 rounded-xl flex-shrink-0', isDestructive ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600')}>
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="flex-1 pt-1">
              <h3 className="text-lg font-bold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm text-slate-500 leading-relaxed">{message}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-slate-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-slate-100">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            className={cn(
              'px-4 py-2 text-sm font-semibold text-white rounded-xl transition-colors shadow-sm focus:ring-2 focus:ring-offset-2',
              isDestructive 
                ? 'bg-red-600 hover:bg-red-700 focus:ring-red-500' 
                : 'bg-indigo-600 hover:bg-indigo-700 focus:ring-indigo-500'
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
