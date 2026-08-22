import React from 'react';
import { WhatIfSimulator } from '../../components/intelligence/WhatIfSimulator';

export const SimulatorPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pb-8">
      <div className="pb-2 border-b border-slate-200/80">
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
          What-If Workforce Decision Simulator
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
          Model sprint capacity, operational risk, and skill redundancy before committing HR decisions.
        </p>
      </div>

      <WhatIfSimulator />
    </div>
  );
};
