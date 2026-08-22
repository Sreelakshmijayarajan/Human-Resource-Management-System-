import React, { useState } from 'react';
import {
  Cpu,
  ArrowRight,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  Users,
  ShieldAlert,
  RotateCcw,
  Zap,
  TrendingDown,
  Layers
} from 'lucide-react';

interface SimulationScenario {
  id: string;
  name: string;
  targetPerson: string;
  decisionType: string;
  currentState: {
    capacity: number;
    skillCoverage: number;
    risk: 'LOW' | 'MEDIUM' | 'HIGH';
  };
  simulatedState: {
    capacity: number;
    skillCoverage: number;
    risk: 'LOW' | 'MEDIUM' | 'HIGH';
  };
  aiInsight: string;
  whyExplanation: string;
  recommendation: string;
  suggestedAction: string;
}

const presetScenarios: SimulationScenario[] = [
  {
    id: 'sim-1',
    name: 'Priya Sharma (Frontend Lead) — 2-Day Casual Leave Request (Aug 25-26)',
    targetPerson: 'Priya Sharma',
    decisionType: 'Leave Approval Impact',
    currentState: {
      capacity: 86,
      skillCoverage: 94,
      risk: 'LOW',
    },
    simulatedState: {
      capacity: 71,
      skillCoverage: 63,
      risk: 'HIGH',
    },
    aiInsight: 'Engineering frontend sprint delivery is projected to fall below the safe delivery threshold if approved without backup coverage.',
    whyExplanation: '2 critical project skills (Next.js App Router Architecture & WebGL Visualizer) have zero secondary backups on duty during Aug 25-26.',
    recommendation: 'Approve leave conditionally with temporary code-review reassignment to Dev Patel.',
    suggestedAction: 'Approve + Reassign to Dev Patel',
  },
  {
    id: 'sim-2',
    name: 'Rahul Verma (HRBP) — 3-Day Sick Leave Approval (Aug 22-24)',
    targetPerson: 'Rahul Verma',
    decisionType: 'Statutory Compliance & Payroll',
    currentState: {
      capacity: 92,
      skillCoverage: 96,
      risk: 'LOW',
    },
    simulatedState: {
      capacity: 85,
      skillCoverage: 91,
      risk: 'LOW',
    },
    aiInsight: 'HR operations remain stable. Onboarding workflows can be absorbed seamlessly by Uma Umamaheshwari with zero delay.',
    whyExplanation: 'All critical HR compliance gates have 2+ active backups configured in system policy.',
    recommendation: 'Direct approval recommended with automatic delegation enabled.',
    suggestedAction: 'Approve Leave Request',
  },
  {
    id: 'sim-3',
    name: 'Arjun Singh (DevOps) — Transfer to Platform Architecture Team',
    targetPerson: 'Arjun Singh',
    decisionType: 'Department Reorganization',
    currentState: {
      capacity: 88,
      skillCoverage: 89,
      risk: 'LOW',
    },
    simulatedState: {
      capacity: 65,
      skillCoverage: 58,
      risk: 'HIGH',
    },
    aiInsight: 'Core Infrastructure reliability will incur an operational deficit during peak billing week.',
    whyExplanation: 'Kubernetes production cluster access requires minimum 2 active on-call engineers.',
    recommendation: 'Delay transfer by 14 days until secondary engineer completes shadow rotation.',
    suggestedAction: 'Schedule Phased Transition',
  },
];

export const WhatIfSimulator: React.FC<{ onExecuteDecision?: (action: string) => void }> = ({
  onExecuteDecision,
}) => {
  const [selectedScenarioId, setSelectedScenarioId] = useState<string>(presetScenarios[0].id);
  const [isSimulating, setIsSimulating] = useState(false);
  const [hasExecuted, setHasExecuted] = useState<string | null>(null);

  const activeScenario = presetScenarios.find((s) => s.id === selectedScenarioId) || presetScenarios[0];

  const handleSimulateChange = (id: string) => {
    setIsSimulating(true);
    setSelectedScenarioId(id);
    setHasExecuted(null);
    setTimeout(() => {
      setIsSimulating(false);
    }, 400);
  };

  const handleExecute = (actionText: string) => {
    setHasExecuted(actionText);
    if (onExecuteDecision) onExecuteDecision(actionText);
  };

  return (
    <div className="bg-white dark:bg-[#121821] rounded-2xl border border-slate-200/80 dark:border-white/[0.07] shadow-card p-6 space-y-6">
      {/* Simulator Command Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-white/[0.06]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#0c8fe9]/10 text-[#0c8fe9] flex items-center justify-center font-bold shadow-2xs">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-extrabold text-slate-900 dark:text-[#F5F7FA] tracking-tight">
                WHAT-IF WORKFORCE SIMULATOR
              </h2>
              <span className="text-[10px] font-mono font-semibold uppercase bg-[#0c8fe9]/10 dark:bg-[#0c8fe9]/10 text-[#0070c7] dark:text-[#36abf8] px-2 py-0.5 rounded border border-[#0c8fe9]/20">
                Decision Sandbox
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-[#707A87] mt-0.5">
              Simulate organizational and operational workforce decisions before you commit them.
            </p>
          </div>
        </div>

        {/* Scenario Selector Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-slate-500 dark:text-[#707A87] hidden md:inline">Scenario:</span>
          <select
            value={selectedScenarioId}
            onChange={(e) => handleSimulateChange(e.target.value)}
            className="text-xs font-medium border border-slate-200 dark:border-white/[0.08] rounded-xl px-3 py-2 bg-slate-50 dark:bg-[#161E28] hover:bg-slate-100 dark:hover:bg-[#1B2531] text-slate-800 dark:text-[#E5E7EB] focus:outline-none focus:ring-2 focus:ring-[#0c8fe9]/20 focus:border-[#0c8fe9]/40 transition cursor-pointer"
          >
            {presetScenarios.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasExecuted && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 text-emerald-900 dark:text-emerald-300 rounded-xl flex items-center justify-between text-xs font-medium animate-slide-up">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>Decision committed: <strong>"{hasExecuted}"</strong>. Telemetry updated.</span>
          </div>
          <button
            onClick={() => setHasExecuted(null)}
            className="text-emerald-700 dark:text-emerald-400 hover:underline text-[11px] font-semibold"
          >
            Reset Simulation
          </button>
        </div>
      )}

      {/* Visual State Comparison: Current vs Simulated */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Metric 1: Capacity */}
        <div className="p-4 rounded-xl border border-slate-200/80 dark:border-white/[0.07] bg-slate-50/50 dark:bg-[#161E28] flex flex-col justify-between">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#707A87]">Team Capacity</p>
          <div className="flex items-center justify-between my-3">
            <div>
              <span className="text-[10px] text-slate-400 dark:text-[#707A87] block font-medium">CURRENT</span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-[#F5F7FA] font-mono">
                {activeScenario.currentState.capacity}%
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 dark:text-[#4A5568] mx-2 shrink-0" />
            <div className="text-right">
              <span className="text-[10px] text-slate-400 dark:text-[#707A87] block font-medium">SIMULATED</span>
              <span className={`text-2xl font-extrabold font-mono ${activeScenario.simulatedState.capacity < 75 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-[#F5F7FA]'
                }`}>
                {activeScenario.simulatedState.capacity}%
              </span>
            </div>
          </div>
          <div className="w-full bg-slate-200 dark:bg-white/[0.08] h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${activeScenario.simulatedState.capacity < 75 ? 'bg-rose-500' : 'bg-[#0c8fe9]'
                }`}
              style={{ width: `${activeScenario.simulatedState.capacity}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Skill Coverage */}
        <div className="p-4 rounded-xl border border-slate-200/80 dark:border-white/[0.07] bg-slate-50/50 dark:bg-[#161E28] flex flex-col justify-between">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#707A87]">Skill Redundancy</p>
          <div className="flex items-center justify-between my-3">
            <div>
              <span className="text-[10px] text-slate-400 dark:text-[#707A87] block font-medium">CURRENT</span>
              <span className="text-2xl font-extrabold text-slate-900 dark:text-[#F5F7FA] font-mono">
                {activeScenario.currentState.skillCoverage}%
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 dark:text-[#4A5568] mx-2 shrink-0" />
            <div className="text-right">
              <span className="text-[10px] text-slate-400 dark:text-[#707A87] block font-medium">SIMULATED</span>
              <span className={`text-2xl font-extrabold font-mono ${activeScenario.simulatedState.skillCoverage < 70 ? 'text-rose-600 dark:text-rose-400' : 'text-slate-900 dark:text-[#F5F7FA]'
                }`}>
                {activeScenario.simulatedState.skillCoverage}%
              </span>
            </div>
          </div>
          <div className="w-full bg-slate-200 dark:bg-white/[0.08] h-1.5 rounded-full overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${activeScenario.simulatedState.skillCoverage < 70 ? 'bg-rose-500' : 'bg-emerald-500'
                }`}
              style={{ width: `${activeScenario.simulatedState.skillCoverage}%` }}
            />
          </div>
        </div>

        {/* Metric 3: Operational Risk */}
        <div className="p-4 rounded-xl border border-slate-200/80 dark:border-white/[0.07] bg-slate-50/50 dark:bg-[#161E28] flex flex-col justify-between">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-[#707A87]">Operational Risk</p>
          <div className="flex items-center justify-between my-3">
            <div>
              <span className="text-[10px] text-slate-400 dark:text-[#707A87] block font-medium">CURRENT</span>
              <span className="text-sm font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-200 dark:border-emerald-500/20">
                {activeScenario.currentState.risk}
              </span>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-300 dark:text-[#4A5568] mx-2 shrink-0" />
            <div className="text-right">
              <span className="text-[10px] text-slate-400 dark:text-[#707A87] block font-medium">SIMULATED</span>
              <span className={`text-sm font-bold px-2 py-0.5 rounded border ${activeScenario.simulatedState.risk === 'HIGH'
                  ? 'bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20'
                  : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20'
                }`}>
                {activeScenario.simulatedState.risk}
              </span>
            </div>
          </div>
          <p className="text-[10px] text-slate-400 dark:text-[#707A87] font-medium">
            {activeScenario.simulatedState.risk === 'HIGH' ? 'Bottleneck threshold triggered' : 'Within safe operational bounds'}
          </p>
        </div>
      </div>

      {/* AI Impact Explanation & Prescriptive Action */}
      <div className="p-5 rounded-xl bg-slate-50 dark:bg-[#161E28] border border-slate-200/80 dark:border-white/[0.07] space-y-4">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-[#0c8fe9]" />
          <h4 className="text-xs font-bold text-slate-900 dark:text-[#F5F7FA] uppercase tracking-wider">
            Decision Impact Analysis & Prescriptive Intelligence
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="space-y-1.5 bg-white dark:bg-[#121821] p-3.5 rounded-lg border border-slate-200/60 dark:border-white/[0.06]">
            <span className="text-[10px] font-bold uppercase text-slate-400 dark:text-[#707A87] tracking-wider">Why this happens</span>
            <p className="text-slate-700 dark:text-[#A7B0BC] leading-relaxed font-medium">
              {activeScenario.whyExplanation}
            </p>
          </div>

          <div className="space-y-1.5 bg-white dark:bg-[#121821] p-3.5 rounded-lg border border-slate-200/60 dark:border-white/[0.06]">
            <span className="text-[10px] font-bold uppercase text-[#0070c7] dark:text-[#36abf8] tracking-wider">Prescriptive Strategy</span>
            <p className="text-slate-800 dark:text-[#E5E7EB] leading-relaxed font-semibold">
              {activeScenario.recommendation}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
          <button
            onClick={() => handleSimulateChange(presetScenarios[(presetScenarios.indexOf(activeScenario) + 1) % presetScenarios.length].id)}
            className="text-xs font-semibold text-slate-600 dark:text-[#A7B0BC] hover:text-slate-900 dark:hover:text-[#F5F7FA] flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try Alternative Scenario</span>
          </button>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => handleExecute('Review Simulation Telemetry')}
              className="px-4 py-2 text-xs font-semibold text-slate-700 dark:text-[#E5E7EB] bg-white dark:bg-[#121821] border border-slate-200 dark:border-white/[0.08] hover:bg-slate-50 dark:hover:bg-[#1B2531] rounded-xl transition-all shadow-2xs"
            >
              Review Evidence
            </button>
            <button
              onClick={() => handleExecute(activeScenario.suggestedAction)}
              className="px-5 py-2.5 text-xs font-bold text-white bg-[#0c8fe9] hover:bg-[#0070c7] active:scale-[0.98] rounded-xl transition-all shadow-subtle flex items-center gap-2"
            >
              <Zap className="w-3.5 h-3.5 text-amber-300" />
              <span>{activeScenario.suggestedAction}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
