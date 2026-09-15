import React from 'react';
import { 
  CheckCircle2, 
  Circle, 
  Clock, 
  Sparkles, 
  Flame, 
  Droplets, 
  Brain, 
  Moon, 
  Activity, 
  Plus, 
  ArrowRight,
  Sun,
  SunMedium
} from 'lucide-react';
import { CareProject, CareTask, DailyCareMetrics, EnergyLevel } from '../types';
import { getPriorityBadgeColor } from '../utils/helpers';

interface DashboardViewProps {
  tasks: CareTask[];
  projects: CareProject[];
  metrics: DailyCareMetrics;
  energyLevel: EnergyLevel;
  onToggleTaskStatus: (taskId: string) => void;
  onOpenNewTask: () => void;
  onOpenTaskDetails: (task: CareTask) => void;
  onNavigateToTab: (tab: any) => void;
  onOpenAiChatWithPrompt: (prompt: string) => void;
  onIncrementHydration: (oz: number) => void;
  onIncrementMindful: (mins: number) => void;
  onIncrementMovement: (mins: number) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  tasks,
  projects,
  metrics,
  energyLevel,
  onToggleTaskStatus,
  onOpenNewTask,
  onOpenTaskDetails,
  onNavigateToTab,
  onOpenAiChatWithPrompt,
  onIncrementHydration,
  onIncrementMindful,
  onIncrementMovement,
}) => {
  const completedTasks = tasks.filter((t) => t.status === 'Completed');
  const pendingTasks = tasks.filter((t) => t.status !== 'Completed');
  const urgentTasks = pendingTasks.filter((t) => t.priority === 'Urgent' || t.priority === 'High');

  // Segregate tasks by timeOfDay
  const morningTasks = tasks.filter((t) => t.timeOfDay === 'Morning');
  const afternoonTasks = tasks.filter((t) => t.timeOfDay === 'Afternoon');
  const eveningTasks = tasks.filter((t) => t.timeOfDay === 'Evening');

  const completionPct = tasks.length > 0 
    ? Math.round((completedTasks.length / tasks.length) * 100) 
    : 0;

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Hero Welcome & Daily Care Readiness Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white p-6 sm:p-8 shadow-xl border border-teal-900/40">
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-60 h-60 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-semibold backdrop-blur-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personal Care Readiness • Today</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold font-display tracking-tight text-white">
              Nurture your balance today.
            </h1>
            <p className="text-slate-300 text-sm leading-relaxed">
              You have completed <strong className="text-teal-300 font-semibold">{completedTasks.length}</strong> of{' '}
              <strong className="text-white font-semibold">{tasks.length}</strong> daily care routines. 
              {energyLevel === 'Low' && (
                <span className="block mt-1 text-amber-300 text-xs font-medium">
                  ⚡ Noticed low energy mode — essential health items prioritized, non-urgent tasks can wait.
                </span>
              )}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                id="hero-auto-prioritize-btn"
                onClick={() => onNavigateToTab('priorities')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-xs shadow-md shadow-teal-500/20 transition-all active:scale-[0.98]"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>AI Auto-Prioritize Plan</span>
              </button>
              <button
                id="hero-ask-ai-btn"
                onClick={() => onOpenAiChatWithPrompt('Summarize my care progress and tell me what to do next today.')}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white font-semibold text-xs border border-white/15 backdrop-blur-xs transition-all"
              >
                <span>Ask AI Care Copilot</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Radial / Stat Widget */}
          <div className="flex items-center gap-4 sm:gap-6 bg-white/5 border border-white/10 p-4 sm:p-5 rounded-2xl backdrop-blur-md self-start md:self-auto">
            {/* Circular score visual */}
            <div className="relative w-20 h-20 flex items-center justify-center">
              <svg className="w-20 h-20 -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-white/10"
                  stroke="currentColor"
                  strokeWidth="3.5"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-teal-400 transition-all duration-700 ease-out"
                  strokeDasharray={`${completionPct}, 100`}
                  stroke="currentColor"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="text-xl font-bold font-display text-white">
                  {completionPct}%
                </span>
              </div>
            </div>

            <div className="space-y-1">
              <div className="text-xs font-semibold text-teal-300 uppercase tracking-wider">
                Daily Care Score
              </div>
              <div className="text-sm text-slate-200 font-medium">
                {completedTasks.length} / {tasks.length} Completed
              </div>
              <div className="flex items-center gap-1.5 text-xs text-amber-300 font-semibold">
                <Flame className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{metrics.streakDays}-Day Care Streak</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Vitals & Health Habits Loggers */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Hydration */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-teal-50 text-teal-600">
                <Droplets className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-700">Hydration</span>
            </div>
            <span className="text-xs font-extrabold text-teal-700">
              {metrics.hydrationOz} / {metrics.hydrationTargetOz} oz
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
            <div
              className="bg-teal-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.round((metrics.hydrationOz / metrics.hydrationTargetOz) * 100))}%` }}
            />
          </div>
          <div className="flex items-center gap-1.5">
            <button
              id="quick-add-water-btn"
              onClick={() => onIncrementHydration(8)}
              className="flex-1 py-1 px-2 text-[11px] font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors text-center border border-teal-200/60"
            >
              +8 oz (1 glass)
            </button>
            <button
              onClick={() => onIncrementHydration(16)}
              className="py-1 px-2 text-[11px] font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-lg transition-colors border border-teal-200/60"
            >
              +16 oz
            </button>
          </div>
        </div>

        {/* Mindfulness */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                <Brain className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-700">Mindfulness</span>
            </div>
            <span className="text-xs font-extrabold text-indigo-700">
              {metrics.mindfulMinutes} / {metrics.mindfulTargetMinutes}m
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.round((metrics.mindfulMinutes / metrics.mindfulTargetMinutes) * 100))}%` }}
            />
          </div>
          <div className="flex items-center gap-1.5">
            <button
              id="quick-add-mindful-btn"
              onClick={() => onIncrementMindful(5)}
              className="flex-1 py-1 px-2 text-[11px] font-semibold text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors text-center border border-indigo-200/60"
            >
              +5 min Breath
            </button>
            <button
              onClick={() => onIncrementMindful(10)}
              className="py-1 px-2 text-[11px] font-semibold text-indigo-800 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-colors border border-indigo-200/60"
            >
              +10 min
            </button>
          </div>
        </div>

        {/* Movement */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-orange-50 text-orange-600">
                <Activity className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-700">Daily Movement</span>
            </div>
            <span className="text-xs font-extrabold text-orange-700">
              {metrics.movementMinutes} / {metrics.movementTargetMinutes}m
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
            <div
              className="bg-orange-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.round((metrics.movementMinutes / metrics.movementTargetMinutes) * 100))}%` }}
            />
          </div>
          <div className="flex items-center gap-1.5">
            <button
              id="quick-add-movement-btn"
              onClick={() => onIncrementMovement(10)}
              className="flex-1 py-1 px-2 text-[11px] font-semibold text-orange-800 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors text-center border border-orange-200/60"
            >
              +10m Mobility
            </button>
            <button
              onClick={() => onIncrementMovement(20)}
              className="py-1 px-2 text-[11px] font-semibold text-orange-800 bg-orange-50 hover:bg-orange-100 rounded-lg transition-colors border border-orange-200/60"
            >
              +20m Walk
            </button>
          </div>
        </div>

        {/* Sleep Rest */}
        <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-sky-50 text-sky-600">
                <Moon className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-700">Rest & Sleep</span>
            </div>
            <span className="text-xs font-extrabold text-sky-700">
              {metrics.sleepHours}h / {metrics.sleepTargetHours}h
            </span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-3">
            <div
              className="bg-sky-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${Math.min(100, Math.round((metrics.sleepHours / metrics.sleepTargetHours) * 100))}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-[11px] text-slate-500">
            <span>Optimal latency</span>
            <span className="font-semibold text-slate-700">Slow-wave: Good</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Today's Routine Timeline & Urgent Priorities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Today's Care Routine Flow */}
        <div className="lg:col-span-2 space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-slate-900 font-display flex items-center gap-2">
                <span>Today's Care Timeline</span>
                <span className="text-xs px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-medium">
                  {tasks.length} Routines
                </span>
              </h2>
              <p className="text-xs text-slate-500">
                Follow natural circadian rhythms for optimal vitality and calm.
              </p>
            </div>

            <button
              id="timeline-add-task-btn"
              onClick={onOpenNewTask}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Routine</span>
            </button>
          </div>

          {/* Morning Section */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-800 uppercase tracking-wider">
              <Sun className="w-4 h-4 text-amber-500" />
              <span>Morning Ritual ({morningTasks.filter((t) => t.status === 'Completed').length}/{morningTasks.length})</span>
            </div>

            <div className="space-y-2">
              {morningTasks.map((task) => (
                <TaskRowItem
                  key={task.id}
                  task={task}
                  projects={projects}
                  onToggleStatus={() => onToggleTaskStatus(task.id)}
                  onClickDetails={() => onOpenTaskDetails(task)}
                />
              ))}
            </div>
          </div>

          {/* Afternoon Section */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-800 uppercase tracking-wider">
              <SunMedium className="w-4 h-4 text-orange-500" />
              <span>Afternoon Balance ({afternoonTasks.filter((t) => t.status === 'Completed').length}/{afternoonTasks.length})</span>
            </div>

            <div className="space-y-2">
              {afternoonTasks.map((task) => (
                <TaskRowItem
                  key={task.id}
                  task={task}
                  projects={projects}
                  onToggleStatus={() => onToggleTaskStatus(task.id)}
                  onClickDetails={() => onOpenTaskDetails(task)}
                />
              ))}
            </div>
          </div>

          {/* Evening Section */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-800 uppercase tracking-wider">
              <Moon className="w-4 h-4 text-indigo-500" />
              <span>Evening Wind-Down ({eveningTasks.filter((t) => t.status === 'Completed').length}/{eveningTasks.length})</span>
            </div>

            <div className="space-y-2">
              {eveningTasks.map((task) => (
                <TaskRowItem
                  key={task.id}
                  task={task}
                  projects={projects}
                  onToggleStatus={() => onToggleTaskStatus(task.id)}
                  onClickDetails={() => onOpenTaskDetails(task)}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right 1 Col: Urgent Focus & AI Assistant Widget */}
        <div className="space-y-5">
          {/* Urgent & High Priority Card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
                Urgent Priorities
              </h3>
              <button
                onClick={() => onNavigateToTab('priorities')}
                className="text-[11px] font-semibold text-teal-700 hover:text-teal-900"
              >
                View Matrix →
              </button>
            </div>

            {urgentTasks.length === 0 ? (
              <div className="p-4 rounded-xl bg-slate-50 text-center text-slate-500 text-xs">
                ✨ No pending urgent tasks! You are well on track.
              </div>
            ) : (
              <div className="space-y-2.5">
                {urgentTasks.slice(0, 4).map((task) => {
                  const pBadge = getPriorityBadgeColor(task.priority);
                  return (
                    <div
                      key={task.id}
                      onClick={() => onOpenTaskDetails(task)}
                      className="p-3 rounded-xl border border-slate-200/80 hover:border-slate-300 bg-slate-50/40 hover:bg-slate-50 cursor-pointer transition-all flex items-start justify-between gap-2.5"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${pBadge.bg} ${pBadge.text} ${pBadge.border}`}
                          >
                            {task.priority}
                          </span>
                          <span className="text-[10px] text-slate-400 font-medium">
                            {task.timeOfDay} • {task.durationMinutes}m
                          </span>
                        </div>
                        <h4 className="text-xs font-semibold text-slate-900 line-clamp-1">
                          {task.title}
                        </h4>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleTaskStatus(task.id);
                        }}
                        className="text-slate-400 hover:text-teal-600 transition-colors p-1"
                      >
                        <Circle className="w-4 h-4" />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* AI Care Copilot Prompt Card */}
          <div className="bg-gradient-to-br from-teal-500/10 via-indigo-500/10 to-transparent p-5 rounded-2xl border border-teal-200/80 shadow-2xs space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center shadow-xs">
                <Sparkles className="w-4 h-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">Aura AI Care Assistant</h4>
                <p className="text-[11px] text-slate-500">Intelligent routine suggestions</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              "Tell me your energy level, and I will sequence your afternoon self-care routines for maximum ease and stress reduction."
            </p>

            <div className="space-y-1.5">
              <button
                onClick={() => onOpenAiChatWithPrompt('Help me organize my evening wind-down routine to fall asleep faster.')}
                className="w-full text-left text-[11px] p-2 rounded-lg bg-white/90 hover:bg-white border border-teal-200/70 text-slate-700 hover:text-teal-900 font-medium transition-all shadow-2xs"
              >
                💤 Optimize my evening wind-down routine
              </button>
              <button
                onClick={() => onOpenAiChatWithPrompt('I am feeling overwhelmed with work today. What 2 personal care actions should I do right now?')}
                className="w-full text-left text-[11px] p-2 rounded-lg bg-white/90 hover:bg-white border border-teal-200/70 text-slate-700 hover:text-teal-900 font-medium transition-all shadow-2xs"
              >
                🌿 De-stress: 2 high-impact actions right now
              </button>
            </div>
          </div>

          {/* Care Pillars Mini Breakdown */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-800 uppercase tracking-wider">
              <span>Care Pillars</span>
              <button
                onClick={() => onNavigateToTab('projects')}
                className="text-[11px] font-semibold text-teal-700 hover:text-teal-900"
              >
                All Pillars ({projects.length}) →
              </button>
            </div>

            <div className="space-y-2">
              {projects.slice(0, 4).map((p) => {
                const projectTasks = tasks.filter((t) => t.projectId === p.id);
                const doneCount = projectTasks.filter((t) => t.status === 'Completed').length;
                const ratio = projectTasks.length > 0 ? Math.round((doneCount / projectTasks.length) * 100) : 0;

                return (
                  <div key={p.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2 truncate">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: p.color }}
                        />
                        <span className="font-semibold text-slate-700 truncate">{p.name}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-medium shrink-0">
                        {doneCount}/{projectTasks.length}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${ratio}%`,
                          backgroundColor: p.color,
                        }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface TaskRowItemProps {
  task: CareTask;
  projects: CareProject[];
  onToggleStatus: () => void;
  onClickDetails: () => void;
}

const TaskRowItem: React.FC<TaskRowItemProps> = ({
  task,
  projects,
  onToggleStatus,
  onClickDetails,
}) => {
  const isDone = task.status === 'Completed';
  const project = projects.find((p) => p.id === task.projectId);
  const pBadge = getPriorityBadgeColor(task.priority);

  return (
    <div
      onClick={onClickDetails}
      className={`p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 group ${
        isDone
          ? 'bg-slate-50/70 border-slate-200 text-slate-400'
          : 'bg-white border-slate-200/90 hover:border-slate-300 hover:shadow-2xs text-slate-900'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0">
        {/* Toggle Checkbox */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleStatus();
          }}
          className="text-slate-300 hover:text-teal-600 transition-colors shrink-0 p-0.5"
          aria-label={isDone ? 'Mark as incomplete' : 'Mark as complete'}
        >
          {isDone ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100" />
          ) : (
            <Circle className="w-5 h-5 text-slate-400 hover:text-teal-600" />
          )}
        </button>

        <div className="min-w-0 space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            <h4
              className={`text-xs font-semibold truncate transition-colors ${
                isDone ? 'line-through text-slate-400' : 'text-slate-900 group-hover:text-teal-900'
              }`}
            >
              {task.title}
            </h4>
            {task.streak > 0 && (
              <span className="hidden sm:inline-flex items-center gap-0.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.2 rounded">
                <Flame className="w-3 h-3 fill-amber-500 text-amber-500" />
                {task.streak}d
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-slate-500 flex-wrap">
            {project && (
              <span className="flex items-center gap-1 font-medium">
                <span
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: project.color }}
                />
                {project.name}
              </span>
            )}
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" /> {task.durationMinutes}m
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <span
          className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${pBadge.bg} ${pBadge.text} ${pBadge.border}`}
        >
          {task.priority}
        </span>
      </div>
    </div>
  );
};
