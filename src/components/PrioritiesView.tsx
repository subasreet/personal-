import React, { useState } from 'react';
import { 
  Sparkles, 
  CheckCircle2, 
  Circle, 
  AlertCircle, 
  Flame, 
  Clock, 
  Zap, 
  Check, 
  RefreshCw,
  ArrowUpDown
} from 'lucide-react';
import { CareProject, CareTask, EnergyLevel, PriorityLevel } from '../types';
import { getPriorityBadgeColor } from '../utils/helpers';

interface PrioritiesViewProps {
  tasks: CareTask[];
  projects: CareProject[];
  energyLevel: EnergyLevel;
  setEnergyLevel: (level: EnergyLevel) => void;
  onToggleTaskStatus: (taskId: string) => void;
  onUpdateTaskPriority: (taskId: string, newPriority: PriorityLevel) => void;
  onApplyBatchPriorities: (updates: { id: string; priority: PriorityLevel }[]) => void;
}

export const PrioritiesView: React.FC<PrioritiesViewProps> = ({
  tasks,
  projects,
  energyLevel,
  setEnergyLevel,
  onToggleTaskStatus,
  onUpdateTaskPriority,
  onApplyBatchPriorities,
}) => {
  const [isAiPrioritizing, setIsAiPrioritizing] = useState(false);
  const [aiOverview, setAiOverview] = useState<string | null>(null);
  const [aiSuggestions, setAiSuggestions] = useState<
    { id: string; priority: PriorityLevel; reasoning: string }[] | null
  >(null);
  const [selectedTimeBudget, setSelectedTimeBudget] = useState('1 hour');
  const [focusGoal, setFocusGoal] = useState('Restorative Balance');

  const pendingTasks = tasks.filter((t) => t.status !== 'Completed');

  // Segregate by Priority
  const urgentTasks = tasks.filter((t) => t.priority === 'Urgent');
  const highTasks = tasks.filter((t) => t.priority === 'High');
  const mediumTasks = tasks.filter((t) => t.priority === 'Medium');
  const lowTasks = tasks.filter((t) => t.priority === 'Low');

  const handleRunAiPrioritization = async () => {
    setIsAiPrioritizing(true);
    setAiOverview(null);
    setAiSuggestions(null);

    try {
      const response = await fetch('/api/ai/prioritize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tasks: pendingTasks.map((t) => ({
            id: t.id,
            title: t.title,
            priority: t.priority,
            timeOfDay: t.timeOfDay,
            durationMinutes: t.durationMinutes,
            energyCost: t.energyCost,
            tags: t.tags,
          })),
          energyLevel,
          availableTime: selectedTimeBudget,
          focusGoal,
        }),
      });

      const data = await response.json();
      if (data.prioritized) {
        setAiSuggestions(data.prioritized);
        setAiOverview(data.overview || 'Tasks re-sequenced for optimal recovery and efficiency.');
      }
    } catch (err) {
      console.error('Failed to run AI prioritization:', err);
    } finally {
      setIsAiPrioritizing(false);
    }
  };

  const handleApplyAiPriorities = () => {
    if (!aiSuggestions) return;
    onApplyBatchPriorities(aiSuggestions);
    setAiSuggestions(null);
    setAiOverview('Successfully updated live task priorities!');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900 flex items-center gap-2.5">
            <span>Priorities Matrix</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 font-semibold">
              {urgentTasks.filter((t) => t.status !== 'Completed').length} Urgent Active
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Organize personal care by urgency and health impact to avoid burnout and decision fatigue.
          </p>
        </div>

        {/* Energy quick selector */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs self-start sm:self-auto">
          <Zap className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-semibold text-slate-600">Energy:</span>
          {(['Low', 'Medium', 'High'] as EnergyLevel[]).map((level) => (
            <button
              key={level}
              onClick={() => setEnergyLevel(level)}
              className={`px-2 py-0.5 text-xs font-semibold rounded-lg transition-colors ${
                energyLevel === level
                  ? 'bg-teal-700 text-white shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {level}
            </button>
          ))}
        </div>
      </div>

      {/* AI Prioritization Interactive Tool Card */}
      <div className="bg-gradient-to-r from-teal-900 via-slate-900 to-indigo-950 text-white rounded-3xl p-6 shadow-xl border border-teal-800/40 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-52 h-52 bg-teal-500/10 rounded-full blur-2xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-teal-400/20 text-teal-300 text-[11px] font-bold border border-teal-400/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Aura Intelligent Care Sequencer</span>
              </div>
              <h2 className="text-lg font-bold font-display text-white">
                Harmonize tasks based on your current physical & mental energy
              </h2>
              <p className="text-xs text-slate-300 max-w-xl">
                Let Gemini balance high-cognitive tasks with effortless restorative habits so you don't exhaust your reserves.
              </p>
            </div>

            <button
              id="run-ai-prioritize-btn"
              onClick={handleRunAiPrioritization}
              disabled={isAiPrioritizing}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-500 hover:bg-teal-400 disabled:opacity-50 text-slate-950 font-bold text-xs shadow-md transition-all self-start md:self-auto shrink-0"
            >
              {isAiPrioritizing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Analyzing Routines...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>AI Re-prioritize Plan</span>
                </>
              )}
            </button>
          </div>

          {/* Quick Context Parameters */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 pt-2 border-t border-white/10 text-xs">
            <div>
              <span className="text-slate-400 block mb-1">Available Time Budget</span>
              <div className="flex gap-1.5">
                {['30 mins', '1 hour', 'Full day'].map((tb) => (
                  <button
                    key={tb}
                    onClick={() => setSelectedTimeBudget(tb)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                      selectedTimeBudget === tb
                        ? 'bg-teal-500 text-slate-950 font-bold'
                        : 'bg-white/10 text-slate-300 hover:bg-white/15'
                    }`}
                  >
                    {tb}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <span className="text-slate-400 block mb-1">Care Focus Goal</span>
              <select
                value={focusGoal}
                onChange={(e) => setFocusGoal(e.target.value)}
                className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-2.5 py-1 text-xs focus:outline-none"
              >
                <option value="Restorative Balance" className="bg-slate-900 text-white">
                  Restorative Balance
                </option>
                <option value="Maximum Productivity" className="bg-slate-900 text-white">
                  Maximum Productivity & Movement
                </option>
                <option value="Burnout Recovery" className="bg-slate-900 text-white">
                  Burnout Recovery & Calm
                </option>
              </select>
            </div>

            <div className="flex flex-col justify-end">
              <span className="text-[11px] text-slate-400">
                Pending tasks evaluated: <strong className="text-white">{pendingTasks.length}</strong>
              </span>
            </div>
          </div>

          {/* AI Result Banner / Suggestions Preview */}
          {aiOverview && (
            <div className="p-4 rounded-2xl bg-white/10 border border-white/20 backdrop-blur-md space-y-3 animate-in fade-in">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
                    <Check className="w-4 h-4 text-teal-400" />
                    <span>AI Optimization Strategy</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed">{aiOverview}</p>
                </div>

                {aiSuggestions && aiSuggestions.length > 0 && (
                  <button
                    id="apply-ai-priorities-btn"
                    onClick={handleApplyAiPriorities}
                    className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-teal-400 hover:bg-teal-300 text-slate-950 font-bold text-xs shrink-0 transition-all shadow-md"
                  >
                    <span>Apply to Tasks</span>
                  </button>
                )}
              </div>

              {/* Suggestions items breakdown */}
              {aiSuggestions && aiSuggestions.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pt-2 border-t border-white/10">
                  {aiSuggestions.map((s) => {
                    const task = tasks.find((t) => t.id === s.id);
                    if (!task) return null;
                    const changed = task.priority !== s.priority;

                    return (
                      <div
                        key={s.id}
                        className={`p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 ${
                          changed
                            ? 'bg-teal-500/20 border-teal-400/50'
                            : 'bg-white/5 border-white/10'
                        }`}
                      >
                        <div className="truncate">
                          <span className="font-semibold text-white truncate block">
                            {task.title}
                          </span>
                          <span className="text-[10px] text-slate-300 block truncate">
                            {s.reasoning}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0 font-bold text-[11px]">
                          {changed ? (
                            <>
                              <span className="line-through text-slate-400">{task.priority}</span>
                              <span>→</span>
                              <span className="text-teal-300">{s.priority}</span>
                            </>
                          ) : (
                            <span className="text-slate-300">{s.priority}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* 4 Quadrants Matrix */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Quad 1: Urgent & Essential */}
        <MatrixQuadrantCard
          title="1. Urgent & Essential"
          subtitle="Critical health routines, prescriptions, and time-sensitive physiological resets."
          priority="Urgent"
          accent="rose"
          tasks={urgentTasks}
          projects={projects}
          onToggleStatus={onToggleTaskStatus}
          onChangePriority={onUpdateTaskPriority}
        />

        {/* Quad 2: High Leverage */}
        <MatrixQuadrantCard
          title="2. High Leverage"
          subtitle="Essential foundation: joint mobility, cardiovascular flush, barrier repair."
          priority="High"
          accent="amber"
          tasks={highTasks}
          projects={projects}
          onToggleStatus={onToggleTaskStatus}
          onChangePriority={onUpdateTaskPriority}
        />

        {/* Quad 3: Medium Care */}
        <MatrixQuadrantCard
          title="3. Supportive Habits"
          subtitle="Supportive rituals: mindful breathwork, midday tea, water milestones."
          priority="Medium"
          accent="sky"
          tasks={mediumTasks}
          projects={projects}
          onToggleStatus={onToggleTaskStatus}
          onChangePriority={onUpdateTaskPriority}
        />

        {/* Quad 4: Low / Maintenance */}
        <MatrixQuadrantCard
          title="4. Low / As-Needed"
          subtitle="Low cognitive load: weekly organizer restocking, routine reviews, reading."
          priority="Low"
          accent="slate"
          tasks={lowTasks}
          projects={projects}
          onToggleStatus={onToggleTaskStatus}
          onChangePriority={onUpdateTaskPriority}
        />
      </div>
    </div>
  );
};

interface MatrixQuadrantCardProps {
  title: string;
  subtitle: string;
  priority: PriorityLevel;
  accent: 'rose' | 'amber' | 'sky' | 'slate';
  tasks: CareTask[];
  projects: CareProject[];
  onToggleStatus: (taskId: string) => void;
  onChangePriority: (taskId: string, newPriority: PriorityLevel) => void;
}

const MatrixQuadrantCard: React.FC<MatrixQuadrantCardProps> = ({
  title,
  subtitle,
  priority,
  accent,
  tasks,
  projects,
  onToggleStatus,
  onChangePriority,
}) => {
  const accentClasses = {
    rose: {
      border: 'border-rose-200/90',
      badge: 'bg-rose-50 text-rose-800 border-rose-200',
      indicator: 'bg-rose-500',
    },
    amber: {
      border: 'border-amber-200/90',
      badge: 'bg-amber-50 text-amber-800 border-amber-200',
      indicator: 'bg-amber-500',
    },
    sky: {
      border: 'border-sky-200/90',
      badge: 'bg-sky-50 text-sky-800 border-sky-200',
      indicator: 'bg-sky-500',
    },
    slate: {
      border: 'border-slate-200/90',
      badge: 'bg-slate-100 text-slate-800 border-slate-200',
      indicator: 'bg-slate-400',
    },
  }[accent];

  const pendingCount = tasks.filter((t) => t.status !== 'Completed').length;

  return (
    <div className={`bg-white rounded-2xl border ${accentClasses.border} p-5 shadow-2xs space-y-4 flex flex-col justify-between`}>
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className={`w-2.5 h-2.5 rounded-full ${accentClasses.indicator}`} />
            <h3 className="text-sm font-bold text-slate-900 font-display">{title}</h3>
          </div>
          <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${accentClasses.badge}`}>
            {pendingCount} active
          </span>
        </div>
        <p className="text-xs text-slate-500">{subtitle}</p>

        {/* Task Items in this quadrant */}
        <div className="space-y-2 pt-1">
          {tasks.length === 0 ? (
            <div className="text-center py-6 text-xs text-slate-400 italic">
              No tasks currently in this priority level.
            </div>
          ) : (
            tasks.map((task) => {
              const isDone = task.status === 'Completed';
              const project = projects.find((p) => p.id === task.projectId);

              return (
                <div
                  key={task.id}
                  className={`p-3 rounded-xl border transition-all flex items-start justify-between gap-2.5 group ${
                    isDone
                      ? 'bg-slate-50/50 border-slate-200 text-slate-400'
                      : 'bg-slate-50/30 border-slate-200/80 hover:bg-slate-50 hover:border-slate-300 text-slate-900'
                  }`}
                >
                  <div className="flex items-start gap-2.5 min-w-0 flex-1">
                    <button
                      onClick={() => onToggleStatus(task.id)}
                      className="mt-0.5 text-slate-300 hover:text-teal-600 transition-colors shrink-0"
                    >
                      {isDone ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                      ) : (
                        <Circle className="w-4 h-4 text-slate-400" />
                      )}
                    </button>

                    <div className="min-w-0 space-y-0.5">
                      <h4
                        className={`text-xs font-semibold truncate ${
                          isDone ? 'line-through text-slate-400' : 'text-slate-900'
                        }`}
                      >
                        {task.title}
                      </h4>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400">
                        {project && (
                          <span className="font-medium text-slate-500 truncate">
                            {project.name}
                          </span>
                        )}
                        <span>•</span>
                        <span>{task.durationMinutes}m</span>
                      </div>
                    </div>
                  </div>

                  {/* Move priority dropdown */}
                  <select
                    value={task.priority}
                    onChange={(e) => onChangePriority(task.id, e.target.value as PriorityLevel)}
                    className="text-[10px] font-semibold bg-white border border-slate-200 rounded-lg px-1.5 py-0.5 text-slate-600 focus:outline-none hover:border-slate-300 cursor-pointer"
                    title="Change priority"
                  >
                    <option value="Urgent">Urgent</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
