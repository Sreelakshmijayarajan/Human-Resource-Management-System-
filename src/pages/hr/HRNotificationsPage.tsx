import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  Megaphone, 
  Calendar, 
  Clock, 
  FileWarning, 
  DollarSign, 
  CheckCheck, 
  Filter, 
  Search, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Inbox
} from 'lucide-react';
import { NotificationItem, AlertType } from '../../types/notifications';
import { initialMockNotifications } from '../../data/mockNotifications';
import { SendAnnouncementModal } from '../../components/notifications/SendAnnouncementModal';
import { useToast } from '../../context/ToastContext';
import { useAppContext } from '../../context/AppContext';

export const HRNotificationsPage: React.FC = () => {
  const { markAllNotificationsRead } = useAppContext();
  const { showToast } = useToast();

  const [notifications, setNotifications] = useState<NotificationItem[]>(initialMockNotifications);
  const [activeTab, setActiveTab] = useState<'all' | 'alert' | 'announcement'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isSendModalOpen, setIsSendModalOpen] = useState(false);
  const [unreadOnly, setUnreadOnly] = useState(false);

  const unreadCount = notifications.filter((n) => !n.read).length;
  const alertsCount = notifications.filter((n) => n.category === 'alert' && !n.read).length;
  const announcementsCount = notifications.filter((n) => n.category === 'announcement' && !n.read).length;

  const handleToggleRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleMarkAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    markAllNotificationsRead();
    showToast('All notifications marked as read', 'success');
  };

  const handleSendAnnouncement = (newAnnouncement: NotificationItem) => {
    setNotifications((prev) => [newAnnouncement, ...prev]);
    showToast(`Announcement broadcasted to ${newAnnouncement.audience?.targetName || 'team'}`, 'success');
  };

  const filteredNotifications = notifications.filter((item) => {
    if (activeTab !== 'all' && item.category !== activeTab) return false;
    if (unreadOnly && item.read) return false;
    if (typeFilter !== 'all' && item.type !== typeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = item.title.toLowerCase().includes(q);
      const matchMsg = item.message.toLowerCase().includes(q);
      const matchAuthor = item.author?.name.toLowerCase().includes(q);
      if (!matchTitle && !matchMsg && !matchAuthor) return false;
    }
    return true;
  });

  const getAlertIcon = (type: AlertType) => {
    switch (type) {
      case 'leave_request':
        return <Calendar className="w-5 h-5 text-amber-600 dark:text-amber-400" />;
      case 'attendance_anomaly':
        return <Clock className="w-5 h-5 text-rose-600 dark:text-rose-400" />;
      case 'document_expiring':
        return <FileWarning className="w-5 h-5 text-purple-600 dark:text-purple-400" />;
      case 'payroll_due':
        return <DollarSign className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />;
      case 'system':
      default:
        return <Megaphone className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />;
    }
  };

  const getAlertBg = (type: AlertType) => {
    switch (type) {
      case 'leave_request':
        return 'bg-amber-50 dark:bg-amber-950/40 border-amber-100 dark:border-amber-900/60';
      case 'attendance_anomaly':
        return 'bg-rose-50 dark:bg-rose-950/40 border-rose-100 dark:border-rose-900/60';
      case 'document_expiring':
        return 'bg-purple-50 dark:bg-purple-950/40 border-purple-100 dark:border-purple-900/60';
      case 'payroll_due':
        return 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-100 dark:border-emerald-900/60';
      case 'system':
      default:
        return 'bg-indigo-50 dark:bg-indigo-950/40 border-indigo-100 dark:border-indigo-900/60';
    }
  };

  return (
    <div className="space-y-6 animate-fade-in max-w-6xl mx-auto pb-10">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/hr/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to HR Dashboard</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Notifications & Alerts Center
            </h1>
            {unreadCount > 0 && (
              <span className="px-2.5 py-0.5 rounded-full bg-red-500 text-white text-xs font-bold">
                {unreadCount} Unread
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Real-time system alerts, leave requests, timesheet anomalies, and company announcements.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 text-xs font-semibold text-slate-700 dark:text-slate-300 transition-colors"
            >
              <CheckCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Mark all read</span>
            </button>
          )}

          <button
            onClick={() => setIsSendModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-md shadow-indigo-500/20 transition-all active:scale-[0.98]"
          >
            <Megaphone className="w-4 h-4" />
            <span>Send Announcement</span>
          </button>
        </div>
      </div>

      {/* Tabs & Filter Bar */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-5 border border-slate-100 dark:border-slate-800 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {[
              { key: 'all', label: 'All Notifications', count: notifications.length },
              { key: 'alert', label: 'System Alerts', count: alertsCount },
              { key: 'announcement', label: 'HR Announcements', count: announcementsCount },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as any)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all whitespace-nowrap ${
                  activeTab === tab.key
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <span>{tab.label}</span>
                {tab.count > 0 && (
                  <span className={`px-1.5 py-0.5 rounded-full text-[11px] font-bold ${
                    activeTab === tab.key ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}
          </div>

          <label className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={unreadOnly}
              onChange={(e) => setUnreadOnly(e.target.checked)}
              className="rounded border-slate-300 dark:border-slate-700 text-indigo-600"
            />
            <span>Show unread only</span>
          </label>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search notifications by keyword, employee name, or event..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-700 bg-slate-50/70 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all"
            />
          </div>

          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs text-slate-600 dark:text-slate-300 shrink-0">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="bg-transparent font-medium text-xs text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer"
            >
              <option value="all">All Alert Types</option>
              <option value="leave_request">Leave Requests</option>
              <option value="attendance_anomaly">Attendance Anomalies</option>
              <option value="document_expiring">Document Expirations</option>
              <option value="payroll_due">Payroll & Compensation</option>
              <option value="system">Announcements</option>
            </select>
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filteredNotifications.length === 0 ? (
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-12 text-center border border-slate-100 dark:border-slate-800 space-y-3">
            <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
              <Inbox className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">You're all caught up!</h3>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              No notifications match your current filter settings.
            </p>
          </div>
        ) : (
          filteredNotifications.map((item) => {
            const isExpanded = expandedId === item.id;
            return (
              <div
                key={item.id}
                onClick={() => handleToggleRead(item.id)}
                className={`group bg-white dark:bg-slate-900 rounded-2xl border p-4 sm:p-5 transition-all duration-200 cursor-pointer ${
                  !item.read
                    ? 'border-indigo-200 dark:border-indigo-900/60 bg-gradient-to-r from-indigo-50/30 via-white to-white dark:from-indigo-950/30 dark:via-slate-900 dark:to-slate-900'
                    : 'border-slate-100 dark:border-slate-800 hover:border-slate-200 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 border ${getAlertBg(item.type)}`}>
                    {getAlertIcon(item.type)}
                  </div>

                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className={`text-sm tracking-tight ${!item.read ? 'font-extrabold text-slate-900 dark:text-white' : 'font-semibold text-slate-800 dark:text-slate-200'}`}>
                          {item.title}
                        </h3>
                        {!item.read && <span className="w-2 h-2 rounded-full bg-indigo-600 shrink-0" />}
                        {item.category === 'announcement' && (
                          <span className="px-2 py-0.5 rounded-md bg-indigo-50 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 text-[10px] font-bold uppercase">
                            Announcement
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs font-medium text-slate-400">{item.time}</span>
                        {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400 opacity-60 group-hover:opacity-100" />}
                      </div>
                    </div>

                    <p className={`text-xs text-slate-600 dark:text-slate-400 leading-relaxed ${isExpanded ? '' : 'line-clamp-2'}`}>
                      {item.message}
                    </p>

                    {isExpanded && (
                      <div className="mt-3 pt-3 border-t border-slate-100 dark:border-slate-800 space-y-3" onClick={(e) => e.stopPropagation()}>
                        {item.author && (
                          <div className="flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
                            <div className={`w-6 h-6 rounded-lg ${item.author.avatarColor || 'bg-slate-400'} text-white font-bold text-[10px] flex items-center justify-center shrink-0`}>
                              {item.author.initials || 'U'}
                            </div>
                            <span>Broadcasted by <strong>{item.author.name}</strong> ({item.author.role})</span>
                          </div>
                        )}
                        {item.audience && (
                          <div className="text-xs text-slate-500 dark:text-slate-400">
                            Target: <span className="font-semibold text-slate-700 dark:text-slate-300">{item.audience.targetName}</span>
                          </div>
                        )}
                        {item.actionUrl && (
                          <Link
                            to={item.actionUrl}
                            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-sm transition-colors"
                          >
                            <span>{item.actionLabel || 'Take Action'}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      <SendAnnouncementModal
        isOpen={isSendModalOpen}
        onClose={() => setIsSendModalOpen(false)}
        onSend={handleSendAnnouncement}
      />
    </div>
  );
};
