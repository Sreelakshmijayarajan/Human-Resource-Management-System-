import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Search,
  Users,
  Calendar,
  FileText,
  DollarSign,
  BarChart3,
  Cpu,
  Sparkles,
  Zap,
  ArrowRight,
  Database,
  Shield,
  Settings,
  X
} from 'lucide-react';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenSimulator?: () => void;
  onOpenCopilot?: () => void;
  onOpenDataCenter?: () => void;
}

interface CommandItem {
  id: string;
  category: 'Intelligence' | 'Workforce' | 'Operations' | 'System';
  title: string;
  subtitle: string;
  icon: React.ElementType;
  shortcut?: string;
  action: () => void;
}

export const CommandPalette: React.FC<CommandPaletteProps> = ({
  isOpen,
  onClose,
  onOpenSimulator,
  onOpenCopilot,
  onOpenDataCenter,
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const commands: CommandItem[] = [
    {
      id: 'cmd-sim',
      category: 'Intelligence',
      title: 'Run What-If Workforce Simulation',
      subtitle: 'Model capacity, skill redundancy, and leave impact before commitment',
      icon: Cpu,
      shortcut: 'S',
      action: () => {
        onClose();
        if (onOpenSimulator) onOpenSimulator();
        else navigate('/hr/simulator');
      },
    },
    {
      id: 'cmd-copilot',
      category: 'Intelligence',
      title: 'Ask Dayflow Copilot',
      subtitle: 'Query organization metrics, skill bottlenecks, and policy guidelines',
      icon: Sparkles,
      shortcut: 'A',
      action: () => {
        onClose();
        if (onOpenCopilot) onOpenCopilot();
        else navigate('/hr/copilot');
      },
    },
    {
      id: 'cmd-radar',
      category: 'Intelligence',
      title: 'Open Workforce Radar',
      subtitle: 'Inspect attention signals, capacity risks, and attendance deviations',
      icon: Zap,
      shortcut: 'R',
      action: () => {
        onClose();
        navigate('/hr/radar');
      },
    },
    {
      id: 'cmd-emp',
      category: 'Workforce',
      title: 'Employee Directory & Roster',
      subtitle: 'Browse profiles, job assignments, and skill coverage',
      icon: Users,
      action: () => {
        onClose();
        navigate('/hr/employees');
      },
    },
    {
      id: 'cmd-leave',
      category: 'Workforce',
      title: 'Pending Leave Approvals',
      subtitle: '3 leave requests requiring manager / HR decision',
      icon: FileText,
      action: () => {
        onClose();
        navigate('/hr/leave');
      },
    },
    {
      id: 'cmd-att',
      category: 'Workforce',
      title: 'Attendance Records & Deviations',
      subtitle: 'Real-time logs, shift durations, and punctuality patterns',
      icon: Calendar,
      action: () => {
        onClose();
        navigate('/hr/attendance');
      },
    },
    {
      id: 'cmd-payroll',
      category: 'Operations',
      title: 'Payroll Disbursement Register',
      subtitle: 'August 2026 salary structures and payslip generation',
      icon: DollarSign,
      action: () => {
        onClose();
        navigate('/hr/payroll');
      },
    },
    {
      id: 'cmd-reports',
      category: 'Operations',
      title: 'Workforce Intelligence Reports',
      subtitle: 'Turnover risk, attendance analytics, and department capacity',
      icon: BarChart3,
      action: () => {
        onClose();
        navigate('/hr/reports');
      },
    },
    {
      id: 'cmd-datacenter',
      category: 'System',
      title: 'Import & Data Synchronization',
      subtitle: 'Upload CSV/Excel workforce data & refresh AI models',
      icon: Database,
      action: () => {
        onClose();
        if (onOpenDataCenter) onOpenDataCenter();
        else navigate('/hr/datacenter');
      },
    },
    {
      id: 'cmd-roles',
      category: 'System',
      title: 'Role & Access Control',
      subtitle: 'Manage administrative privileges and security policies',
      icon: Shield,
      action: () => {
        onClose();
        navigate('/hr/roles');
      },
    },
    {
      id: 'cmd-settings',
      category: 'System',
      title: 'Policy Settings & Configuration',
      subtitle: 'Statutory leave rules, shifts, and department units',
      icon: Settings,
      action: () => {
        onClose();
        navigate('/hr/settings');
      },
    },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.title.toLowerCase().includes(query.toLowerCase()) ||
    cmd.subtitle.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelectedIndex(0);
      setQuery('');
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else {
          // handled by parent or window
        }
      }
      if (!isOpen) return;

      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, filteredCommands, selectedIndex, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/40 backdrop-blur-sm animate-fade-in">
      <div
        className="w-full max-w-2xl bg-white dark:bg-[#161E28] rounded-2xl border border-slate-200/80 dark:border-white/[0.08] shadow-elevated overflow-hidden animate-slide-up flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Header */}
        <div className="flex items-center px-4 py-3.5 border-b border-slate-100 dark:border-white/[0.06] gap-3 bg-white dark:bg-[#161E28]">
          <Search className="w-5 h-5 text-slate-400 dark:text-[#707A87] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search commands, employees, simulations, reports... (Type 'sim', 'leave')"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="flex-1 bg-transparent text-sm text-slate-900 dark:text-[#F5F7FA] placeholder-slate-400 dark:placeholder-[#707A87] focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-slate-400 hover:text-slate-600 dark:text-[#707A87] dark:hover:text-[#E5E7EB] rounded-md text-xs"
            >
              Clear
            </button>
          )}
          <div className="flex items-center gap-1 text-[11px] text-slate-400 dark:text-[#707A87] bg-slate-100 dark:bg-white/[0.06] px-2 py-0.5 rounded-md font-mono">
            <span>ESC</span>
          </div>
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-slate-50 dark:divide-white/[0.04] flex-1">
          {filteredCommands.length === 0 ? (
            <div className="py-12 text-center text-xs text-slate-400 dark:text-[#707A87]">
              No matching commands or actions found for "{query}".
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const Icon = cmd.icon;
              const isSelected = idx === selectedIndex;
              return (
                <button
                  key={cmd.id}
                  onClick={cmd.action}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors ${isSelected ? 'bg-slate-50 dark:bg-[#1B2531] text-slate-900 dark:text-[#F5F7FA] ring-1 ring-slate-200/80 dark:ring-white/[0.08]' : 'text-slate-700 dark:text-[#A7B0BC] hover:bg-slate-50/60 dark:hover:bg-[#1B2531]/60'
                    }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${cmd.category === 'Intelligence'
                          ? 'bg-[#0c8fe9]/10 text-[#0c8fe9]'
                          : cmd.category === 'Workforce'
                            ? 'bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400'
                            : cmd.category === 'Operations'
                              ? 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : 'bg-slate-100 dark:bg-white/[0.06] text-slate-600 dark:text-[#A7B0BC]'
                        }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-900 dark:text-[#E5E7EB] truncate">{cmd.title}</span>
                        <span className="text-[10px] font-medium text-slate-400 dark:text-[#707A87] uppercase tracking-wider bg-slate-100 dark:bg-white/[0.06] px-1.5 py-0.2 rounded">
                          {cmd.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 dark:text-[#707A87] truncate mt-0.5">{cmd.subtitle}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 pl-2">
                    {cmd.shortcut && (
                      <span className="text-[10px] font-mono text-slate-400 dark:text-[#707A87] bg-slate-100 dark:bg-white/[0.06] border border-slate-200 dark:border-white/[0.08] px-1.5 py-0.5 rounded">
                        {cmd.shortcut}
                      </span>
                    )}
                    <ArrowRight
                      className={`w-3.5 h-3.5 transition-transform ${isSelected ? 'text-[#0c8fe9] translate-x-0.5' : 'text-slate-300 dark:text-[#4A5568]'
                        }`}
                    />
                  </div>
                </button>
              );
            })
          )}
        </div>

        {/* Footer Navigation Hints */}
        <div className="px-4 py-2.5 bg-slate-50 dark:bg-[#121821] border-t border-slate-100 dark:border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400 dark:text-[#707A87] font-medium">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="font-mono bg-white dark:bg-[#161E28] border border-slate-200 dark:border-white/[0.08] px-1.5 py-0.5 rounded text-[10px] text-slate-600 dark:text-[#A7B0BC] shadow-2xs">↑</kbd>{' '}
              <kbd className="font-mono bg-white dark:bg-[#161E28] border border-slate-200 dark:border-white/[0.08] px-1.5 py-0.5 rounded text-[10px] text-slate-600 dark:text-[#A7B0BC] shadow-2xs">↓</kbd> Navigate
            </span>
            <span>
              <kbd className="font-mono bg-white dark:bg-[#161E28] border border-slate-200 dark:border-white/[0.08] px-1.5 py-0.5 rounded text-[10px] text-slate-600 dark:text-[#A7B0BC] shadow-2xs">↵</kbd> Select
            </span>
          </div>
          <span className="text-slate-400 dark:text-[#707A87] font-mono">Dayflow Intelligence OS</span>
        </div>
      </div>
    </div>
  );
};
