import React from 'react';
import { Download, TrendingUp, Users, Clock, CalendarDays, WalletCards, BarChart2, PieChart, FileText } from 'lucide-react';

const departmentData = [
  { dept: 'Engineering', employees: 45, present: 42, attendance: 93, leaves: 8 },
  { dept: 'Product & Design', employees: 22, present: 20, attendance: 91, leaves: 3 },
  { dept: 'Human Resources', employees: 12, present: 11, attendance: 92, leaves: 2 },
  { dept: 'Analytics', employees: 18, present: 17, attendance: 94, leaves: 1 },
  { dept: 'Finance', employees: 15, present: 14, attendance: 93, leaves: 2 },
  { dept: 'Marketing', employees: 20, present: 18, attendance: 90, leaves: 4 },
];

const monthlyLeaveData = [
  { month: 'Mar', count: 12 },
  { month: 'Apr', count: 18 },
  { month: 'May', count: 15 },
  { month: 'Jun', count: 22 },
  { month: 'Jul', count: 30 },
  { month: 'Aug', count: 20 },
];

const maxLeave = Math.max(...monthlyLeaveData.map(d => d.count));

const summaryCards = [
  { label: 'Total Workforce', value: '256', sub: '+4 this month', icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
  { label: 'Attendance Rate', value: '93.2%', sub: '+1.2% vs last month', icon: Clock, color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { label: 'Leave Requests', value: '20', sub: '8 pending approval', icon: CalendarDays, color: 'text-amber-600', bg: 'bg-amber-50' },
  { label: 'Monthly Payroll', value: '\u20b97.13L', sub: 'August 2026', icon: WalletCards, color: 'text-indigo-600', bg: 'bg-indigo-50' },
];

export const ReportsPage: React.FC = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Reports &amp; Analytics</h1>
          <p className="text-sm text-slate-500 mt-1">Organization-wide trends and exportable reports</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-800 hover:bg-slate-900 text-white text-sm font-semibold rounded-xl transition-colors shadow-sm">
          <Download className="w-4 h-4" /> Export Report
        </button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map(s => (
          <div key={s.label} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className={'w-9 h-9 rounded-xl ' + s.bg + ' ' + s.color + ' flex items-center justify-center'}>
                <s.icon className="w-4 h-4" />
              </div>
              <p className="text-xs font-semibold text-slate-400">{s.label}</p>
            </div>
            <p className="text-2xl font-extrabold text-slate-900">{s.value}</p>
            <p className="text-xs text-slate-500 mt-1 flex items-center gap-1">
              <TrendingUp className="w-3 h-3 text-emerald-500" />{s.sub}
            </p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart2 className="w-4 h-4 text-indigo-500" />
            <h3 className="font-semibold text-slate-900">Monthly Leave Trend</h3>
          </div>
          <div className="flex items-end justify-between gap-2 h-40">
            {monthlyLeaveData.map(d => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs font-semibold text-slate-600">{d.count}</span>
                <div
                  className="w-full rounded-t-lg bg-indigo-500 hover:bg-indigo-600 transition-all"
                  style={{ height: ((d.count / maxLeave) * 100) + '%' }}
                ></div>
                <span className="text-xs text-slate-400">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center gap-2 mb-6">
            <PieChart className="w-4 h-4 text-emerald-500" />
            <h3 className="font-semibold text-slate-900">Department Attendance</h3>
          </div>
          <div className="space-y-3">
            {departmentData.map(d => (
              <div key={d.dept}>
                <div className="flex justify-between text-xs text-slate-600 mb-1">
                  <span className="font-medium">{d.dept}</span>
                  <span className="font-semibold text-slate-900">{d.attendance}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <div
                    className="bg-emerald-500 h-2 rounded-full transition-all"
                    style={{ width: d.attendance + '%' }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <FileText className="w-4 h-4 text-slate-400" />
          <h3 className="font-semibold text-slate-900">Department Summary</h3>
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50">
              <th className="text-left px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Department</th>
              <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Employees</th>
              <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden sm:table-cell">Present</th>
              <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Attendance</th>
              <th className="text-right px-5 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wide hidden md:table-cell">Leaves</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {departmentData.map(d => (
              <tr key={d.dept} className="hover:bg-slate-50/60 transition-colors">
                <td className="px-5 py-4 font-medium text-slate-900">{d.dept}</td>
                <td className="px-5 py-4 text-right text-slate-600">{d.employees}</td>
                <td className="px-5 py-4 text-right text-emerald-600 hidden sm:table-cell">{d.present}</td>
                <td className="px-5 py-4 text-right">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-lg bg-emerald-50 text-emerald-700 text-xs font-semibold">
                    {d.attendance}%
                  </span>
                </td>
                <td className="px-5 py-4 text-right text-amber-600 hidden md:table-cell">{d.leaves}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
