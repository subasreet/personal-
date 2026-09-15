import { PriorityLevel, TaskStatus, TimeOfDay } from '../types';

export function getPriorityBadgeColor(priority: PriorityLevel): { bg: string; text: string; border: string; dot: string } {
  switch (priority) {
    case 'Urgent':
      return {
        bg: 'bg-rose-50',
        text: 'text-rose-700',
        border: 'border-rose-200',
        dot: 'bg-rose-500',
      };
    case 'High':
      return {
        bg: 'bg-amber-50',
        text: 'text-amber-700',
        border: 'border-amber-200',
        dot: 'bg-amber-500',
      };
    case 'Medium':
      return {
        bg: 'bg-sky-50',
        text: 'text-sky-700',
        border: 'border-sky-200',
        dot: 'bg-sky-500',
      };
    case 'Low':
      return {
        bg: 'bg-slate-50',
        text: 'text-slate-600',
        border: 'border-slate-200',
        dot: 'bg-slate-400',
      };
  }
}

export function getStatusBadgeColor(status: TaskStatus): { bg: string; text: string; border: string } {
  switch (status) {
    case 'Completed':
      return {
        bg: 'bg-emerald-50',
        text: 'text-emerald-700',
        border: 'border-emerald-200',
      };
    case 'In Progress':
      return {
        bg: 'bg-blue-50',
        text: 'text-blue-700',
        border: 'border-blue-200',
      };
    case 'To Do':
      return {
        bg: 'bg-slate-100',
        text: 'text-slate-700',
        border: 'border-slate-200',
      };
  }
}

export function getTimeOfDayBadge(timeOfDay: TimeOfDay): { label: string; iconName: string; color: string } {
  switch (timeOfDay) {
    case 'Morning':
      return { label: 'Morning Ritual', iconName: 'Sun', color: 'text-amber-600 bg-amber-50 border-amber-200' };
    case 'Afternoon':
      return { label: 'Afternoon Care', iconName: 'SunMedium', color: 'text-orange-600 bg-orange-50 border-orange-200' };
    case 'Evening':
      return { label: 'Evening Wind-down', iconName: 'Moon', color: 'text-indigo-600 bg-indigo-50 border-indigo-200' };
    case 'Anytime':
      return { label: 'Flexible / Anytime', iconName: 'Clock', color: 'text-slate-600 bg-slate-50 border-slate-200' };
  }
}

export function formatTimeAgo(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  } catch {
    return '';
  }
}

export function calculateCareScore(completedCount: number, totalCount: number, vitalsFactor = 1): number {
  if (totalCount === 0) return 100;
  const rawRatio = completedCount / totalCount;
  const score = Math.round((rawRatio * 75 + vitalsFactor * 25));
  return Math.min(100, Math.max(0, score));
}
