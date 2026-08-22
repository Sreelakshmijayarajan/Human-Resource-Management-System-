import React from 'react';
import { Illustration } from './Illustration';

export const BrandingPanel: React.FC = () => {
  return (
    <div className="flex flex-col justify-between h-full max-w-xl mx-auto px-6 py-8 md:py-10">
      {/* Brand Header */}
      <div className="space-y-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <svg
              className="w-6 h-6"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M4 4h7a7 7 0 0 1 7 7 7 7 0 0 1-7 7H4z" />
              <path d="M4 12h5" />
            </svg>
          </div>
          <span className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            Dayflow
          </span>
        </div>

        {/* Tagline & Description */}
        <div className="space-y-3">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Simplifying Work.{' '}
            <span className="text-blue-600 dark:text-blue-400 block sm:inline">
              Empowering People.
            </span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm md:text-base leading-relaxed max-w-md">
            A smart HR management platform for managing employees, attendance, leaves, payroll and workplace operations in one place.
          </p>
        </div>
      </div>

      {/* Center Illustration */}
      <div className="my-auto py-6">
        <Illustration />
      </div>

      {/* Left Footer */}
      <div className="text-xs text-slate-400 font-medium">
        © 2026 Dayflow. All rights reserved.
      </div>
    </div>
  );
};
