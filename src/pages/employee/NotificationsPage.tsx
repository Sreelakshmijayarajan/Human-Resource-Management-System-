import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Bell,
  CheckCheck,
  Megaphone,
  Calendar,
  Wallet,
  Clock,
  ArrowLeft,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { initialMyNotifications } from '../../data/mockMyNotifications';
import { EmployeeNotification } from '../../types/employeeNotification';
import { useAppContext } from '../../context/AppContext';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Toast, ToastMessage } from '../../components/ui/Toast';

type NotifTab = 'all' | 'leave' | 'announcements';

export const NotificationsPage: React.FC = () => {
  const navigate = useNavigate();
  const { markNotificationRead, markAllNotificationsRead } = useAppContext();
  const [notifications, setNotifications] = useState<EmployeeNotification[]>(initialMyNotifications);
  const [activeTab, setActiveTab] = useState<NotifTab>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const showToast = (type: 'success' | 'error' | 'info', title: string, message?: string) => {
    setToast({ id: `toast-${Date.now()}`, type, title, message: message || '' });
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  // Filtered notifications
  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      if (activeTab === 'leave' && n.type !== 'leave') return false;
      if (activeTab === 'announcements' && n.type !== 'announcement') return false;
      return true;
    });
  }, [notifications, activeTab]);

  const handleItemClick = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    markNotificationRead(id);
    setExpandedId(expandedId === id ? null : id);
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    markAllNotificationsRead();
    showToast('success', 'Notifications Cleared', 'All notification items marked as read.');
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'leave':
        return <Calendar className="w-4 h-4 text-amber-600" />;
      case 'payroll':
        return <Wallet className="w-4 h-4 text-emerald-600" />;
      case 'attendance':
        return <Clock className="w-4 h-4 text-teal-600" />;
      default:
        return <Megaphone className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in pb-12">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/employee/dashboard')}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
              Notifications & Alerts <Sparkles className="w-5 h-5 text-teal-500 fill-teal-500/20" />
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
              Leave approval updates, payroll voucher alerts, and HR announcements.
            </p>
          </div>
        </div>

        {unreadCount > 0 && (
          <button
            onClick={handleMarkAllRead}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-teal-50 text-teal-700 hover:bg-teal-100 text-xs font-semibold rounded-xl border border-teal-200/80 transition-colors self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4 text-teal-600" /> Mark all as read ({unreadCount})
          </button>
        )}
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 flex items-center gap-2 sm:gap-4 overflow-x-auto">
        {(['all', 'leave', 'announcements'] as NotifTab[]).map((tab) => {
          const isActive = activeTab === tab;
          const labels: Record<NotifTab, string> = {
            all: `All Notifications (${notifications.length})`,
            leave: 'Leave Updates',
            announcements: 'HR Announcements',
          };
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`py-3 px-3.5 text-xs sm:text-sm font-semibold transition-all border-b-2 whitespace-nowrap capitalize ${
                isActive
                  ? 'border-teal-600 text-teal-600 font-bold'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:border-slate-300'
              }`}
            >
              {labels[tab]}
            </button>
          );
        })}
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-2xl border border-slate-100/90 shadow-xs overflow-hidden divide-y divide-slate-100">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => handleItemClick(item.id)}
                className={`p-4 sm:p-5 transition-all cursor-pointer hover:bg-slate-50/80 ${
                  !item.read ? 'bg-teal-50/30' : ''
                }`}
              >
                <div className="flex items-start gap-3.5">
                  <div
                    className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center border shadow-2xs ${
                      !item.read ? 'bg-white border-teal-200' : 'bg-slate-50 border-slate-100'
                    }`}
                  >
                    {getIcon(item.type)}
                  </div>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className={`text-xs sm:text-sm font-bold ${!item.read ? 'text-slate-900' : 'text-slate-700'}`}>
                          {item.title}
                        </h4>
                        {item.leaveStatus && (
                          <StatusBadge status={item.leaveStatus} size="sm" />
                        )}
                      </div>
                      <span className="text-[11px] font-medium text-slate-400 shrink-0">{item.time}</span>
                    </div>

                    <p className={`text-xs leading-relaxed text-slate-600 ${!isExpanded ? 'line-clamp-2' : ''}`}>
                      {item.message}
                    </p>

                    {item.sender && (
                      <p className="text-[11px] text-slate-400 pt-0.5 font-medium">
                        From: <span className="text-slate-600 font-semibold">{item.sender}</span>
                      </p>
                    )}

                    {/* Expandable Action Link for Leave Updates */}
                    {item.type === 'leave' && item.leaveId && (
                      <div className="pt-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate('/employee/leave');
                          }}
                          className="inline-flex items-center gap-1 text-xs font-bold text-teal-700 hover:text-teal-900 transition-colors"
                        >
                          View Leave Application <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Read/Unread Dot Indicator */}
                  {!item.read && (
                    <div className="w-2.5 h-2.5 rounded-full bg-teal-500 shrink-0 self-center shadow-xs animate-pulse" />
                  )}
                </div>
              </div>
            );
          })
        ) : (
          /* Empty State */
          <div className="py-16 text-center text-slate-400 space-y-2">
            <Bell className="w-8 h-8 mx-auto text-slate-300" />
            <p className="text-sm font-bold text-slate-700">You're all caught up!</p>
            <p className="text-xs text-slate-400">No new notifications under this category.</p>
          </div>
        )}
      </div>

      {/* Toast Feedback */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
};
