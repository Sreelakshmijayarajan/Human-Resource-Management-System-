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
import { ThemeToggle } from '../ui/ThemeToggle';

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

  const isEmployee = user?.role === 'employee';
  const unreadCount = employeeData.notifications?.unread ?? 0;
  const username = user?.firstName || 'User';
  const userInitials = user?.avatarInitials || username.slice(0, 2).toUpperCase();

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
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#0E131A]/97 backdrop-blur-md border-b border-slate-100/90 dark:border-white/[0.06] h-16 px-5 md:px-8 flex items-center justify-between transition-colors duration-200">
      {/* Left Title & Mobile Hamburger */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          aria-label={isMobileSidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="p-1.5 text-slate-600 dark:text-[#707A87] hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-[#1B2531] rounded-lg md:hidden focus:outline-none"
        >
          {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <h2 className="text-sm sm:text-base font-semibold text-slate-700 dark:text-[#A7B0BC]">
          {isEmployee ? 'Dayflow Employee Workspace' : 'HR Admin Portal'}
        </h2>
      </div>

      {/* Right Controls: Search bar, Theme Toggle, Notification Bell, User Avatar */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Search bar */}
        <div className="relative hidden sm:block">
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-44 lg:w-56 bg-slate-50/80 dark:bg-[#161E28] border border-slate-200/80 dark:border-white/[0.08] rounded-xl px-3.5 py-1.5 pl-3.5 pr-9 text-xs sm:text-sm text-slate-800 dark:text-[#E5E7EB] placeholder-slate-400 dark:placeholder-[#707A87] focus:outline-none focus:ring-2 focus:ring-[#0c8fe9]/25 focus:border-[#0c8fe9]/40 dark:focus:ring-[#0c8fe9]/25 transition-all"
          />
          <Search className="w-3.5 h-3.5 text-slate-400 dark:text-[#707A87] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
        </div>

        {/* Dark / Light Mode Toggle */}
        <ThemeToggle />

        {/* Notification Bell */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              if (isEmployee) {
                navigate('/employee/notifications');
              } else {
                setIsNotificationsOpen(!isNotificationsOpen);
                setIsProfileOpen(false);
              }
            }}
            aria-label="Notifications"
            className="relative p-2 text-slate-500 dark:text-[#707A87] hover:text-slate-700 dark:hover:text-[#E5E7EB] hover:bg-slate-50 dark:hover:bg-[#1B2531] rounded-xl transition-colors focus:outline-none"
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#0E131A]" />
            )}
          </button>

          {/* Notifications Dropdown Panel (for HR) */}
          {!isEmployee && isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#161E28] rounded-2xl shadow-card border border-slate-100 dark:border-white/[0.08] py-3 z-50 animate-slide-up">
              <div className="px-4 pb-2.5 border-b border-slate-100 dark:border-white/[0.06] flex items-center justify-between">
                <h3 className="font-bold text-slate-900 dark:text-[#E5E7EB] text-xs">Notifications</h3>
                <button
                  onClick={markAllNotificationsRead}
                  className="text-[11px] font-semibold text-[#0c8fe9] dark:text-[#36abf8] hover:text-[#0070c7] flex items-center gap-1"
                >
                  <CheckCheck className="w-3 h-3" />
                  <span>Mark all read</span>
                </button>
              </div>

              <div className="max-h-64 overflow-y-auto">
                <div className="p-3 hover:bg-slate-50 dark:hover:bg-[#1B2531] transition-colors cursor-pointer border-b border-slate-50 dark:border-white/[0.04]">
                  <p className="text-xs font-semibold text-slate-800 dark:text-[#E5E7EB]">3 Pending Leave Approvals</p>
                  <p className="text-[11px] text-slate-400 dark:text-[#707A87] mt-0.5">Rahul Verma requested 2 days casual leave.</p>
                </div>
                <div className="p-3 hover:bg-slate-50 dark:hover:bg-[#1B2531] transition-colors cursor-pointer">
                  <p className="text-xs font-semibold text-slate-800 dark:text-[#E5E7EB]">Payroll Cycle Due</p>
                  <p className="text-[11px] text-slate-400 dark:text-[#707A87] mt-0.5">August salary disbursements ready for review.</p>
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
            <div className={`w-8 h-8 rounded-full ${isEmployee ? 'bg-teal-600' : 'bg-[#0070c7]'} text-white font-bold text-xs flex items-center justify-center shadow-sm`}>
              {userInitials}
            </div>
            <span className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-[#E5E7EB] hidden sm:inline">
              {username}
            </span>
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-[#161E28] rounded-2xl shadow-card border border-slate-100 dark:border-white/[0.08] py-1.5 z-50 animate-slide-up">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-white/[0.06]">
                <p className="text-xs font-bold text-slate-900 dark:text-[#E5E7EB]">{username}</p>
                <p className="text-[10px] text-slate-400 dark:text-[#707A87]">
                  {isEmployee ? 'Software Engineer' : 'HR Administrator'}
                </p>
              </div>

              <button
                onClick={() => {
                  setIsProfileOpen(false);
                  navigate(isEmployee ? '/employee/profile' : '/hr/settings');
                }}
                className="w-full px-4 py-2 text-xs font-medium text-slate-700 dark:text-[#A7B0BC] hover:bg-slate-50 dark:hover:bg-[#1B2531] flex items-center gap-2 transition-colors"
              >
                <Settings className="w-3.5 h-3.5 text-slate-400 dark:text-[#707A87]" />
                <span>{isEmployee ? 'My Profile' : 'Admin Settings'}</span>
              </button>

              <div className="border-t border-slate-100 dark:border-white/[0.06] mt-1 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-xs font-semibold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-500 dark:text-rose-400" />
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
