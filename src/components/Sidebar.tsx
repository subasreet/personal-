import React from 'react';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Layers, 
  SlidersHorizontal, 
  BarChart3, 
  Bot, 
  Zap, 
  X,
  Droplets,
  Moon,
  Heart
} from 'lucide-react';
import { ActiveTab, EnergyLevel } from '../types';

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  isOpen: boolean;
  onClose: () => void;
  activeTaskCount: number;
  urgentTaskCount: number;
  projectCount: number;
  energyLevel: EnergyLevel;
  setEnergyLevel: (level: EnergyLevel) => void;
  hydrationOz: number;
  hydrationTargetOz: number;
  sleepHours: number;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpen,
  onClose,
  activeTaskCount,
  urgentTaskCount,
  projectCount,
  energyLevel,
  setEnergyLevel,
  hydrationOz,
  hydrationTargetOz,
  sleepHours,
}) => {
  const navItems = [
    {
      id: 'dashboard' as ActiveTab,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'tasks' as ActiveTab,
      label: 'Tasks & Routines',
      icon: CheckSquare,
      badge: activeTaskCount > 0 ? activeTaskCount : null,
      badgeColor: 'bg-slate-100 text-slate-700',
    },
    {
      id: 'projects' as ActiveTab,
      label: 'Care Pillars',
      icon: Layers,
      badge: projectCount,
      badgeColor: 'bg-slate-100 text-slate-600',
    },
    {
      id: 'priorities' as ActiveTab,
      label: 'Priorities Matrix',
      icon: SlidersHorizontal,
      badge: urgentTaskCount > 0 ? `${urgentTaskCount} urgent` : null,
      badgeColor: 'bg-rose-50 text-rose-700 border border-rose-200',
    },
    {
      id: 'analytics' as ActiveTab,
      label: 'Progress Analytics',
      icon: BarChart3,
      badge: null,
    },
    {
      id: 'assistant' as ActiveTab,
      label: 'AI Care Assistant',
      icon: Bot,
      badge: 'Gemini',
      badgeColor: 'bg-teal-50 text-teal-700 border border-teal-200',
    },
  ];

  const handleSelectTab = (tab: ActiveTab) => {
    setActiveTab(tab);
    onClose();
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar Rail / Drawer */}
      <aside
        className={`fixed md:sticky top-0 md:top-[57px] left-0 z-50 md:z-20 h-full md:h-[calc(100vh-57px)] w-64 bg-white border-r border-slate-200 flex flex-col justify-between transition-transform duration-200 ease-in-out ${
          isOpen ? 'translate-x-0 shadow-xl' : '-translate-x-full md:translate-x-0'
        }`}
      >
        <div className="p-4 flex flex-col flex-1 overflow-y-auto">
          {/* Mobile Header with Close Button */}
          <div className="flex items-center justify-between pb-3 mb-2 md:hidden border-b border-slate-100">
            <span className="font-semibold text-slate-800 text-sm">Navigation</span>
            <button
              id="sidebar-close-btn"
              onClick={onClose}
              className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider px-3 mb-2">
              Care Management
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-item-${item.id}`}
                  onClick={() => handleSelectTab(item.id)}
                  className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-teal-50/80 text-teal-900 font-semibold border border-teal-200/60 shadow-2xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <Icon
                      className={`w-4 h-4 ${
                        isActive ? 'text-teal-600' : 'text-slate-400'
                      }`}
                    />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-[11px] px-2 py-0.5 rounded-full font-semibold ${
                        item.badgeColor || 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Energy Level Filter / Context */}
          <div className="mt-6 pt-5 border-t border-slate-100">
            <div className="flex items-center justify-between px-1 mb-2">
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-1">
                <Zap className="w-3 h-3 text-amber-500" /> Current Energy
              </span>
              <span className="text-xs font-semibold text-teal-700">{energyLevel}</span>
            </div>
            <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-50 rounded-xl border border-slate-200/70">
              {(['Low', 'Medium', 'High'] as EnergyLevel[]).map((level) => (
                <button
                  key={level}
                  id={`energy-btn-${level.toLowerCase()}`}
                  onClick={() => setEnergyLevel(level)}
                  className={`py-1.5 px-2 text-xs rounded-lg font-medium transition-all ${
                    energyLevel === level
                      ? 'bg-white text-slate-900 shadow-2xs border border-slate-200/80 font-semibold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
            <p className="text-[10px] text-slate-400 px-1 mt-1.5 leading-tight">
              AI prioritizer automatically calibrates tasks to your stamina.
            </p>
          </div>

          {/* Quick Care Vitals Widget */}
          <div className="mt-5 p-3 rounded-xl bg-slate-50 border border-slate-200/70 space-y-2.5">
            <div className="flex items-center justify-between text-xs text-slate-700 font-semibold">
              <span className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500" /> Today's Vitals
              </span>
            </div>

            {/* Hydration */}
            <div>
              <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                <span className="flex items-center gap-1">
                  <Droplets className="w-3 h-3 text-teal-500" /> Water Intake
                </span>
                <span className="font-semibold text-slate-700">
                  {hydrationOz}/{hydrationTargetOz} oz
                </span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-teal-500 rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, Math.round((hydrationOz / hydrationTargetOz) * 100))}%`,
                  }}
                />
              </div>
            </div>

            {/* Sleep */}
            <div>
              <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                <span className="flex items-center gap-1">
                  <Moon className="w-3 h-3 text-indigo-500" /> Rest / Sleep
                </span>
                <span className="font-semibold text-slate-700">{sleepHours}h recorded</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-500 rounded-full transition-all"
                  style={{
                    width: `${Math.min(100, Math.round((sleepHours / 8.0) * 100))}%`,
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-3 border-t border-slate-100 text-center">
          <div className="text-[11px] text-slate-400">
            Personal Care Manager • v1.2
          </div>
        </div>
      </aside>
    </>
  );
};
