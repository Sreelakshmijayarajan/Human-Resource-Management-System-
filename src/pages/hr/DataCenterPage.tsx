import React, { useState } from 'react';
import {
  Database,
  Upload,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  RefreshCw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Server,
  Layers,
  FileText
} from 'lucide-react';

export const DataCenterPage: React.FC = () => {
  const [step, setStep] = useState<'upload' | 'validating' | 'preview' | 'syncing' | 'complete'>('upload');
  const [dragOver, setDragOver] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);

  const handleFileUpload = (fileName: string) => {
    setSelectedFile(fileName);
    setStep('validating');
    setTimeout(() => {
      setStep('preview');
    }, 1200);
  };

  const handleStartSync = () => {
    setStep('syncing');
    setTimeout(() => {
      setStep('complete');
    }, 2000);
  };

  const mockParsedData = [
    { id: 'E101', name: 'Alok Sharma', role: 'Staff ML Engineer', dept: 'AI & Data', status: 'Valid' },
    { id: 'E102', name: 'Tanvi Saxena', role: 'Product Manager', dept: 'Product', status: 'Valid' },
    { id: 'E103', name: 'Rohan Mehta', role: 'Security Architect', dept: 'Engineering', status: 'Warning (Missing Shift ID)' },
    { id: 'E104', name: 'Deepa Krishnan', role: 'Frontend Engineer', dept: 'Engineering', status: 'Valid' },
  ];

  return (
    <div className="space-y-6 animate-fade-in max-w-5xl mx-auto pb-8">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-[#F5F7FA] tracking-tight">
            Workforce Data Center & Synchronization
          </h1>
          <span className="text-[10px] uppercase font-bold text-indigo-700 dark:text-[#36abf8] bg-indigo-50 dark:bg-[#0c8fe9]/10 px-2 py-0.5 rounded-full border border-indigo-200 dark:border-[#0c8fe9]/20">
            Enterprise Sync
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-[#707A87] mt-1">
          Import HR rosters, timesheets, and statutory leave policies to synchronize Dayflow's workforce intelligence models.
        </p>
      </div>

      {/* Pipeline Stepper */}
      <div className="bg-white dark:bg-[#121821] rounded-2xl border border-slate-200/80 dark:border-white/[0.07] p-4 shadow-card">
        <div className="grid grid-cols-5 gap-2 text-xs font-semibold">
          {[
            { id: 'upload', label: '1. Upload Data' },
            { id: 'validating', label: '2. Validate Schema' },
            { id: 'preview', label: '3. Inspect Preview' },
            { id: 'syncing', label: '4. Refresh AI' },
            { id: 'complete', label: '5. Synchronized' },
          ].map((s, idx) => {
            const isCurrent = step === s.id;
            const isPassed =
              (s.id === 'upload' && step !== 'upload') ||
              (s.id === 'validating' && (step === 'preview' || step === 'syncing' || step === 'complete')) ||
              (s.id === 'preview' && (step === 'syncing' || step === 'complete')) ||
              (s.id === 'syncing' && step === 'complete');

            return (
              <div
                key={s.id}
                className={`flex items-center gap-2 p-2 rounded-xl transition-all ${isCurrent
                    ? 'bg-[#0c8fe9]/10 dark:bg-[#0c8fe9]/10 text-[#0070c7] dark:text-[#36abf8] border border-[#0c8fe9]/25 font-bold'
                    : isPassed
                      ? 'text-emerald-700 dark:text-emerald-400 font-medium'
                      : 'text-slate-400 dark:text-[#707A87]'
                  }`}
              >
                {isPassed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                ) : (
                  <span className="w-4 h-4 rounded-full bg-slate-100 dark:bg-white/[0.06] flex items-center justify-center text-[10px] text-slate-500 dark:text-[#707A87] shrink-0">
                    {idx + 1}
                  </span>
                )}
                <span className="truncate">{s.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step 1: Upload Box */}
      {step === 'upload' && (
        <div className="bg-white dark:bg-[#121821] rounded-2xl border border-slate-200/80 dark:border-white/[0.07] p-8 shadow-card space-y-6">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              handleFileUpload('August_Workforce_Roster_v3.csv');
            }}
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${dragOver ? 'border-[#0c8fe9] bg-[#0c8fe9]/5' : 'border-slate-200 dark:border-white/[0.12] hover:border-slate-300 dark:hover:border-white/[0.2] bg-slate-50/40 dark:bg-white/[0.02]'
              }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-[#0c8fe9]/10 text-[#0c8fe9] mx-auto flex items-center justify-center mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-[#E5E7EB]">
              Drag and drop your workforce dataset here
            </h3>
            <p className="text-xs text-slate-400 dark:text-[#707A87] mt-1">
              Supports CSV, XLSX, and Odoo HR export format (up to 50MB)
            </p>

            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                onClick={() => handleFileUpload('August_Workforce_Roster_v3.csv')}
                className="px-5 py-2.5 bg-[#0c8fe9] hover:bg-[#0070c7] text-white font-bold text-xs rounded-xl shadow-subtle transition-all"
              >
                Upload Roster File
              </button>
              <button
                onClick={() => handleFileUpload('Odoo_HR_Sync_Aug2026.csv')}
                className="px-4 py-2.5 bg-white dark:bg-[#161E28] border border-slate-200 dark:border-white/[0.08] text-slate-700 dark:text-[#A7B0BC] hover:bg-slate-50 dark:hover:bg-[#1B2531] font-semibold text-xs rounded-xl transition-all shadow-2xs"
              >
                Load Sample Dataset
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600 dark:text-[#A7B0BC]">
            <div className="p-3.5 bg-slate-50 dark:bg-[#161E28] rounded-xl border border-slate-100 dark:border-white/[0.06] flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800 dark:text-[#E5E7EB]">Automatic Validation</p>
                <p className="text-[11px] text-slate-400 dark:text-[#707A87] mt-0.5">Schema mismatch & missing field protection</p>
              </div>
            </div>
            <div className="p-3.5 bg-slate-50 dark:bg-[#161E28] rounded-xl border border-slate-100 dark:border-white/[0.06] flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-[#0c8fe9] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800 dark:text-[#E5E7EB]">Intelligence Sync</p>
                <p className="text-[11px] text-slate-400 dark:text-[#707A87] mt-0.5">Automatically calculates skill redundancy</p>
              </div>
            </div>
            <div className="p-3.5 bg-slate-50 dark:bg-[#161E28] rounded-xl border border-slate-100 dark:border-white/[0.06] flex items-start gap-2.5">
              <Server className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800 dark:text-[#E5E7EB]">Audit Trail</p>
                <p className="text-[11px] text-slate-400 dark:text-[#707A87] mt-0.5">Immutable record of imported HR batches</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Validating animation */}
      {step === 'validating' && (
        <div className="bg-white dark:bg-[#121821] rounded-2xl border border-slate-200/80 dark:border-white/[0.07] p-12 shadow-card text-center space-y-4">
          <RefreshCw className="w-8 h-8 text-[#0c8fe9] animate-spin mx-auto" />
          <h3 className="text-sm font-bold text-slate-900 dark:text-[#E5E7EB]">Validating workforce records & schema...</h3>
          <p className="text-xs text-slate-400 dark:text-[#707A87] max-w-sm mx-auto">
            Checking employee IDs, department references, and statutory leave policy rules.
          </p>
        </div>
      )}

      {/* Step 3: Preview */}
      {step === 'preview' && (
        <div className="bg-white dark:bg-[#121821] rounded-2xl border border-slate-200/80 dark:border-white/[0.07] p-6 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-white/[0.06]">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-[#E5E7EB]">{selectedFile}</h3>
                <p className="text-[11px] text-slate-400 dark:text-[#707A87] font-mono">128 records parsed & verified</p>
              </div>
            </div>

            {/* Validation Badge Pill */}
            <div className="flex items-center gap-3 text-xs">
              <span className="font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-200 dark:border-emerald-500/20">
                125 Valid
              </span>
              <span className="font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-500/20">
                3 Warnings
              </span>
              <span className="font-bold text-slate-500 dark:text-[#707A87] bg-slate-100 dark:bg-white/[0.06] px-2.5 py-1 rounded-lg">
                0 Errors
              </span>
            </div>
          </div>

          {/* Sample Table */}
          <div className="border border-slate-200/80 dark:border-white/[0.07] rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-[#161E28] text-slate-500 dark:text-[#707A87] font-semibold border-b border-slate-100 dark:border-white/[0.06]">
                <tr>
                  <th className="p-3 pl-4">ID</th>
                  <th className="p-3">Employee Name</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Department</th>
                  <th className="p-3 pr-4 text-right">Validation Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-white/[0.04]">
                {mockParsedData.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50 dark:hover:bg-white/[0.03] transition-colors">
                    <td className="p-3 pl-4 font-mono text-slate-400 dark:text-[#707A87]">{row.id}</td>
                    <td className="p-3 font-semibold text-slate-900 dark:text-[#E5E7EB]">{row.name}</td>
                    <td className="p-3 text-slate-600 dark:text-[#A7B0BC]">{row.role}</td>
                    <td className="p-3 text-slate-600 dark:text-[#A7B0BC]">{row.dept}</td>
                    <td className="p-3 pr-4 text-right font-medium">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] ${row.status.includes('Valid')
                            ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400'
                            : 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400'
                          }`}
                      >
                        {row.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Commit Actions */}
          <div className="flex items-center justify-between pt-2">
            <button
              onClick={() => setStep('upload')}
              className="text-xs font-semibold text-slate-500 dark:text-[#707A87] hover:text-slate-900 dark:hover:text-[#E5E7EB] transition-colors"
            >
              Cancel & Upload Different File
            </button>
            <button
              onClick={handleStartSync}
              className="px-5 py-2.5 bg-[#0c8fe9] hover:bg-[#0070c7] active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow-subtle transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Import & Synchronize Intelligence Layer</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Syncing State */}
      {step === 'syncing' && (
        <div className="bg-white dark:bg-[#121821] rounded-2xl border border-slate-200/80 dark:border-white/[0.07] p-10 shadow-card space-y-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-[#0c8fe9] animate-spin" />
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-[#E5E7EB]">INTELLIGENCE REFRESH IN PROGRESS</h3>
              <p className="text-xs text-slate-400 dark:text-[#707A87]">Recomputing workforce graphs and capacity matrices...</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-50/70 dark:bg-emerald-500/10 p-2.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
              <span>✓ Workforce Capacity matrix refreshed (248 Active Nodes)</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-50/70 dark:bg-emerald-500/10 p-2.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
              <span>✓ Skill Redundancy indexed for 6 departments</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-700 dark:text-emerald-400 font-medium bg-emerald-50/70 dark:bg-emerald-500/10 p-2.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
              <span>✓ Attendance baseline patterns recalibrated</span>
            </div>
            <div className="flex items-center gap-2 text-[#0c8fe9] dark:text-[#36abf8] font-medium bg-[#0c8fe9]/8 dark:bg-[#0c8fe9]/10 p-2.5 rounded-xl animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Updating What-If Decision Simulation Engine...</span>
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Completed */}
      {step === 'complete' && (
        <div className="bg-white dark:bg-[#121821] rounded-2xl border border-emerald-200 dark:border-emerald-500/20 p-8 shadow-card space-y-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900 dark:text-[#E5E7EB]">
            Workforce Intelligence Synchronized Successfully
          </h3>
          <p className="text-xs text-slate-500 dark:text-[#707A87] max-w-md mx-auto">
            All 128 records have been written to the core database. Decision models, What-If simulator, and Workforce Radar telemetry are active with fresh data.
          </p>
          <div className="pt-3">
            <button
              onClick={() => setStep('upload')}
              className="px-5 py-2.5 bg-[#0c8fe9] hover:bg-[#0070c7] text-white font-bold text-xs rounded-xl shadow-subtle transition-all"
            >
              Import Additional Dataset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
