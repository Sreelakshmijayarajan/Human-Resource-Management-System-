import React from 'react';
import { Bell, User } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const Topbar: React.FC = () => {
  const { email } = useAuth();
  const userName = email ? email.split('@')[0] : 'Admin';

  return (
    <header className="flex items-center justify-between px-5 py-3 bg-white border-b border-gray-200 sticky top-0 z-10 shrink-0">
      {/* Page title / breadcrumb area */}
      <div className="text-sm text-gray-500 font-medium">HR Admin Portal</div>

      {/* Right controls */}
      <div className="flex items-center gap-3">
        {/* Search */}
        <div className="hidden md:block">
          <input
            type="text"
            placeholder="Search..."
            className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 w-52"
          />
        </div>

        {/* Notification bell */}
        <button
          aria-label="Notifications"
          className="relative p-2 rounded-full text-gray-500 hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <Bell className="h-5 w-5" />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
        </button>

        {/* Profile avatar */}
        <button
          aria-label="Profile"
          className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-gray-100 focus-visible:ring-2 focus-visible:ring-indigo-500"
        >
          <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold uppercase shrink-0">
            {userName.charAt(0)}
          </div>
          <span className="hidden sm:block text-sm font-medium text-gray-700">{userName}</span>
        </button>
      </div>
    </header>
  );
};
