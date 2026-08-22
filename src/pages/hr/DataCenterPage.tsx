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
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Workforce Data Center & Synchronization
          </h1>
          <span className="text-[10px] uppercase font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
            Enterprise Sync
          </span>
        </div>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Import HR rosters, timesheets, and statutory leave policies to synchronize Dayflow's workforce intelligence models.
        </p>
      </div>

      {/* Pipeline Stepper */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-card">
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
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 font-bold'
                    : isPassed
                      ? 'text-emerald-700 font-medium'
                      : 'text-slate-400'
                  }`}
              >
                {isPassed ? (
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                ) : (
                  <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center text-[10px] text-slate-500 shrink-0">
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
        <div className="bg-white rounded-2xl border border-slate-200/80 p-8 shadow-card space-y-6">
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
            className={`border-2 border-dashed rounded-2xl p-12 text-center transition-all ${dragOver ? 'border-indigo-500 bg-indigo-50/40' : 'border-slate-200 hover:border-slate-300 bg-slate-50/40'
              }`}
          >
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 mx-auto flex items-center justify-center mb-3">
              <Upload className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-bold text-slate-900">
              Drag and drop your workforce dataset here
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Supports CSV, XLSX, and Odoo HR export format (up to 50MB)
            </p>

            <div className="mt-5 flex items-center justify-center gap-3">
              <button
                onClick={() => handleFileUpload('August_Workforce_Roster_v3.csv')}
                className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-subtle transition-all"
              >
                Upload Roster File
              </button>
              <button
                onClick={() => handleFileUpload('Odoo_HR_Sync_Aug2026.csv')}
                className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs rounded-xl transition-all shadow-2xs"
              >
                Load Sample Dataset
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-600">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800">Automatic Validation</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Schema mismatch & missing field protection</p>
              </div>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
              <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800">Intelligence Sync</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Automatically calculates skill redundancy</p>
              </div>
            </div>
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 flex items-start gap-2.5">
              <Server className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-slate-800">Audit Trail</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Immutable record of imported HR batches</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Validating animation */}
      {step === 'validating' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-12 shadow-card text-center space-y-4">
          <RefreshCw className="w-8 h-8 text-indigo-600 animate-spin mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">Validating workforce records & schema...</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Checking employee IDs, department references, and statutory leave policy rules.
          </p>
        </div>
      )}

      {/* Step 3: Preview */}
      {step === 'preview' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-card space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <FileSpreadsheet className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">{selectedFile}</h3>
                <p className="text-[11px] text-slate-400 font-mono">128 records parsed & verified</p>
              </div>
            </div>

            {/* Validation Badge Pill */}
            <div className="flex items-center gap-3 text-xs">
              <span className="font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                125 Valid
              </span>
              <span className="font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200">
                3 Warnings
              </span>
              <span className="font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">
                0 Errors
              </span>
            </div>
          </div>

          {/* Sample Table */}
          <div className="border border-slate-200/80 rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-500 font-semibold border-b border-slate-100">
                <tr>
                  <th className="p-3 pl-4">ID</th>
                  <th className="p-3">Employee Name</th>
                  <th className="p-3">Role</th>
                  <th className="p-3">Department</th>
                  <th className="p-3 pr-4 text-right">Validation Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {mockParsedData.map((row) => (
                  <tr key={row.id} className="hover:bg-slate-50/50">
                    <td className="p-3 pl-4 font-mono text-slate-400">{row.id}</td>
                    <td className="p-3 font-semibold text-slate-900">{row.name}</td>
                    <td className="p-3 text-slate-600">{row.role}</td>
                    <td className="p-3 text-slate-600">{row.dept}</td>
                    <td className="p-3 pr-4 text-right font-medium">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] ${row.status.includes('Valid')
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'bg-amber-50 text-amber-700'
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
              className="text-xs font-semibold text-slate-500 hover:text-slate-900"
            >
              Cancel & Upload Different File
            </button>
            <button
              onClick={handleStartSync}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-[0.98] text-white font-bold text-xs rounded-xl shadow-subtle transition-all flex items-center gap-2"
            >
              <Sparkles className="w-4 h-4" />
              <span>Import & Synchronize Intelligence Layer</span>
            </button>
          </div>
        </div>
      )}

      {/* Step 4: Syncing State */}
      {step === 'syncing' && (
        <div className="bg-white rounded-2xl border border-slate-200/80 p-10 shadow-card space-y-6">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-indigo-600 animate-spin" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">INTELLIGENCE REFRESH IN PROGRESS</h3>
              <p className="text-xs text-slate-400">Recomputing workforce graphs and capacity matrices...</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="flex items-center gap-2 text-emerald-700 font-medium bg-emerald-50/70 p-2.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
              <span>✓ Workforce Capacity matrix refreshed (248 Active Nodes)</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-700 font-medium bg-emerald-50/70 p-2.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
              <span>✓ Skill Redundancy indexed for 6 departments</span>
            </div>
            <div className="flex items-center gap-2 text-emerald-700 font-medium bg-emerald-50/70 p-2.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
              <span>✓ Attendance baseline patterns recalibrated</span>
            </div>
            <div className="flex items-center gap-2 text-indigo-700 font-medium bg-indigo-50/70 p-2.5 rounded-xl animate-pulse">
              <RefreshCw className="w-4 h-4 animate-spin" />
              <span>Updating What-If Decision Simulation Engine...</span>
            </div>
          </div>
        </div>
      )}

      {/* Step 5: Completed */}
      {step === 'complete' && (
        <div className="bg-white rounded-2xl border border-emerald-200 p-8 shadow-card space-y-4 text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Workforce Intelligence Synchronized Successfully
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            All 128 records have been written to the core database. Decision models, What-If simulator, and Workforce Radar telemetry are active with fresh data.
          </p>
          <div className="pt-3">
            <button
              onClick={() => setStep('upload')}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-subtle transition-all"
            >
              Import Additional Dataset
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
