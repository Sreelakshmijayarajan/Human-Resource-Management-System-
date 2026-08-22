import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';
import { Download } from 'lucide-react';
import {
  AttendanceTrendPoint,
  LeaveDistributionItem,
  DepartmentHeadcount,
  PayrollCostTrendPoint,
} from '../../types/reports';

// Shared dark tooltip style
const darkTooltipStyle = {
  backgroundColor: '#161E28',
  borderRadius: '12px',
  border: '1px solid rgba(255,255,255,0.08)',
  color: '#E5E7EB',
  fontSize: '12px',
};

interface ChartCardProps {
  title: string;
  subtitle: string;
  onExportCSV: () => void;
  children: React.ReactNode;
}

export const ChartCard: React.FC<ChartCardProps> = ({
  title,
  subtitle,
  onExportCSV,
  children,
}) => {
  return (
    <div className="bg-white dark:bg-[#121821] rounded-2xl border border-slate-100 dark:border-white/[0.07] shadow-xs hover:shadow-md dark:hover:shadow-none dark:hover:border-white/[0.1] transition-all duration-200 p-5 flex flex-col justify-between">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-[#E5E7EB]">{title}</h3>
          <p className="text-xs text-slate-500 dark:text-[#707A87] mt-0.5">{subtitle}</p>
        </div>
        <button
          onClick={onExportCSV}
          className="flex items-center gap-1 px-2.5 py-1.5 text-xs font-semibold text-slate-600 dark:text-[#A7B0BC] hover:text-[#0c8fe9] dark:hover:text-[#36abf8] bg-slate-50 dark:bg-[#161E28] hover:bg-[#0c8fe9]/5 dark:hover:bg-[#0c8fe9]/10 border border-slate-200 dark:border-white/[0.07] hover:border-[#0c8fe9]/30 rounded-xl transition-all"
          title="Export CSV dataset"
        >
          <Download className="w-3.5 h-3.5" /> Export CSV
        </button>
      </div>
      <div className="w-full h-64 sm:h-72">{children}</div>
    </div>
  );
};

// 1. Attendance Trend Line Chart Component
export const AttendanceTrendChart: React.FC<{
  data: AttendanceTrendPoint[];
  onExport: () => void;
}> = ({ data, onExport }) => {
  return (
    <ChartCard
      title="Attendance Rate Trend"
      subtitle="Daily attendance percentage & presence count over selected period"
      onExportCSV={onExport}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#A7B0BC' }} axisLine={false} tickLine={false} />
          <YAxis domain={[80, 100]} tick={{ fontSize: 11, fill: '#A7B0BC' }} axisLine={false} tickLine={false} unit="%" />
          <Tooltip
            contentStyle={darkTooltipStyle}
            formatter={(val: any) => [`${val}%`, 'Attendance Rate']}
          />
          <Line
            type="monotone"
            dataKey="attendancePercentage"
            stroke="#0c8fe9"
            strokeWidth={3}
            dot={{ r: 4, fill: '#0c8fe9', strokeWidth: 2, stroke: '#0B0F14' }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

// 2. Leave Distribution Pie/Donut Chart Component
export const LeaveDistributionChart: React.FC<{
  data: LeaveDistributionItem[];
  onExport: () => void;
}> = ({ data, onExport }) => {
  return (
    <ChartCard
      title="Leave Distribution by Type"
      subtitle="Percentage breakdown of leave categories taken"
      onExportCSV={onExport}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            innerRadius={55}
            outerRadius={85}
            paddingAngle={4}
            dataKey="count"
            nameKey="leaveType"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={darkTooltipStyle}
            formatter={(value: any, _name: any, props: any) => [
              `${value} days (${props.payload.percentage}%)`,
              props.payload.leaveType,
            ]}
          />
          <Legend
            iconType="circle"
            layout="horizontal"
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ fontSize: '11px', paddingTop: '10px', color: '#A7B0BC' }}
          />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

// 3. Department Headcount Bar Chart Component
export const DepartmentHeadcountChart: React.FC<{
  data: DepartmentHeadcount[];
  onExport: () => void;
}> = ({ data, onExport }) => {
  return (
    <ChartCard
      title="Department Headcount Breakdown"
      subtitle="Total workforce distribution by department"
      onExportCSV={onExport}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="department" tick={{ fontSize: 10, fill: '#A7B0BC' }} axisLine={false} tickLine={false} />
          <YAxis tick={{ fontSize: 11, fill: '#A7B0BC' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={darkTooltipStyle}
          />
          <Bar dataKey="count" name="Total Headcount" fill="#0c8fe9" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};

// 4. Payroll Cost Trend Line Chart Component
export const PayrollCostChart: React.FC<{
  data: PayrollCostTrendPoint[];
  onExport: () => void;
}> = ({ data, onExport }) => {
  const formatK = (val: number) => `₹${(val / 1000).toFixed(0)}k`;

  return (
    <ChartCard
      title="Monthly Payroll Spend Trend"
      subtitle="Gross & Net payroll expenditure in INR over 6 months"
      onExportCSV={onExport}
    >
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.04)" />
          <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#A7B0BC' }} axisLine={false} tickLine={false} />
          <YAxis tickFormatter={formatK} tick={{ fontSize: 11, fill: '#A7B0BC' }} axisLine={false} tickLine={false} />
          <Tooltip
            contentStyle={darkTooltipStyle}
            formatter={(val: any) => [`₹${Number(val).toLocaleString('en-IN')}`, 'Amount']}
          />
          <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '8px', color: '#A7B0BC' }} />
          <Line type="monotone" dataKey="grossTotal" name="Gross Payroll Spend" stroke="#10b981" strokeWidth={3} dot={{ r: 4, stroke: '#0B0F14', strokeWidth: 2 }} />
          <Line type="monotone" dataKey="netTotal" name="Net Salary Payout" stroke="#0c8fe9" strokeWidth={2} strokeDasharray="4 4" dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
};
