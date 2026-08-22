import React from 'react';
import { BrandingPanel } from './BrandingPanel';

export interface AuthLayoutProps {
  children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <main className="min-h-screen w-full flex flex-col justify-between bg-[#f8fafd] selection:bg-blue-500 selection:text-white">
      {/* Split screen content container */}
      <div className="flex-1 flex items-stretch">
        <div className="w-full max-w-[1440px] mx-auto grid grid-cols-1 lg:grid-cols-12 min-h-[calc(100vh-60px)]">
          {/* Left Branding Column (Hidden on mobile / small screens, visible on lg+) */}
          <section
            aria-label="Product Information"
            className="hidden lg:flex lg:col-span-6 xl:col-span-7 items-center justify-center p-6 xl:p-12 border-r border-slate-200/50 bg-gradient-to-br from-blue-50/30 via-white to-slate-50/50"
          >
            <BrandingPanel />
          </section>

          {/* Right Login Column (Centered card) */}
          <section
            aria-label="User Authentication"
            className="col-span-1 lg:col-span-6 xl:col-span-5 flex flex-col justify-center items-center p-4 sm:p-8 md:p-12 relative"
          >
            {/* Mobile Header (Only visible on small screens when left panel is hidden) */}
            <div className="lg:hidden flex items-center gap-2.5 mb-6">
              <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <svg
                  className="w-5 h-5"
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
              <span className="text-xl font-bold tracking-tight text-slate-900">
                Dayflow
              </span>
            </div>

            {/* Login Card */}
            {children}

            {/* Mobile Footer */}
            <div className="lg:hidden text-center text-xs text-slate-400 mt-6 font-medium">
              © 2026 Dayflow. All rights reserved.
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};
