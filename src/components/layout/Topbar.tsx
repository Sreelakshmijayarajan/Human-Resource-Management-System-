import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  CheckCheck, 
  Calendar, 
  Wallet, 
  Clock, 
  Megaphone,
  ChevronDown
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
  const { user, employeeData, logout, markNotificationRead, markAllNotificationsRead } = useAppContext();
  const navigate = useNavigate();

  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const notifRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);

  const unreadCount = employeeData.notifications.unread;

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

  const getNotifIcon = (type: string) => {
    switch (type) {
      case 'leave':
        return <Calendar className="w-4 h-4 text-amber-500" />;
      case 'payroll':
        return <Wallet className="w-4 h-4 text-emerald-500" />;
      case 'attendance':
        return <Clock className="w-4 h-4 text-teal-500" />;
      default:
        return <Megaphone className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 h-16 px-4 md:px-6 flex items-center justify-between transition-all">
      {/* Left: Mobile hamburger & Logo/Brand for mobile */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          aria-label={isMobileSidebarOpen ? 'Close navigation menu' : 'Open navigation menu'}
          className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl md:hidden focus:outline-none focus:ring-2 focus:ring-slate-300 transition-colors"
        >
          {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        <div className="flex items-center gap-2.5 md:hidden">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-sm">
            D
          </div>
          <span className="font-bold text-slate-900 text-base tracking-tight">Dayflow</span>
        </div>
      </div>

      {/* Right: Notifications & Profile Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3 ml-auto">
        {/* Notification Bell Dropdown */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setIsNotificationsOpen(!isNotificationsOpen);
              setIsProfileOpen(false);
            }}
            aria-label={`Notifications (${unreadCount} unread)`}
            className={`relative p-2.5 rounded-xl transition-all focus:outline-none focus:ring-2 focus:ring-teal-500/40 ${
              isNotificationsOpen ? 'bg-slate-100 text-slate-900' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
            }`}
          >
            <Bell className="w-5 h-5" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-teal-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white animate-pulse-subtle">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Panel */}
          {isNotificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-card border border-slate-100 py-3 z-50 animate-slide-up">
              <div className="px-4 pb-3 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 text-sm">Notifications</h3>
                  {unreadCount > 0 && (
                    <span className="px-2 py-0.5 text-[11px] font-semibold bg-teal-50 text-teal-700 rounded-full border border-teal-100">
                      {unreadCount} new
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs font-semibold text-teal-600 hover:text-teal-700 flex items-center gap-1 focus:outline-none"
                  >
                    <CheckCheck className="w-3.5 h-3.5" />
                    <span>Mark all read</span>
                  </button>
                )}
              </div>

              <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                {employeeData.notifications.items.length === 0 ? (
                  <div className="py-8 text-center px-4 space-y-2">
                    <div className="w-10 h-10 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                      <Bell className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700">No new notifications</p>
                    <p className="text-xs text-slate-400">You're completely up to date!</p>
                  </div>
                ) : (
                  employeeData.notifications.items.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => markNotificationRead(item.id)}
                      className={`p-3.5 transition-colors cursor-pointer flex gap-3 hover:bg-slate-50/80 ${
                        !item.read ? 'bg-teal-50/30' : ''
                      }`}
                    >
                      <div className="w-8 h-8 rounded-xl bg-slate-100 shrink-0 flex items-center justify-center">
                        {getNotifIcon(item.type)}
                      </div>
                      <div className="flex-1 min-w-0 space-y-0.5">
                        <div className="flex items-center justify-between gap-2">
                          <p className={`text-xs font-semibold truncate ${!item.read ? 'text-slate-900' : 'text-slate-700'}`}>
                            {item.title}
                          </p>
                          <span className="text-[10px] text-slate-400 shrink-0">{item.time}</span>
                        </div>
                        <p className="text-xs text-slate-500 line-clamp-2">{item.message}</p>
                      </div>
                      {!item.read && (
                        <div className="w-2 h-2 rounded-full bg-teal-500 self-center shrink-0" />
                      )}
                    </div>
                  ))
                )}
              </div>

              <div className="pt-2 px-4 border-t border-slate-100 text-center">
                <button
                  onClick={() => {
                    setIsNotificationsOpen(false);
                    navigate('/employee/notifications');
                  }}
                  className="text-xs font-semibold text-teal-600 hover:text-teal-700 focus:outline-none"
                >
                  View all notifications →
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative" ref={profileRef}>
          <button
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotificationsOpen(false);
            }}
            className="flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 transition-colors border border-transparent hover:border-slate-200"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-teal-500 to-emerald-600 text-white font-bold text-xs flex items-center justify-center shadow-sm shrink-0">
              {user?.avatarInitials || employeeData.avatarInitials}
            </div>
            <div className="hidden sm:block text-left">
              <div className="text-xs font-bold text-slate-900 leading-tight">
                {user?.name || employeeData.name}
              </div>
              <div className="text-[11px] text-slate-500 font-medium capitalize">
                {user?.role === 'hr_admin' ? 'HR Administrator' : 'Employee Self-Service'}
              </div>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
          </button>

          {/* Profile Menu */}
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-card border border-slate-100 py-2 z-50 animate-slide-up">
              <div className="px-4 py-2 border-b border-slate-100 sm:hidden">
                <p className="text-xs font-bold text-slate-900">{user?.name || employeeData.name}</p>
                <p className="text-[11px] text-slate-500">{user?.email || employeeData.email}</p>
              </div>

              <div className="py-1">
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate('/employee/profile');
                  }}
                  className="w-full px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2.5 transition-colors"
                >
                  <User className="w-4 h-4 text-slate-400" />
                  <span>My Profile</span>
                </button>
                <button
                  onClick={() => {
                    setIsProfileOpen(false);
                    navigate('/employee/profile');
                  }}
                  className="w-full px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 flex items-center gap-2.5 transition-colors"
                >
                  <Settings className="w-4 h-4 text-slate-400" />
                  <span>Account Settings</span>
                </button>
              </div>

              <div className="border-t border-slate-100 pt-1">
                <button
                  onClick={handleLogout}
                  className="w-full px-4 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 transition-colors"
                >
                  <LogOut className="w-4 h-4 text-rose-500" />
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
