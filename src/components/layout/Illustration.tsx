import React from 'react';

export const Illustration: React.FC = () => {
  return (
    <div className="relative w-full max-w-[520px] mx-auto select-none py-2">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-100/60 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Floating Card: Calendar Widget (Left) */}
      <div className="absolute top-14 -left-3 md:-left-6 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-card border border-blue-50/80 flex items-center justify-center animate-pulse-subtle z-10">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 16l2 2 4-4" />
          </svg>
        </div>
      </div>

      {/* Floating Card: Team Avatars Widget (Right) */}
      <div className="absolute top-4 -right-2 md:-right-4 bg-white/95 backdrop-blur-md rounded-2xl p-3 shadow-card border border-blue-50/80 flex items-center justify-center animate-pulse-subtle z-10">
        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
      </div>

      {/* Main Vector SVG Illustration */}
      <svg
        viewBox="0 0 540 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto drop-shadow-sm"
      >
        <defs>
          <linearGradient id="screenGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="100%" stopColor="#f8fafc" />
          </linearGradient>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
          </linearGradient>
          <linearGradient id="screenBezel" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#334155" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>
        </defs>

        {/* Decorative Grid Dots */}
        <g opacity="0.25">
          <circle cx="450" cy="240" r="2" fill="#3b82f6" />
          <circle cx="465" cy="240" r="2" fill="#3b82f6" />
          <circle cx="480" cy="240" r="2" fill="#3b82f6" />
          <circle cx="450" cy="255" r="2" fill="#3b82f6" />
          <circle cx="465" cy="255" r="2" fill="#3b82f6" />
          <circle cx="480" cy="255" r="2" fill="#3b82f6" />
          <circle cx="450" cy="270" r="2" fill="#3b82f6" />
          <circle cx="465" cy="270" r="2" fill="#3b82f6" />
          <circle cx="480" cy="270" r="2" fill="#3b82f6" />
        </g>

        {/* --- MONITOR / DISPLAY --- */}
        {/* Monitor Base & Stand */}
        <path d="M225 285 L255 285 L260 305 L220 305 Z" fill="#475569" />
        <rect x="200" y="303" width="80" height="7" rx="3.5" fill="#334155" />
        
        {/* Monitor Bezel */}
        <rect x="110" y="70" width="260" height="175" rx="14" fill="url(#screenBezel)" />
        {/* Monitor Screen Glass */}
        <rect x="116" y="76" width="248" height="155" rx="8" fill="url(#screenGradient)" />

        {/* Screen Content: Top 3 Metric Cards */}
        {/* Metric 1: Total Employees */}
        <rect x="126" y="86" width="72" height="34" rx="6" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <circle cx="138" cy="98" r="6" fill="#3b82f6" />
        <path d="M135 101 C135 99, 141 99, 141 101" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
        <text x="148" y="94" fontSize="5" fontWeight="500" fill="#64748b">Total Employees</text>
        <text x="148" y="105" fontSize="8" fontWeight="700" fill="#0f172a">256</text>

        {/* Metric 2: Present Today */}
        <rect x="204" y="86" width="72" height="34" rx="6" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <circle cx="216" cy="98" r="6" fill="#10b981" />
        <path d="M213 98 L215 100 L219 96" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" />
        <text x="226" y="94" fontSize="5" fontWeight="500" fill="#64748b">Present Today</text>
        <text x="226" y="105" fontSize="8" fontWeight="700" fill="#0f172a">198</text>

        {/* Metric 3: On Leave */}
        <rect x="282" y="86" width="72" height="34" rx="6" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <circle cx="294" cy="98" r="6" fill="#f59e0b" />
        <path d="M291 98 H297" stroke="#ffffff" strokeWidth="1" strokeLinecap="round" />
        <text x="304" y="94" fontSize="5" fontWeight="500" fill="#64748b">On Leave</text>
        <text x="304" y="105" fontSize="8" fontWeight="700" fill="#0f172a">18</text>

        {/* Screen Content: Attendance Overview Area Chart */}
        <rect x="126" y="126" width="138" height="95" rx="6" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="134" y="138" fontSize="6" fontWeight="600" fill="#334155">Attendance Overview</text>
        
        {/* Chart axes & dotted grid lines */}
        <line x1="134" y1="160" x2="256" y2="160" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="134" y1="185" x2="256" y2="185" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="2 2" />
        <line x1="134" y1="205" x2="256" y2="205" stroke="#e2e8f0" strokeWidth="1" />

        {/* Area fill and wave stroke */}
        <path
          d="M134 195 Q150 170 170 180 T210 165 T240 175 T256 160 L256 205 L134 205 Z"
          fill="url(#chartFill)"
        />
        <path
          d="M134 195 Q150 170 170 180 T210 165 T240 175 T256 160"
          stroke="#2563eb"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="210" cy="165" r="3" fill="#2563eb" stroke="#ffffff" strokeWidth="1" />

        {/* Screen Content: Department Donut Chart */}
        <rect x="270" y="126" width="84" height="95" rx="6" fill="#ffffff" stroke="#e2e8f0" strokeWidth="1" />
        <text x="276" y="138" fontSize="6" fontWeight="600" fill="#334155">Department</text>
        
        {/* Donut graphic */}
        <circle cx="312" cy="175" r="20" stroke="#e2e8f0" strokeWidth="8" fill="none" />
        <circle
          cx="312"
          cy="175"
          r="20"
          stroke="#2563eb"
          strokeWidth="8"
          fill="none"
          strokeDasharray="90 120"
          strokeDashoffset="15"
          strokeLinecap="round"
        />
        <circle
          cx="312"
          cy="175"
          r="20"
          stroke="#38bdf8"
          strokeWidth="8"
          fill="none"
          strokeDasharray="25 120"
          strokeDashoffset="-75"
          strokeLinecap="round"
        />

        {/* --- TEAM PEOPLE ILLUSTRATIONS --- */}

        {/* Person Left: Woman sitting on white stool with Laptop */}
        <g id="person-left">
          {/* Stool */}
          <ellipse cx="106" cy="275" rx="15" ry="4" fill="#e2e8f0" />
          <line x1="97" y1="275" x2="92" y2="305" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
          <line x1="115" y1="275" x2="120" y2="305" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
          
          {/* Legs & Pants */}
          <path d="M100 255 L96 280 L120 280 L118 302 L128 302 L124 275 L112 255 Z" fill="#1e293b" />
          <path d="M125 302 L136 302 C138 302 138 305 136 305 L120 305 Z" fill="#0f172a" />
          
          {/* Torso & Blue Shirt */}
          <rect x="94" y="222" width="22" height="34" rx="7" fill="#2563eb" />
          
          {/* Laptop on lap */}
          <path d="M110 250 L128 250 L135 235 L120 235 Z" fill="#0f172a" />
          <line x1="108" y1="250" x2="132" y2="250" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />

          {/* Arms & Skin */}
          <path d="M102 232 L115 244 L122 240" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" />
          <circle cx="122" cy="240" r="2.5" fill="#fbcfe8" />

          {/* Head & Hair */}
          <circle cx="105" cy="210" r="8" fill="#fed7aa" />
          {/* Black hair */}
          <path d="M96 210 C96 198 114 198 114 210 C114 216 112 225 106 226 C100 225 96 222 96 210 Z" fill="#0f172a" />
          <path d="M95 210 Q98 226 94 235" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* Person Middle: Man sitting cross-legged working on laptop */}
        <g id="person-middle">
          {/* Cross legs */}
          <path d="M228 290 Q240 300 255 300 Q270 300 282 290 Q255 310 228 290 Z" fill="#1e293b" />
          <ellipse cx="232" cy="296" rx="6" ry="4" fill="#0f172a" />
          <ellipse cx="278" cy="296" rx="6" ry="4" fill="#0f172a" />

          {/* Torso & Blue Shirt */}
          <rect x="244" y="244" width="22" height="34" rx="7" fill="#2563eb" />

          {/* Laptop */}
          <polygon points="245,268 265,268 263,254 247,254" fill="#cbd5e1" />
          <rect x="241" y="268" width="28" height="3" rx="1.5" fill="#64748b" />

          {/* Head & Hair */}
          <circle cx="255" cy="232" r="8" fill="#fed7aa" />
          <path d="M247 232 C247 222 263 222 263 232 C263 226 250 224 247 232 Z" fill="#0f172a" />
        </g>

        {/* Person Right: Man standing and pointing to the dashboard screen */}
        <g id="person-right">
          {/* Standing Legs & Pants */}
          <path d="M370 230 L370 298 L378 298 L378 245 L386 245 L386 298 L394 298 L394 230 Z" fill="#1e293b" />
          <path d="M366 298 L379 298 C381 298 381 303 378 303 L366 303 Z" fill="#0f172a" />
          <path d="M386 298 L398 298 C400 298 400 303 397 303 L386 303 Z" fill="#0f172a" />

          {/* Torso & Royal Blue Shirt */}
          <rect x="368" y="196" width="24" height="38" rx="8" fill="#2563eb" />

          {/* Pointing Arm towards screen */}
          <path d="M374 206 L348 190 L335 195" stroke="#2563eb" strokeWidth="4" strokeLinecap="round" />
          <circle cx="335" cy="195" r="2.5" fill="#fed7aa" />

          {/* Head & Hair */}
          <circle cx="380" cy="182" r="8.5" fill="#fed7aa" />
          <path d="M372 182 C372 172 388 172 388 182 C388 175 376 174 372 182 Z" fill="#0f172a" />
        </g>

        {/* Potted Plant on bottom left */}
        <g id="plant-left">
          {/* Pot */}
          <path d="M48 290 L60 290 L57 305 L51 305 Z" fill="#cbd5e1" />
          {/* Leaves */}
          <path d="M54 290 Q40 270 42 250 Q56 265 54 290 Z" fill="#10b981" />
          <path d="M54 290 Q68 270 66 250 Q52 265 54 290 Z" fill="#059669" />
          <path d="M54 290 Q54 260 50 240 Q58 260 54 290 Z" fill="#34d399" />
        </g>
      </svg>
    </div>
  );
};
