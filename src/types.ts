export type PriorityLevel = 'Urgent' | 'High' | 'Medium' | 'Low';
export type TaskStatus = 'To Do' | 'In Progress' | 'Completed';
export type TimeOfDay = 'Morning' | 'Afternoon' | 'Evening' | 'Anytime';
export type EnergyLevel = 'Low' | 'Medium' | 'High';
export type RecurrenceType = 'Daily' | 'Weekly' | 'Custom' | 'Once';

export interface CareTask {
  id: string;
  title: string;
  description: string;
  projectId: string;
  priority: PriorityLevel;
  status: TaskStatus;
  timeOfDay: TimeOfDay;
  durationMinutes: number;
  dueDate?: string;
  recurrence: RecurrenceType;
  tags: string[];
  completedAt?: string;
  streak: number;
  notes?: string;
  energyCost: EnergyLevel;
  createdAt: string;
}

export interface CareProject {
  id: string;
  name: string;
  description: string;
  color: string;
  icon: string;
  category: 
    | 'Physical Health'
    | 'Mental Well-being'
    | 'Skincare & Hygiene'
    | 'Medication & Vitals'
    | 'Sleep & Recovery'
    | 'Nutrition & Hydration';
  targetFrequency: string;
  createdAt: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  suggestedTasks?: Partial<CareTask>[];
  suggestedRoutine?: {
    projectName: string;
    description: string;
    tasks: Partial<CareTask>[];
  };
}

export interface DailyCareMetrics {
  date: string;
  hydrationOz: number;
  hydrationTargetOz: number;
  mindfulMinutes: number;
  mindfulTargetMinutes: number;
  sleepHours: number;
  sleepTargetHours: number;
  movementMinutes: number;
  movementTargetMinutes: number;
  overallScore: number;
  streakDays: number;
}

export interface DayLog {
  date: string;
  completedCount: number;
  totalCount: number;
  score: number;
}

export type ActiveTab = 'dashboard' | 'tasks' | 'projects' | 'priorities' | 'analytics' | 'assistant';
