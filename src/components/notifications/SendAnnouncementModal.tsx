import React, { useState, useEffect } from 'react';
import { 
  X, 
  Send, 
  Megaphone, 
  Users, 
  Building, 
  User, 
  Eye,
  Loader2,
  Sparkles
} from 'lucide-react';
import { AudienceType, NotificationItem } from '../../types/notifications';
import { ConfirmDialog } from '../ui/ConfirmDialog';
export interface SendAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (newNotification: NotificationItem) => void;
}

export const SendAnnouncementModal: React.FC<SendAnnouncementModalProps> = ({
  isOpen,
  onClose,
  onSend,
}) => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [audienceType, setAudienceType] = useState<AudienceType>('all');
  const [selectedDept, setSelectedDept] = useState('Engineering & Tech');
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>(['Sanjay Kumar', 'Priya Sharma']);
  const [scheduleType, setScheduleType] = useState<'now' | 'later'>('now');
  const [scheduledDateTime, setScheduledDateTime] = useState('2026-08-25T10:00');
  const [priority, setPriority] = useState<'normal' | 'urgent'>('normal');
  const [isLoading, setIsLoading] = useState(false);
  const [showConfirmAll, setShowConfirmAll] = useState(false);
  const [errors, setErrors] = useState<{ title?: string; message?: string }>({});

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !isLoading) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors: { title?: string; message?: string } = {};
    if (!title.trim()) newErrors.title = 'Announcement title is required.';
    if (!message.trim()) newErrors.message = 'Announcement message body is required.';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleTriggerSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    if (audienceType === 'all') {
      setShowConfirmAll(true);
    } else {
      executeSend();
    }
  };

  const executeSend = () => {
    setIsLoading(true);
    setTimeout(() => {
      let targetName = 'All Employees (248)';
      if (audienceType === 'department') {
        targetName = `${selectedDept} Department`;
      } else if (audienceType === 'individuals') {
        targetName = `${selectedEmployees.length} Selected Employees`;
      }

      const newAnnouncement: NotificationItem = {
        id: `ann-${Date.now()}`,
        category: 'announcement',
        type: 'system',
        title: title.trim(),
        message: message.trim(),
        time: scheduleType === 'now' ? 'Just now' : `Scheduled for ${scheduledDateTime.replace('T', ' ')}`,
        timestamp: new Date().toISOString(),
        read: false,
        author: {
          name: 'Uma Umamaheshwari',
          role: 'HR Administrator',
          avatarColor: 'bg-indigo-600',
          initials: 'UU',
        },
        audience: {
          type: audienceType,
          targetName,
        },
      };

      onSend(newAnnouncement);
      setIsLoading(false);
      setShowConfirmAll(false);
      onClose();
      // Reset form
      setTitle('');
      setMessage('');
      setAudienceType('all');
    }, 600);
  };

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-sm animate-fade-in overflow-y-auto"
      >
        <div
          className="w-full max-w-4xl bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-100 dark:border-slate-800 overflow-hidden my-auto animate-slide-up flex flex-col max-h-[92vh]"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850/50">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shadow-2xs">
                <Megaphone className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                  Send Company Announcement
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Broadcast updates, events, and policy alerts to your workforce.
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form & Live Preview Grid */}
          <div className="p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1">
            {/* Left: Input Form (7 cols) */}
            <form onSubmit={handleTriggerSubmit} className="lg:col-span-7 space-y-4">
              {/* Title Field */}
              <div className="space-y-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Announcement Title <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Q3 Town Hall & Performance Review Window"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-sm border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all ${
                    errors.title
                      ? 'border-rose-400 dark:border-rose-500'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
                {errors.title && <p className="text-xs text-rose-600 dark:text-rose-400">{errors.title}</p>}
              </div>

              {/* Message Body */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Message Content <span className="text-rose-500">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400 font-mono">{message.length}/500 chars</span>
                </div>
                <textarea
                  rows={4}
                  maxLength={500}
                  placeholder="Type your message details here. Include agenda, timings, or action required by employees..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className={`w-full px-3.5 py-2.5 rounded-xl text-sm border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all resize-none ${
                    errors.message
                      ? 'border-rose-400 dark:border-rose-500'
                      : 'border-slate-200 dark:border-slate-700'
                  }`}
                />
                {errors.message && <p className="text-xs text-rose-600 dark:text-rose-400">{errors.message}</p>}
              </div>

              {/* Audience Selector */}
              <div className="space-y-1.5 pt-1">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Target Audience
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setAudienceType('all')}
                    className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      audienceType === 'all'
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 shadow-2xs'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>All Employees</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAudienceType('department')}
                    className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      audienceType === 'department'
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 shadow-2xs'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <Building className="w-3.5 h-3.5" />
                    <span>Department</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAudienceType('individuals')}
                    className={`flex items-center justify-center gap-1.5 p-2.5 rounded-xl border text-xs font-semibold transition-all ${
                      audienceType === 'individuals'
                        ? 'border-indigo-600 bg-indigo-50/70 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 shadow-2xs'
                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Individuals</span>
                  </button>
                </div>

                {/* Sub-select based on audience */}
                {audienceType === 'department' && (
                  <div className="pt-1 animate-slide-up">
                    <select
                      value={selectedDept}
                      onChange={(e) => setSelectedDept(e.target.value)}
                      className="w-full px-3.5 py-2 rounded-xl text-xs sm:text-sm border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                    >
                      <option value="Engineering & Tech">Engineering & Tech (112 members)</option>
                      <option value="Product & Design">Product & Design (42 members)</option>
                      <option value="Human Resources">Human Resources (14 members)</option>
                      <option value="Analytics & Data">Analytics & Data (28 members)</option>
                      <option value="Finance & Accounts">Finance & Accounts (18 members)</option>
                    </select>
                  </div>
                )}

                {audienceType === 'individuals' && (
                  <div className="pt-1 animate-slide-up space-y-1 text-xs">
                    <p className="text-slate-500 dark:text-slate-400">Select target individuals:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {['Sanjay Kumar', 'Priya Sharma', 'Rahul Verma', 'Dev Patel', 'Ananya Iyer'].map((name) => {
                        const isSelected = selectedEmployees.includes(name);
                        return (
                          <button
                            key={name}
                            type="button"
                            onClick={() => {
                              setSelectedEmployees((prev) =>
                                isSelected ? prev.filter((n) => n !== name) : [...prev, name]
                              );
                            }}
                            className={`px-2.5 py-1 rounded-lg border font-medium text-xs transition-colors ${
                              isSelected
                                ? 'bg-indigo-600 text-white border-indigo-600'
                                : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                            }`}
                          >
                            {isSelected ? '✓ ' : '+ '}
                            {name}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              {/* Delivery Options & Schedule */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Delivery Timing
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setScheduleType('now')}
                      className={`flex-1 py-2 rounded-xl border text-xs font-semibold transition-colors ${
                        scheduleType === 'now'
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      Send Now
                    </button>
                    <button
                      type="button"
                      onClick={() => setScheduleType('later')}
                      className={`flex-1 py-2 rounded-xl border text-xs font-semibold transition-colors ${
                        scheduleType === 'later'
                          ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      Schedule
                    </button>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Priority Flag
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setPriority('normal')}
                      className={`flex-1 py-2 rounded-xl border text-xs font-semibold transition-colors ${
                        priority === 'normal'
                          ? 'border-blue-600 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      Normal
                    </button>
                    <button
                      type="button"
                      onClick={() => setPriority('urgent')}
                      className={`flex-1 py-2 rounded-xl border text-xs font-semibold transition-colors ${
                        priority === 'urgent'
                          ? 'border-rose-600 bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                      }`}
                    >
                      🚨 Urgent
                    </button>
                  </div>
                </div>
              </div>

              {scheduleType === 'later' && (
                <div className="space-y-1 animate-slide-up">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Schedule Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={scheduledDateTime}
                    onChange={(e) => setScheduledDateTime(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100"
                  />
                </div>
              )}
            </form>

            {/* Right: Live Preview Panel (5 cols) */}
            <div className="lg:col-span-5 flex flex-col justify-between p-4 sm:p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/80 space-y-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  <Eye className="w-3.5 h-3.5 text-indigo-500" />
                  <span>Recipient Feed Preview</span>
                </div>

                {/* Card Preview */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-200/90 dark:border-slate-700 shadow-sm space-y-3">
                  <div className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0">
                      <Megaphone className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 truncate">
                          Uma Umamaheshwari (HR Admin)
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0">Just now</span>
                      </div>
                      <h4 className="text-xs font-extrabold text-slate-900 dark:text-white mt-0.5 leading-snug">
                        {title || 'Your Announcement Title Here...'}
                      </h4>
                    </div>
                  </div>

                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-4 bg-slate-50/80 dark:bg-slate-800/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
                    {message || 'Your announcement details will appear here just like employees will see it in their Dayflow workspace.'}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1 border-t border-slate-100 dark:border-slate-800">
                    <span className="flex items-center gap-1 font-semibold text-slate-600 dark:text-slate-400">
                      <Users className="w-3 h-3 text-indigo-500" />
                      {audienceType === 'all'
                        ? 'All Employees (248)'
                        : audienceType === 'department'
                        ? selectedDept
                        : `${selectedEmployees.length} Individuals`}
                    </span>
                    {priority === 'urgent' && (
                      <span className="text-rose-600 font-bold bg-rose-50 dark:bg-rose-950/60 px-1.5 py-0.5 rounded">
                        URGENT
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Informational tip */}
              <div className="p-3 rounded-xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-100 dark:border-indigo-900/60 text-[11px] text-indigo-900 dark:text-indigo-300 space-y-1">
                <div className="font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                  Instant Synchronized Broadcast
                </div>
                <p className="opacity-90">
                  Announcements automatically notify all connected employee dashboards and update the topbar alerts.
                </p>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-850/50">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleTriggerSubmit}
              disabled={isLoading}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-indigo-500/25 transition-all active:scale-[0.98] disabled:opacity-60"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Broadcasting...</span>
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  <span>{scheduleType === 'now' ? 'Send Announcement Now' : 'Schedule Announcement'}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog before sending to All Employees */}
      <ConfirmDialog
        isOpen={showConfirmAll}
        title="Broadcast to All Employees?"
        message="This announcement will be instantly broadcast to all 248 active employees across all corporate departments. Every staff member will receive a persistent workspace notification."
        variant="primary"
        confirmText="Yes, Send Announcement"
        cancelText="Review Details"
        isLoading={isLoading}
        onConfirm={executeSend}
        onClose={() => setShowConfirmAll(false)}
        onCancel={() => setShowConfirmAll(false)}
      />
    </>
  );
};
