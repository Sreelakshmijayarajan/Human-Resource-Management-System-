import React, { useState } from 'react';
import {
  X,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  TrendingUp,
  Clock,
  User,
  Calendar,
  Layers,
  FileCheck,
  MessageSquare,
  ShieldAlert,
  ArrowRight,
  Activity
} from 'lucide-react';

export interface IntelligenceSignal {
  id: string;
  title: string;
  employeeName: string;
  employeeId: string;
  employeeRole: string;
  department: string;
  severity: 'stable' | 'attention' | 'high';
  metric: string;
  baseline: string;
  reason: string;
  aiInsight: string;
  whyThisMatters: string;
  evidence: string[];
  impact: {
    capacityDelta: string;
    skillCoverageDelta: string;
    operationalRisk: string;
  };
  recommendation: string;
  confidenceScore: number;
}

interface IntelligenceDrawerProps {
  isOpen: boolean;
  signal: IntelligenceSignal | null;
  onClose: () => void;
  onActionTaken?: (actionType: string, signalId: string) => void;
}

export const IntelligenceDrawer: React.FC<IntelligenceDrawerProps> = ({
  isOpen,
  signal,
  onClose,
  onActionTaken,
}) => {
  const [actionSuccess, setActionSuccess] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isOpen || !signal) return null;

  const handleAction = (type: string) => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setActionSuccess(type);
      if (onActionTaken) onActionTaken(type, signal.id);
      setTimeout(() => {
        setActionSuccess(null);
        onClose();
      }, 1500);
    }, 600);
  };

  const severityBadge = {
    stable: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-500/20',
    attention: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200/80 dark:border-amber-500/20',
    high: 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200/80 dark:border-rose-500/20',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white dark:bg-[#121821] shadow-drawer border-l border-slate-200/80 dark:border-white/[0.08] flex flex-col justify-between animate-slide-in-right">
          {/* Header */}
          <div className="px-6 py-4.5 border-b border-slate-100 dark:border-white/[0.06] flex items-center justify-between bg-slate-50/50 dark:bg-[#161E28]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-[#0c8fe9]/10 text-[#0c8fe9] flex items-center justify-center font-bold text-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 dark:text-[#F5F7FA] flex items-center gap-2">
                  <span>Workforce Intelligence Dossier</span>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${severityBadge[signal.severity]}`}>
                    {signal.severity}
                  </span>
                </h2>
                <p className="text-[11px] text-slate-400 dark:text-[#707A87] font-mono">Signal Ref: #{signal.id}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 dark:text-[#707A87] dark:hover:text-[#E5E7EB] hover:bg-slate-100 dark:hover:bg-[#1B2531] rounded-lg transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 text-xs">
            {/* Success Toast */}
            {actionSuccess && (
              <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-800 dark:text-emerald-300 rounded-xl flex items-center gap-2 font-medium animate-slide-up">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
                <span>Action "{actionSuccess}" successfully dispatched and logged in audit trail.</span>
              </div>
            )}

            {/* Subject Profile Card */}
            <div className="p-4 bg-slate-50/70 dark:bg-[#161E28] rounded-xl border border-slate-200/70 dark:border-white/[0.06] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 dark:bg-[#1B2531] text-white font-bold text-sm flex items-center justify-center shadow-2xs">
                  {signal.employeeName.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-[#E5E7EB] text-sm">{signal.employeeName}</h3>
                  <p className="text-slate-500 dark:text-[#707A87] text-[11px]">{signal.employeeRole} • {signal.department}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-semibold text-slate-400 dark:text-[#707A87]">Deviation Delta</p>
                <p className="text-sm font-bold text-slate-900 dark:text-[#F5F7FA] font-mono">{signal.metric}</p>
              </div>
            </div>

            {/* Signal Description & Baseline */}
            <div className="space-y-1.5">
              <h4 className="font-semibold uppercase tracking-wider text-[10px] text-slate-400 dark:text-[#707A87]">
                Observed Anomaly
              </h4>
              <p className="text-slate-800 dark:text-[#E5E7EB] leading-relaxed font-medium bg-slate-50 dark:bg-[#161E28] p-3 rounded-xl border border-slate-100 dark:border-white/[0.06]">
                {signal.reason}
              </p>
            </div>

            {/* AI Decision Intelligence Panel */}
            <div className="p-4.5 rounded-xl bg-[#0c8fe9]/8 dark:bg-[#0c8fe9]/10 border border-[#0c8fe9]/20 dark:border-[#0c8fe9]/20 space-y-4">
              <div className="flex items-center justify-between border-b border-[#0c8fe9]/15 pb-2.5">
                <div className="flex items-center gap-2 text-[#0070c7] dark:text-[#36abf8] font-bold">
                  <Sparkles className="w-4 h-4 text-[#0c8fe9]" />
                  <span>AI Synthesis & Decision Support</span>
                </div>
                <span className="text-[10px] font-mono text-[#0070c7] dark:text-[#36abf8] bg-white dark:bg-[#121821] px-2 py-0.5 rounded border border-[#0c8fe9]/25 font-semibold">
                  Confidence: {signal.confidenceScore}%
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-slate-800 dark:text-[#E5E7EB] font-medium leading-relaxed">
                  {signal.aiInsight}
                </p>
              </div>

              {/* Why This Matters */}
              <div className="pt-2 border-t border-[#0c8fe9]/15 space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#0070c7] dark:text-[#36abf8]">Why this matters</p>
                <p className="text-slate-600 dark:text-[#A7B0BC] leading-relaxed">{signal.whyThisMatters}</p>
              </div>
            </div>

            {/* Impact Metric Deltas */}
            <div className="space-y-2">
              <h4 className="font-semibold uppercase tracking-wider text-[10px] text-slate-400 dark:text-[#707A87]">
                Simulated Operational Impact
              </h4>
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-3 bg-white dark:bg-[#161E28] rounded-xl border border-slate-200/80 dark:border-white/[0.06] shadow-2xs">
                  <p className="text-[10px] text-slate-400 dark:text-[#707A87] font-medium">Team Capacity</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-[#F5F7FA] font-mono mt-1">{signal.impact.capacityDelta}</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#161E28] rounded-xl border border-slate-200/80 dark:border-white/[0.06] shadow-2xs">
                  <p className="text-[10px] text-slate-400 dark:text-[#707A87] font-medium">Skill Coverage</p>
                  <p className="text-sm font-bold text-slate-900 dark:text-[#F5F7FA] font-mono mt-1">{signal.impact.skillCoverageDelta}</p>
                </div>
                <div className="p-3 bg-white dark:bg-[#161E28] rounded-xl border border-slate-200/80 dark:border-white/[0.06] shadow-2xs">
                  <p className="text-[10px] text-slate-400 dark:text-[#707A87] font-medium">Operational Risk</p>
                  <p className="text-sm font-bold text-rose-600 dark:text-rose-400 font-mono mt-1">{signal.impact.operationalRisk}</p>
                </div>
              </div>
            </div>

            {/* Evidence & Supporting Signals */}
            <div className="space-y-2">
              <h4 className="font-semibold uppercase tracking-wider text-[10px] text-slate-400 dark:text-[#707A87]">
                Evidence Chain & Telemetry
              </h4>
              <div className="space-y-1.5">
                {signal.evidence.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-2.5 bg-slate-50/80 dark:bg-[#161E28] rounded-lg border border-slate-100 dark:border-white/[0.06]">
                    <Activity className="w-3.5 h-3.5 text-slate-400 dark:text-[#707A87] mt-0.5 shrink-0" />
                    <span className="text-slate-700 dark:text-[#A7B0BC] leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Prescriptive Recommendation */}
            <div className="p-4 bg-emerald-50/60 dark:bg-emerald-500/10 border border-emerald-200/80 dark:border-emerald-500/20 rounded-xl space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-900 dark:text-emerald-400 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Prescriptive Recommendation</span>
              </div>
              <p className="text-emerald-950 dark:text-emerald-300 font-medium leading-relaxed">
                {signal.recommendation}
              </p>
            </div>
          </div>

          {/* Contextual Action Footer */}
          <div className="p-4 border-t border-slate-100 dark:border-white/[0.06] bg-slate-50/70 dark:bg-[#161E28] flex items-center justify-between gap-3">
            <button
              onClick={() => handleAction('Dismiss Signal')}
              disabled={isProcessing}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-[#A7B0BC] hover:text-slate-900 dark:hover:text-[#F5F7FA] hover:bg-slate-200/60 dark:hover:bg-[#1B2531] rounded-xl transition-colors"
            >
              Dismiss Signal
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleAction('Schedule 1-on-1 Review')}
                disabled={isProcessing}
                className="px-3.5 py-2 text-xs font-semibold text-slate-800 dark:text-[#E5E7EB] bg-white dark:bg-[#121821] border border-slate-200 dark:border-white/[0.08] hover:bg-slate-50 dark:hover:bg-[#1B2531] rounded-xl transition-colors shadow-2xs"
              >
                Schedule 1-on-1
              </button>
              <button
                onClick={() => handleAction('Apply Prescribed Action')}
                disabled={isProcessing}
                className="px-4 py-2 text-xs font-bold text-white bg-[#0c8fe9] hover:bg-[#0070c7] active:scale-[0.98] rounded-xl transition-all shadow-subtle flex items-center gap-1.5"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Execute Recommendation</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
