import React from 'react';
import { 
  Sparkles, 
  Search, 
  Plus, 
  Flame, 
  Activity, 
  Menu, 
  CheckCircle2 
} from 'lucide-react';
import { ActiveTab } from '../types';

interface NavbarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  onOpenNewTask: () => void;
  onOpenSearch: () => void;
  onToggleAiDrawer: () => void;
  onToggleSidebar: () => void;
  streakDays: number;
  careScore: number;
  completedTodayCount: number;
  totalTodayCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenNewTask,
  onOpenSearch,
  onToggleAiDrawer,
  onToggleSidebar,
  streakDays,
  careScore,
  completedTodayCount,
  totalTodayCount,
}) => {
  const todayFormatted = new Intl.DateTimeFormat('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  }).format(new Date());

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3 transition-colors">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Mobile Menu Toggle & Brand Logo */}
        <div className="flex items-center gap-3">
          <button
            id="mobile-sidebar-toggle-btn"
            onClick={onToggleSidebar}
            aria-label="Toggle Navigation Sidebar"
            className="md:hidden p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-emerald-500 flex items-center justify-center shadow-sm shadow-teal-500/20 text-white font-bold">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-display font-bold text-slate-900 text-lg tracking-tight">
                  CareFlow
                </span>
                <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold bg-teal-50 text-teal-700 border border-teal-200">
                  AI Personal Care
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block font-medium">
                {todayFormatted} • Daily Wellness & Routines
              </p>
            </div>
          </div>
        </div>

        {/* Center: Quick Search Trigger Button */}
        <div className="flex-1 max-w-md mx-2 hidden md:block">
          <button
            id="global-search-trigger-btn"
            onClick={onOpenSearch}
            className="w-full flex items-center justify-between px-3.5 py-1.5 text-xs text-slate-400 bg-slate-50 hover:bg-slate-100/90 border border-slate-200 rounded-xl transition-all shadow-2xs group"
          >
            <div className="flex items-center gap-2 text-slate-500 group-hover:text-slate-700">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span>Search care tasks, pillars, notes...</span>
            </div>
            <kbd className="px-1.5 py-0.5 text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 rounded shadow-2xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right: Streaks, Care Score, AI Assistant, & Add Task */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Mobile Search Button */}
          <button
            id="mobile-search-btn"
            onClick={onOpenSearch}
            aria-label="Search"
            className="md:hidden p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
          >
            <Search className="w-4 h-4" />
          </button>

          {/* Streak Badge */}
          <div 
            title={`${streakDays} days self-care consistency streak`}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-50/80 border border-amber-200/80 text-amber-800 text-xs font-semibold shadow-2xs"
          >
            <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500 animate-pulse" />
            <span>{streakDays}d</span>
          </div>

          {/* Care Score Pill */}
          <div 
            title={`Care Score: ${careScore}% (${completedTodayCount}/${totalTodayCount} tasks done)`}
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50/80 border border-emerald-200/80 text-emerald-800 text-xs font-semibold shadow-2xs"
          >
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>{careScore}% Score</span>
          </div>

          {/* AI Assistant Chat Trigger */}
          <button
            id="nav-ai-assistant-btn"
            onClick={onToggleAiDrawer}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-teal-50 to-indigo-50 hover:from-teal-100 hover:to-indigo-100 border border-indigo-200/70 text-indigo-950 text-xs font-semibold transition-all shadow-2xs group"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600 group-hover:rotate-12 transition-transform" />
            <span className="hidden sm:inline">AI Care Copilot</span>
            <span className="sm:hidden">AI</span>
          </button>

          {/* Quick Add Task */}
          <button
            id="nav-new-task-btn"
            onClick={onOpenNewTask}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-medium transition-all shadow-sm shadow-slate-900/10 active:scale-[0.98]"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Task</span>
          </button>
        </div>
      </div>
    </header>
  );
};
