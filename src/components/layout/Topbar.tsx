import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  Search,
  CheckCheck
} from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

interface TopbarProps {
  onToggleMobileSidebar?: () => void;
  isMobileSidebarOpen?: boolean;
}

export const Topbar: React.FC<TopbarProps> = ({
  onToggleMobileSidebar = () => {},
  isMobileSidebarOpen = false,
}) => {
  const { user, employeeData, logout, markAllNotificationsRead } = useAppContext();
  const navigate = useNavigate();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = employeeData.notifications.unread || 3;
  const username = user?.email?.split('@')[0] || 'umau35579';

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-30 bg-white border-b border-slate-100/90 h-16 px-5 md:px-8 flex items-center justify-between transition-all">
      {/* Left Title & Mobile Hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          aria-label={isMobileSidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="p-1.5 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg md:hidden focus:outline-none focus:ring-2 focus:ring-slate-300"
        >
          {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <h2 className="text-sm sm:text-base font-semibold text-slate-700">
          HR Admin Portal
        </h2>
      </div>

      {/* Right Controls: Search bar, Notification Bell, User Avatar */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Search bar */}
        <div className="relative hidden sm:block">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-48 lg:w-64 bg-slate-50/80 border border-slate-200/80 rounded-xl px-3.5 py-1.5 text-xs sm:text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500 transition-all"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsProfileOpen(false);
            }}
            aria-label="Notifications"
            className="relative p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-xl transition-colors focus:outline-none"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
            )}
          </button>

          {/* Notifications Dropdown Panel */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-card border border-slate-100 py-3 z-50 animate-slide-up">
              <div className="px-4 pb-2.5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="font-bold text-slate-900 text-xs">Notifications</h3>
                <button
                  onClick={markAllNotificationsRead}
                  className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
                >
                  <CheckCheck className="w-3 h-3" />
                  <span>Mark all read</span>
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto divide-y divide-slate-50">
                <div className="p-3 hover:bg-slate-50 transition-colors cursor-pointer">
                  <p className="text-xs font-semibold text-slate-800">3 Pending Leave Approvals</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">Rahul Verma requested 2 days casual leave.</p>
                </div>
                <div className="p-3 hover:bg-slate-50 transition-colors cursor-pointer">
                  <p className="text-xs font-semibold text-slate-800">Payroll Cycle Due</p>
                  <p className="text-[11px] text-slate-400 mt-0.5">August salary disbursements ready for review.</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Avatar with Name */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotificationsOpen(false);
            }}
            className="flex items-center gap-2 hover:opacity-90 focus:outline-none transition-opacity"
          >
            <div className="w-8 h-8 rounded-full bg-indigo-700 text-white font-bold text-xs flex items-center justify-center shadow-2xs">
              U
            </div>
            <span className="text-xs sm:text-sm font-semibold text-slate-800 hidden sm:inline">
              {username}
            </span>
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-card border border-slate-100 py-1.5 z-50 animate-slide-up">
              <div className="px-4 py-2 border-b border-slate-100">
                <p className="text-xs font-bold text-slate-900">{username}</p>
                <p className="text-[10px] text-slate-400">HR Administrator</p>
              </div>

              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  navigate('/hr/settings');
                }}
                className="w-full px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400" />
                <span>Admin Settings</span>
              </button>

              <div className="border-t border-slate-100 mt-1 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500" />
                  <span>Sign Out</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
