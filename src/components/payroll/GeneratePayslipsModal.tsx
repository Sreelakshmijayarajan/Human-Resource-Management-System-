import React, { useState, useEffect } from 'react';
import { X, CheckCircle2, Loader2, DollarSign } from 'lucide-react';

interface GeneratePayslipsModalProps {
  isOpen: boolean;
  onGenerateComplete: (count: number, month: string) => void;
  onClose: () => void;
}

export const GeneratePayslipsModal: React.FC<GeneratePayslipsModalProps> = ({
  isOpen,
  onGenerateComplete,
  onClose,
}) => {
  const [selectedMonth, setSelectedMonth] = useState('August 2026');
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('');

  useEffect(() => {
    if (isOpen) {
      setIsGenerating(false);
      setProgress(0);
      setStatusText('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isGenerating) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isGenerating, onClose]);

  if (!isOpen) return null;

  const handleStartGeneration = () => {
    setIsGenerating(true);
    setProgress(10);
    setStatusText('Fetching active employee salary structures...');

    setTimeout(() => {
      setProgress(35);
      setStatusText('Calculating tax deductions & allowances...');
    }, 600);

    setTimeout(() => {
      setProgress(70);
      setStatusText('Generating formatted PDF payslips & vouchers...');
    }, 1200);

    setTimeout(() => {
      setProgress(100);
      setStatusText('Finalizing payroll batch records...');
    }, 1800);

    setTimeout(() => {
      setIsGenerating(false);
      onGenerateComplete(15, selectedMonth);
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-[#161E28] rounded-2xl shadow-2xl border border-slate-100 dark:border-white/[0.08] overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-[#F5F7FA]">Batch Generate Payslips</h3>
          </div>
          {!isGenerating && (
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 dark:text-[#707A87] dark:hover:text-[#E5E7EB] rounded-lg hover:bg-slate-100 dark:hover:bg-[#1B2531] transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>

        <div className="p-5 space-y-4">
          {!isGenerating ? (
            <>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-[#E5E7EB] mb-1.5">
                  Select Payroll Month / Cycle
                </label>
                <select
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-sm rounded-xl border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121821] text-slate-900 dark:text-[#E5E7EB] focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none"
                >
                  <option value="August 2026">August 2026 (Current Cycle)</option>
                  <option value="July 2026">July 2026</option>
                  <option value="June 2026">June 2026</option>
                </select>
              </div>

              <div className="p-4 bg-emerald-50/60 dark:bg-emerald-500/10 rounded-xl border border-emerald-100 dark:border-emerald-500/20 text-xs text-emerald-900 dark:text-emerald-300 space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-emerald-800 dark:text-emerald-400">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Ready to Generate Batch
                </p>
                <p>This action will generate payslips for all 15 active employees for {selectedMonth}.</p>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-white/[0.06]">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 dark:text-[#E5E7EB] border border-slate-200 dark:border-white/[0.08] bg-white dark:bg-[#121821] rounded-xl hover:bg-slate-50 dark:hover:bg-[#1B2531] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleStartGeneration}
                  className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors"
                >
                  Generate All Payslips
                </button>
              </div>
            </>
          ) : (
            <div className="py-8 text-center space-y-4">
              <div className="relative w-16 h-16 mx-auto flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-emerald-600 animate-spin" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-[#F5F7FA]">Generating Payslips...</h4>
                <p className="text-xs text-slate-500 dark:text-[#707A87] mt-1">{statusText}</p>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-slate-100 dark:bg-white/[0.08] h-2.5 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-600 h-full transition-all duration-300 ease-out"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400">{progress}% completed</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
