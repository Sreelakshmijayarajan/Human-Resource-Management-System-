import React from 'react';
import { Mail, AlertTriangle, Loader2, CheckCircle, RotateCcw, ShieldAlert } from 'lucide-react';
import { AuthStatus } from '../../types/auth';

export interface StateToolbarProps {
  currentStatus: AuthStatus;
  onSelectState: (state: 'idle' | 'empty' | 'invalid_email' | 'wrong_password' | 'loading' | 'success') => void;
}

export const StateToolbar: React.FC<StateToolbarProps> = ({
  onSelectState,
}) => {
  return (
    <div className="w-full bg-white/90 backdrop-blur-md border-t border-slate-200/80 px-4 py-3 shadow-lg transition-all z-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          <span>Interactive State Tester:</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2.5">
          {/* Default / Reset */}
          <button
            type="button"
            onClick={() => onSelectState('idle')}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 text-xs font-medium text-slate-700 transition-colors shadow-2xs"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            <span>Reset</span>
          </button>

          {/* Empty Fields */}
          <button
            type="button"
            onClick={() => onSelectState('empty')}
            className="flex flex-col items-start px-3 py-1.5 rounded-xl border border-red-200 bg-white hover:bg-red-50/50 text-left transition-all shadow-2xs group"
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 group-hover:text-red-700">
              <Mail className="w-3 h-3 text-red-500" />
              <span>Empty Fields</span>
            </div>
            <div className="text-[10px] text-red-600 leading-tight">
              Email & Password required
            </div>
          </button>

          {/* Invalid Email */}
          <button
            type="button"
            onClick={() => onSelectState('invalid_email')}
            className="flex flex-col items-start px-3 py-1.5 rounded-xl border border-amber-200 bg-white hover:bg-amber-50/50 text-left transition-all shadow-2xs group"
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 group-hover:text-amber-700">
              <ShieldAlert className="w-3 h-3 text-amber-500" />
              <span>Invalid Email</span>
            </div>
            <div className="text-[10px] text-amber-600 leading-tight">
              Please enter a valid work email
            </div>
          </button>

          {/* Incorrect Password */}
          <button
            type="button"
            onClick={() => onSelectState('wrong_password')}
            className="flex flex-col items-start px-3 py-1.5 rounded-xl border border-rose-200 bg-white hover:bg-rose-50/50 text-left transition-all shadow-2xs group"
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 group-hover:text-rose-700">
              <AlertTriangle className="w-3 h-3 text-rose-500" />
              <span>Incorrect Password</span>
            </div>
            <div className="text-[10px] text-rose-600 leading-tight">
              Incorrect password. Please try again.
            </div>
          </button>

          {/* Loading State */}
          <button
            type="button"
            onClick={() => onSelectState('loading')}
            className="flex flex-col items-start px-3 py-1.5 rounded-xl border border-blue-200 bg-white hover:bg-blue-50/50 text-left transition-all shadow-2xs group"
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 group-hover:text-blue-700">
              <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />
              <span>Loading State</span>
            </div>
            <div className="text-[10px] text-blue-600 leading-tight">
              Signing in...
            </div>
          </button>

          {/* Success State */}
          <button
            type="button"
            onClick={() => onSelectState('success')}
            className="flex flex-col items-start px-3 py-1.5 rounded-xl border border-emerald-200 bg-white hover:bg-emerald-50/50 text-left transition-all shadow-2xs group"
          >
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-800 group-hover:text-emerald-700">
              <CheckCircle className="w-3 h-3 text-emerald-500" />
              <span>Success State</span>
            </div>
            <div className="text-[10px] text-emerald-600 leading-tight">
              Login successful! Redirecting...
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
