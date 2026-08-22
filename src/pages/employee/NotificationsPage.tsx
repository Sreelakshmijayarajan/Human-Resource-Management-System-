import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, CheckCheck, Megaphone, Calendar, Wallet, Clock } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';

export const NotificationsPage: React.FC = () => {
  const { employeeData, markAllNotificationsRead, markNotificationRead } = useAppContext();
  const navigate = useNavigate();

  const getIcon = (type: string) => {
    switch (type) {
      case 'leave': return <Calendar className="w-4 h-4 text-amber-500" />;
      case 'payroll': return <Wallet className="w-4 h-4 text-emerald-500" />;
      case 'attendance': return <Clock className="w-4 h-4 text-teal-500" />;
      default: return <Megaphone className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/employee/dashboard')}
            className="p-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
            aria-label="Back to dashboard"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900">Notifications Center</h1>
            <p className="text-xs text-slate-500">Company announcements, approval notices, and system alerts.</p>
          </div>
        </div>

        {employeeData.notifications.unread > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="px-3 py-1.5 text-xs font-semibold bg-teal-50 text-teal-700 hover:bg-teal-100 rounded-xl transition-colors flex items-center gap-1.5"
          >
            <CheckCheck className="w-3.5 h-3.5" /> Mark all as read
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-card overflow-hidden divide-y divide-slate-100">
        {employeeData.notifications.items.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <Bell className="w-8 h-8 text-slate-300 mx-auto" />
            <p className="text-sm font-semibold text-slate-700">No new notifications</p>
            <p className="text-xs text-slate-400">You're all caught up!</p>
          </div>
        ) : (
          employeeData.notifications.items.map((item) => (
            <div
              key={item.id}
              onClick={() => markNotificationRead(item.id)}
              className={`p-5 flex gap-4 transition-colors cursor-pointer hover:bg-slate-50 ${
                !item.read ? 'bg-teal-50/20' : ''
              }`}
            >
              <div className="w-10 h-10 rounded-2xl bg-slate-100 shrink-0 flex items-center justify-center">
                {getIcon(item.type)}
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex items-center justify-between">
                  <h4 className={`text-sm font-bold ${!item.read ? 'text-slate-900' : 'text-slate-700'}`}>
                    {item.title}
                  </h4>
                  <span className="text-xs text-slate-400">{item.time}</span>
                </div>
                <p className="text-xs text-slate-600 leading-relaxed">{item.message}</p>
              </div>
              {!item.read && <div className="w-2.5 h-2.5 rounded-full bg-teal-500 self-center shrink-0" />}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
