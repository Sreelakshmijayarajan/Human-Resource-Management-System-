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
    stable: 'bg-emerald-50 text-emerald-700 border-emerald-200/80',
    attention: 'bg-amber-50 text-amber-700 border-amber-200/80',
    high: 'bg-rose-50 text-rose-700 border-rose-200/80',
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-fade-in">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-xl bg-white shadow-drawer border-l border-slate-200/80 flex flex-col justify-between animate-slide-in-right">
          {/* Header */}
          <div className="px-6 py-4.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <span>Workforce Intelligence Dossier</span>
                  <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full border ${severityBadge[signal.severity]}`}>
                    {signal.severity}
                  </span>
                </h2>
                <p className="text-[11px] text-slate-400 font-mono">Signal Ref: #{signal.id}</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6 text-xs">
            {/* Success Toast */}
            {actionSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-2 font-medium animate-slide-up">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Action "{actionSuccess}" successfully dispatched and logged in audit trail.</span>
              </div>
            )}

            {/* Subject Profile Card */}
            <div className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/70 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-slate-900 text-white font-bold text-sm flex items-center justify-center shadow-2xs">
                  {signal.employeeName.split(' ').map((n) => n[0]).join('')}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{signal.employeeName}</h3>
                  <p className="text-slate-500 text-[11px]">{signal.employeeRole} • {signal.department}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase font-semibold text-slate-400">Deviation Delta</p>
                <p className="text-sm font-bold text-slate-900 font-mono">{signal.metric}</p>
              </div>
            </div>

            {/* Signal Description & Baseline */}
            <div className="space-y-1.5">
              <h4 className="font-semibold text-slate-900 uppercase tracking-wider text-[10px] text-slate-400">
                Observed Anomaly
              </h4>
              <p className="text-slate-800 leading-relaxed font-medium bg-slate-50 p-3 rounded-xl border border-slate-100">
                {signal.reason}
              </p>
            </div>

            {/* AI Decision Intelligence Panel */}
            <div className="p-4.5 rounded-xl bg-indigo-50/50 border border-indigo-100/80 space-y-4">
              <div className="flex items-center justify-between border-b border-indigo-100/60 pb-2.5">
                <div className="flex items-center gap-2 text-indigo-950 font-bold">
                  <Sparkles className="w-4 h-4 text-indigo-600" />
                  <span>AI Synthesis & Decision Support</span>
                </div>
                <span className="text-[10px] font-mono text-indigo-600 bg-white px-2 py-0.5 rounded border border-indigo-200 font-semibold">
                  Confidence: {signal.confidenceScore}%
                </span>
              </div>

              <div className="space-y-2">
                <p className="text-indigo-950 font-medium leading-relaxed">
                  {signal.aiInsight}
                </p>
              </div>

              {/* Why This Matters */}
              <div className="pt-2 border-t border-indigo-100/60 space-y-1">
                <p className="text-[10px] font-bold uppercase tracking-wider text-indigo-700">Why this matters</p>
                <p className="text-slate-700 leading-relaxed">{signal.whyThisMatters}</p>
              </div>
            </div>

            {/* Impact Metric Deltas */}
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-900 uppercase tracking-wider text-[10px] text-slate-400">
                Simulated Operational Impact
              </h4>
              <div className="grid grid-cols-3 gap-2.5">
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                  <p className="text-[10px] text-slate-400 font-medium">Team Capacity</p>
                  <p className="text-sm font-bold text-slate-900 font-mono mt-1">{signal.impact.capacityDelta}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                  <p className="text-[10px] text-slate-400 font-medium">Skill Coverage</p>
                  <p className="text-sm font-bold text-slate-900 font-mono mt-1">{signal.impact.skillCoverageDelta}</p>
                </div>
                <div className="p-3 bg-white rounded-xl border border-slate-200/80 shadow-2xs">
                  <p className="text-[10px] text-slate-400 font-medium">Operational Risk</p>
                  <p className="text-sm font-bold text-rose-600 font-mono mt-1">{signal.impact.operationalRisk}</p>
                </div>
              </div>
            </div>

            {/* Evidence & Supporting Signals */}
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-900 uppercase tracking-wider text-[10px] text-slate-400">
                Evidence Chain & Telemetry
              </h4>
              <div className="space-y-1.5">
                {signal.evidence.map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-2.5 bg-slate-50/80 rounded-lg border border-slate-100">
                    <Activity className="w-3.5 h-3.5 text-slate-400 mt-0.5 shrink-0" />
                    <span className="text-slate-700 leading-snug">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Prescriptive Recommendation */}
            <div className="p-4 bg-emerald-50/60 border border-emerald-200/80 rounded-xl space-y-1.5">
              <div className="flex items-center gap-1.5 text-emerald-900 font-bold text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Prescriptive Recommendation</span>
              </div>
              <p className="text-emerald-950 font-medium leading-relaxed">
                {signal.recommendation}
              </p>
            </div>
          </div>

          {/* Contextual Action Footer */}
          <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center justify-between gap-3">
            <button
              onClick={() => handleAction('Dismiss Signal')}
              disabled={isProcessing}
              className="px-3.5 py-2 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 rounded-xl transition-colors"
            >
              Dismiss Signal
            </button>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleAction('Schedule 1-on-1 Review')}
                disabled={isProcessing}
                className="px-3.5 py-2 text-xs font-semibold text-slate-800 bg-white border border-slate-200 hover:bg-slate-50 rounded-xl transition-colors shadow-2xs"
              >
                Schedule 1-on-1
              </button>
              <button
                onClick={() => handleAction('Apply Prescribed Action')}
                disabled={isProcessing}
                className="px-4 py-2 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] rounded-xl transition-all shadow-subtle flex items-center gap-1.5"
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
