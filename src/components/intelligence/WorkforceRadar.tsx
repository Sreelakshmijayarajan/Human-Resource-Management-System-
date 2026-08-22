import React, { useState } from 'react';
import {
  Zap,
  AlertTriangle,
  Clock,
  TrendingUp,
  Users,
  ShieldAlert,
  ArrowRight,
  Filter,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { IntelligenceSignal, IntelligenceDrawer } from './IntelligenceDrawer';

export const mockSignals: IntelligenceSignal[] = [
  {
    id: 'SIG-8841',
    title: 'Attendance Deviation',
    employeeName: 'Arun Kumar',
    employeeId: 'E009',
    employeeRole: 'Senior Data Engineer',
    department: 'Analytics',
    severity: 'attention',
    metric: '+34% vs 6mo baseline',
    baseline: 'Normal 09:05 AM arrival | Recent: 10:45 AM average',
    reason: 'Recent attendance pattern differs significantly (+34%) from the employee\'s 6-month historical baseline over the last 10 working days.',
    aiInsight: 'Correlated with recent project handoff sprint on Real-Time Ingestion Pipeline. Employee logged late evening commits between 11:30 PM – 02:00 AM.',
    whyThisMatters: 'Chronic late-night delivery cycles risk burn-out and skew sprint velocity predictability for the upcoming Q3 release.',
    evidence: [
      'Last 8 check-ins occurred between 10:30 AM – 11:15 AM.',
      'Average work hours maintained at 9.4 hrs/day despite late arrival.',
      'Active GitHub PR activity recorded past midnight across 6 instances.'
    ],
    impact: {
      capacityDelta: '0% (Hours met)',
      skillCoverageDelta: '100% Stable',
      operationalRisk: 'MODERATE (Burnout)',
    },
    recommendation: 'Initiate supportive 1-on-1 check-in to adjust core working hours or rebalance late-night deployment shifts.',
    confidenceScore: 94,
  },
  {
    id: 'SIG-8842',
    title: 'Capacity & Redundancy Risk',
    employeeName: 'Priya Sharma',
    employeeId: 'E002',
    employeeRole: 'Frontend Lead',
    department: 'Engineering',
    severity: 'high',
    metric: 'Redundancy Deficit (-31%)',
    baseline: 'Requires min 2 active leads on Next.js App Router',
    reason: 'Pending 2-day leave request (Aug 25-26) creates an unhedged coverage hole in Core Frontend Architecture.',
    aiInsight: 'Zero secondary architects currently have active permissions on production deployment gates during this window.',
    whyThisMatters: 'Any production regressions during the planned client demo will have a 4+ hour MTTR delay.',
    evidence: [
      'Only Priya has master signing authority for Web Client v2.4 release.',
      'Sprint deadline coincides with second day of requested leave.',
    ],
    impact: {
      capacityDelta: '-15% Team Velocity',
      skillCoverageDelta: '-31% Coverage',
      operationalRisk: 'HIGH (Release Blocker)',
    },
    recommendation: 'Delegate code-signing role temporarily to Dev Patel prior to approving leave.',
    confidenceScore: 98,
  },
  {
    id: 'SIG-8843',
    title: 'Overtime Workload Velocity',
    employeeName: 'Dev Patel',
    employeeId: 'E005',
    employeeRole: 'Backend Engineer',
    department: 'Engineering',
    severity: 'attention',
    metric: '+18.5h Overtime in 14d',
    baseline: 'Standard 40h/week statutory contract',
    reason: 'Workload volume exceeded standard limits due to payment gateway migration backlog.',
    aiInsight: 'Dev has absorbed 62% of all urgent bug triage tickets in the last two sprint cycles.',
    whyThisMatters: 'Statutory compliance rules require compensatory off or overtime disbursement sign-off within 30 days.',
    evidence: [
      'Average daily duration: 10h 42m across last 9 business days.',
      'Ticket throughput is 2.3x higher than department median.',
    ],
    impact: {
      capacityDelta: '+22% Output',
      skillCoverageDelta: '100% Retained',
      operationalRisk: 'LOW (Requires Comp Off)',
    },
    recommendation: 'Grant 1 compensatory rest day next week and reallocate 3 pending backlog tasks to Arjun Singh.',
    confidenceScore: 91,
  },
  {
    id: 'SIG-8844',
    title: 'HR Policy Compliance Normal',
    employeeName: 'Rahul Verma',
    employeeId: 'E003',
    employeeRole: 'HR Business Partner',
    department: 'Human Resources',
    severity: 'stable',
    metric: 'Compliant & Buffered',
    baseline: 'Statutory sick leave balance: 10 days remaining',
    reason: 'Medical rest leave request for 3 days is fully covered by existing departmental backups.',
    aiInsight: 'Uma Umamaheshwari is active and has full administrative permissions to cover onboarding and approvals.',
    whyThisMatters: 'Zero operational bottleneck detected for the HR department.',
    evidence: [
      'All pending employee requests can be processed by secondary admin.',
      'No critical interviews or onboarding scheduled for Aug 22-24.',
    ],
    impact: {
      capacityDelta: '-7% (Absorbed)',
      skillCoverageDelta: '100% Backed Up',
      operationalRisk: 'STABLE',
    },
    recommendation: 'Approve without conditions.',
    confidenceScore: 99,
  },
];

export const WorkforceRadar: React.FC = () => {
  const [filterSeverity, setFilterSeverity] = useState<string>('all');
  const [selectedSignal, setSelectedSignal] = useState<IntelligenceSignal | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const filtered = filterSeverity === 'all'
    ? mockSignals
    : mockSignals.filter((s) => s.severity === filterSeverity);

  const handleOpenInvestigate = (sig: IntelligenceSignal) => {
    setSelectedSignal(sig);
    setIsDrawerOpen(true);
  };

  const severityBadge = {
    stable: 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-500/20',
    attention: 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200/80 dark:border-amber-500/20',
    high: 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200/80 dark:border-rose-500/20',
  };

  return (
    <div className="space-y-6">
      {/* Radar Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-[#F5F7FA] tracking-tight">
              Workforce Intelligence Radar
            </h2>
            <span className="flex items-center gap-1 text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live Telemetry
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-[#707A87] mt-1">
            Real-time attention signals, attendance deviations, and capacity bottleneck surveillance.
          </p>
        </div>

        {/* Severity Filter Tabs */}
        <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-[#161E28] p-1 rounded-xl border border-slate-200/60 dark:border-white/[0.06]">
          {[
            { id: 'all', label: 'All Signals' },
            { id: 'high', label: 'High Attention' },
            { id: 'attention', label: 'Attention' },
            { id: 'stable', label: 'Stable' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterSeverity(tab.id)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${filterSeverity === tab.id
                  ? 'bg-white dark:bg-[#1B2531] text-slate-900 dark:text-[#F5F7FA] shadow-2xs'
                  : 'text-slate-500 dark:text-[#707A87] hover:text-slate-900 dark:hover:text-[#E5E7EB]'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Signal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filtered.map((sig) => (
          <div
            key={sig.id}
            className="bg-white dark:bg-[#121821] rounded-2xl border border-slate-200/80 dark:border-white/[0.07] shadow-card p-5 flex flex-col justify-between hover:border-slate-300 dark:hover:border-white/[0.12] transition-all group"
          >
            <div className="space-y-3">
              {/* Header with Title & Badge */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${sig.severity === 'high'
                        ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        : sig.severity === 'attention'
                          ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400'
                          : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                      }`}
                  >
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 dark:text-[#E5E7EB] text-sm">{sig.title}</h3>
                    <p className="text-[11px] text-slate-400 dark:text-[#707A87] font-mono">
                      {sig.employeeName} ({sig.employeeRole})
                    </p>
                  </div>
                </div>

                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${severityBadge[sig.severity]}`}
                >
                  {sig.severity}
                </span>
              </div>

              {/* Metric & Reason */}
              <div className="p-3 bg-slate-50 dark:bg-[#161E28] rounded-xl border border-slate-100 dark:border-white/[0.06] space-y-1 text-xs">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-400 dark:text-[#707A87] font-medium">Observed Metric:</span>
                  <span className="font-bold text-slate-900 dark:text-[#F5F7FA] font-mono">{sig.metric}</span>
                </div>
                <p className="text-slate-600 dark:text-[#A7B0BC] text-[11px] leading-relaxed pt-1 border-t border-slate-200/60 dark:border-white/[0.06]">
                  {sig.reason}
                </p>
              </div>
            </div>

            {/* Footer Action */}
            <div className="pt-4 mt-2 border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
              <span className="text-[10px] text-slate-400 dark:text-[#707A87] font-mono">
                AI Confidence: {sig.confidenceScore}%
              </span>
              <button
                onClick={() => handleOpenInvestigate(sig)}
                className="px-3.5 py-1.5 text-xs font-bold text-[#0c8fe9] dark:text-[#36abf8] bg-[#0c8fe9]/10 hover:bg-[#0c8fe9]/20 active:scale-[0.98] rounded-xl transition-all flex items-center gap-1.5"
              >
                <span>Investigate Signal</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Slide-over Investigation Drawer */}
      <IntelligenceDrawer
        isOpen={isDrawerOpen}
        signal={selectedSignal}
        onClose={() => setIsDrawerOpen(false)}
      />
    </div>
  );
};
