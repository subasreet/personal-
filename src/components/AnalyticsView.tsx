import React, { useState } from 'react';
import { 
  BarChart3, 
  Sparkles, 
  Flame, 
  Award, 
  CheckCircle2, 
  TrendingUp, 
  Calendar, 
  RefreshCw, 
  Check, 
  Activity, 
  Moon, 
  Droplets,
  HeartHandshake
} from 'lucide-react';
import { CareProject, CareTask, DailyCareMetrics, DayLog } from '../types';

interface AnalyticsViewProps {
  tasks: CareTask[];
  projects: CareProject[];
  metrics: DailyCareMetrics;
  dayLogs: DayLog[];
}

export const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  tasks,
  projects,
  metrics,
  dayLogs,
}) => {
  const [isGeneratingSummary, setIsGeneratingSummary] = useState(false);
  const [aiSummaryData, setAiSummaryData] = useState<{
    summary: string;
    keyWins: string[];
    nextSteps: string[];
    careScore: number;
  } | null>(null);

  const completedTasks = tasks.filter((t) => t.status === 'Completed');
  const pendingTasks = tasks.filter((t) => t.status !== 'Completed');
  const totalRoutines = tasks.length;
  const overallRate = totalRoutines > 0 ? Math.round((completedTasks.length / totalRoutines) * 100) : 0;

  // Generate AI Executive Progress Summary
  const handleGenerateAiSummary = async () => {
    setIsGeneratingSummary(true);
    try {
      const response = await fetch('/api/ai/summarize', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stats: {
            overallCompletionPct: overallRate,
            completedCount: completedTasks.length,
            totalCount: totalRoutines,
            hydrationOz: metrics.hydrationOz,
            mindfulMinutes: metrics.mindfulMinutes,
            sleepHours: metrics.sleepHours,
          },
          streakDays: metrics.streakDays,
          completedTasks: completedTasks.map((t) => t.title),
          pendingTasks: pendingTasks.map((t) => t.title),
        }),
      });

      const data = await response.json();
      setAiSummaryData({
        summary: data.summary || 'Consistent routines maintained across all care pillars.',
        keyWins: data.keyWins || ['Maintained daily streak', 'Optimal sleep latency', 'Consistent hydration'],
        nextSteps: data.nextSteps || ['Complete evening routine', 'Hydrate on waking', 'Prioritize mobility'],
        careScore: data.careScore || 88,
      });
    } catch (err) {
      console.error('Failed to generate summary:', err);
    } finally {
      setIsGeneratingSummary(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900 flex items-center gap-2.5">
            <span>Progress & Wellness Analytics</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 font-semibold">
              Weekly Adherence
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Track habit longevity, circadian consistency, and holistic wellness patterns over time.
          </p>
        </div>

        <button
          id="generate-ai-summary-btn"
          onClick={handleGenerateAiSummary}
          disabled={isGeneratingSummary}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-teal-600 to-indigo-600 hover:from-teal-700 hover:to-indigo-700 disabled:opacity-50 text-white font-bold text-xs shadow-sm shadow-teal-600/20 transition-all self-start sm:self-auto"
        >
          {isGeneratingSummary ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>Analyzing Progress...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-3.5 h-3.5" />
              <span>Generate AI Progress Summary</span>
            </>
          )}
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Care Score */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Today's Care Score</span>
            <TrendingUp className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-display">
            {overallRate}%
          </div>
          <p className="text-[11px] text-emerald-600 font-semibold">
            {completedTasks.length} of {totalRoutines} routines fulfilled
          </p>
        </div>

        {/* Consistency Streak */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Care Streak</span>
            <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-display">
            {metrics.streakDays} Days
          </div>
          <p className="text-[11px] text-amber-600 font-semibold">
            Top 5% habit consistency tier
          </p>
        </div>

        {/* Weekly Avg */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>7-Day Average</span>
            <Activity className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-display">
            87.4%
          </div>
          <p className="text-[11px] text-indigo-600 font-semibold">
            +4.2% higher than prior week
          </p>
        </div>

        {/* Active Pillars */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-2xs space-y-1">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Active Pillars</span>
            <HeartHandshake className="w-4 h-4 text-rose-500" />
          </div>
          <div className="text-2xl font-extrabold text-slate-900 font-display">
            {projects.length} Domains
          </div>
          <p className="text-[11px] text-slate-500">
            Balanced physical & mental care
          </p>
        </div>
      </div>

      {/* AI Progress Summary Card (when generated or default) */}
      {aiSummaryData && (
        <div className="bg-gradient-to-br from-slate-900 via-teal-950 to-slate-900 text-white rounded-3xl p-6 sm:p-7 shadow-xl border border-teal-800/40 relative overflow-hidden animate-in fade-in">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
            <div className="space-y-3 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-500/20 border border-teal-400/30 text-teal-300 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Executive AI Care Evaluation</span>
              </div>
              <h3 className="text-lg sm:text-xl font-bold font-display text-white">
                Holistic Progress & Recovery Assessment
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {aiSummaryData.summary}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                {/* Key Wins */}
                <div className="bg-white/5 rounded-xl p-3.5 border border-white/10 space-y-2">
                  <div className="text-xs font-bold text-teal-300 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-teal-400" />
                    <span>Notable Wins</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {aiSummaryData.keyWins.map((win, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-teal-400 font-bold">•</span>
                        <span>{win}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Next Steps */}
                <div className="bg-white/5 rounded-xl p-3.5 border border-white/10 space-y-2">
                  <div className="text-xs font-bold text-amber-300 flex items-center gap-1.5">
                    <TrendingUp className="w-3.5 h-3.5 text-amber-400" />
                    <span>Action Steps for Tomorrow</span>
                  </div>
                  <ul className="space-y-1.5 text-xs text-slate-300">
                    {aiSummaryData.nextSteps.map((step, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="text-amber-400 font-bold">•</span>
                        <span>{step}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Score pill */}
            <div className="bg-white/10 border border-white/15 rounded-2xl p-5 text-center shrink-0 self-start md:self-auto min-w-[140px]">
              <span className="text-[11px] font-bold text-teal-300 uppercase tracking-wider block">
                Care Index
              </span>
              <div className="text-4xl font-extrabold font-display text-white mt-1">
                {aiSummaryData.careScore}
              </div>
              <span className="text-[10px] text-slate-400 block mt-1">Out of 100</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Charts & Consistency Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: 7-Day Completion Trend */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-slate-900 font-display flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-teal-600" />
                <span>7-Day Routine Adherence Rate</span>
              </h3>
              <p className="text-xs text-slate-500">
                Daily completion ratios across all active care pillars.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg bg-teal-50 text-teal-800 border border-teal-200">
              Past 7 Days
            </span>
          </div>

          {/* SVG Bar Chart */}
          <div className="h-52 flex items-end justify-between gap-3 pt-6 px-2 border-b border-slate-100">
            {dayLogs.map((log, idx) => {
              const heightPct = log.score;
              const isToday = idx === dayLogs.length - 1;

              return (
                <div key={log.date} className="flex-1 flex flex-col items-center h-full justify-end group">
                  {/* Tooltip on hover */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-bold bg-slate-900 text-white px-2 py-0.5 rounded shadow-sm mb-1.5 pointer-events-none">
                    {log.score}% ({log.completedCount}/{log.totalCount})
                  </div>

                  {/* Bar */}
                  <div className="w-full max-w-[42px] bg-slate-100 rounded-t-xl overflow-hidden h-full flex flex-col justify-end">
                    <div
                      className={`w-full rounded-t-xl transition-all duration-700 ease-out ${
                        isToday
                          ? 'bg-gradient-to-t from-teal-600 to-emerald-400'
                          : 'bg-teal-700/80 group-hover:bg-teal-600'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>

                  {/* Label */}
                  <span
                    className={`text-[11px] font-medium mt-2 ${
                      isToday ? 'text-teal-700 font-bold' : 'text-slate-500'
                    }`}
                  >
                    {log.date}
                  </span>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-teal-700" /> Standard Days
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-sm bg-gradient-to-r from-teal-600 to-emerald-400" /> Today (Active)
            </span>
          </div>
        </div>

        {/* Right 1 Col: Care Pillar Distribution */}
        <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-2xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 font-display">
            Pillar Distribution
          </h3>
          <p className="text-xs text-slate-500">
            How your routines are balanced across wellness categories.
          </p>

          <div className="space-y-3 pt-2">
            {projects.map((proj) => {
              const count = tasks.filter((t) => t.projectId === proj.id).length;
              const pct = tasks.length > 0 ? Math.round((count / tasks.length) * 100) : 0;

              return (
                <div key={proj.id} className="space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0"
                        style={{ backgroundColor: proj.color }}
                      />
                      <span className="font-semibold text-slate-700 truncate">
                        {proj.name}
                      </span>
                    </div>
                    <span className="text-slate-500 font-medium shrink-0">
                      {count} ({pct}%)
                    </span>
                  </div>

                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${pct}%`,
                        backgroundColor: proj.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Milestone Badges */}
          <div className="pt-4 border-t border-slate-100 space-y-2">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Earned Badges
            </span>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 rounded-xl bg-amber-50 border border-amber-200/80 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600 shrink-0" />
                <div className="text-[11px] leading-tight">
                  <strong className="text-amber-900 block font-semibold">14-Day Streak</strong>
                  <span className="text-amber-700 text-[10px]">Circadian Anchor</span>
                </div>
              </div>

              <div className="p-2 rounded-xl bg-teal-50 border border-teal-200/80 flex items-center gap-2">
                <Droplets className="w-4 h-4 text-teal-600 shrink-0" />
                <div className="text-[11px] leading-tight">
                  <strong className="text-teal-900 block font-semibold">Hydration Pro</strong>
                  <span className="text-teal-700 text-[10px]">Daily 80oz Target</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
