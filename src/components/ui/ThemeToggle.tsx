import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

export interface ThemeToggleProps {
  className?: string;
  size?: 'sm' | 'md';
}

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ className = '', size = 'md' }) => {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={`relative inline-flex items-center justify-center rounded-xl p-2 transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500/50 ${
        isDark
          ? 'bg-slate-800 text-amber-400 hover:bg-slate-700 hover:text-amber-300 border border-slate-700'
          : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200 hover:text-slate-900 border border-slate-200/60'
      } ${size === 'sm' ? 'w-8 h-8' : 'w-9 h-9'} ${className}`}
    >
      {isDark ? (
        <Sun className={`${size === 'sm' ? 'w-4 h-4' : 'w-4.5 h-4.5'} transition-transform duration-200 rotate-0 hover:rotate-45`} />
      ) : (
        <Moon className={`${size === 'sm' ? 'w-4 h-4' : 'w-4.5 h-4.5'} transition-transform duration-200 -rotate-12 hover:rotate-0`} />
      )}
    </button>
  );
};
