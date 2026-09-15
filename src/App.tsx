/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { DashboardView } from './components/DashboardView';
import { TasksView } from './components/TasksView';
import { ProjectsView } from './components/ProjectsView';
import { PrioritiesView } from './components/PrioritiesView';
import { AnalyticsView } from './components/AnalyticsView';
import { AiAssistantView } from './components/AiAssistantView';
import { TaskModal } from './components/TaskModal';
import { SearchModal } from './components/SearchModal';
import { AiRoutineModal } from './components/AiRoutineModal';
import { Toast, ToastMessage } from './components/Toast';
import { 
  INITIAL_PROJECTS, 
  INITIAL_TASKS, 
  INITIAL_METRICS, 
  RECENT_DAY_LOGS 
} from './data/initialData';
import { 
  ActiveTab, 
  CareProject, 
  CareTask, 
  DailyCareMetrics, 
  DayLog, 
  EnergyLevel, 
  PriorityLevel, 
  TaskStatus 
} from './types';
import { calculateCareScore } from './utils/helpers';
import { Sparkles, X } from 'lucide-react';

export default function App() {
  // Local storage loaded states with fallbacks
  const [tasks, setTasks] = useState<CareTask[]>(() => {
    try {
      const saved = localStorage.getItem('careflow_tasks');
      return saved ? JSON.parse(saved) : INITIAL_TASKS;
    } catch {
      return INITIAL_TASKS;
    }
  });

  const [projects, setProjects] = useState<CareProject[]>(() => {
    try {
      const saved = localStorage.getItem('careflow_projects');
      return saved ? JSON.parse(saved) : INITIAL_PROJECTS;
    } catch {
      return INITIAL_PROJECTS;
    }
  });

  const [metrics, setMetrics] = useState<DailyCareMetrics>(() => {
    try {
      const saved = localStorage.getItem('careflow_metrics');
      return saved ? JSON.parse(saved) : INITIAL_METRICS;
    } catch {
      return INITIAL_METRICS;
    }
  });

  const [dayLogs, setDayLogs] = useState<DayLog[]>(() => {
    try {
      const saved = localStorage.getItem('careflow_day_logs');
      return saved ? JSON.parse(saved) : RECENT_DAY_LOGS;
    } catch {
      return RECENT_DAY_LOGS;
    }
  });

  const [activeTab, setActiveTab] = useState<ActiveTab>('dashboard');
  const [energyLevel, setEnergyLevel] = useState<EnergyLevel>('Medium');
  const [selectedProjectId, setSelectedProjectId] = useState<string | undefined>(undefined);

  // Modals & Drawers
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<CareTask | null>(null);
  const [taskModalDefaultProject, setTaskModalDefaultProject] = useState<string | undefined>(undefined);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [aiInitialPrompt, setAiInitialPrompt] = useState<string | undefined>(undefined);
  const [isAiRoutineModalOpen, setIsAiRoutineModalOpen] = useState(false);
  const [routinePillarTarget, setRoutinePillarTarget] = useState('Skincare & Dermatological Health');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('careflow_tasks', JSON.stringify(tasks));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [tasks]);

  useEffect(() => {
    try {
      localStorage.setItem('careflow_projects', JSON.stringify(projects));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [projects]);

  useEffect(() => {
    try {
      localStorage.setItem('careflow_metrics', JSON.stringify(metrics));
    } catch (e) {
      console.warn('LocalStorage save failed:', e);
    }
  }, [metrics]);

  // Global Keyboard Shortcuts (⌘K / Ctrl+K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Compute live care score
  const completedCount = tasks.filter((t) => t.status === 'Completed').length;
  const currentCareScore = calculateCareScore(completedCount, tasks.length);
  const activeTaskCount = tasks.filter((t) => t.status !== 'Completed').length;
  const urgentTaskCount = tasks.filter((t) => t.status !== 'Completed' && (t.priority === 'Urgent' || t.priority === 'High')).length;

  // Toggle single task completion
  const handleToggleTaskStatus = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === taskId) {
          const nextStatus: TaskStatus = t.status === 'Completed' ? 'To Do' : 'Completed';
          const nextStreak = nextStatus === 'Completed' ? t.streak + 1 : Math.max(0, t.streak - 1);
          return {
            ...t,
            status: nextStatus,
            streak: nextStreak,
            completedAt: nextStatus === 'Completed' ? new Date().toISOString() : undefined,
          };
        }
        return t;
      })
    );

    const target = tasks.find((t) => t.id === taskId);
    if (target && target.status !== 'Completed') {
      setToast({
        id: `done-${Date.now()}`,
        title: 'Routine Completed! ✨',
        description: `"${target.title}" checked off today's self-care plan.`,
        type: 'success',
      });
    }
  };

  const handleUpdateTaskStatus = (taskId: string, status: TaskStatus) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status } : t))
    );
  };

  const handleUpdateTaskPriority = (taskId: string, newPriority: PriorityLevel) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, priority: newPriority } : t))
    );
    setToast({
      id: `prio-${Date.now()}`,
      title: 'Priority Updated',
      description: `Task priority changed to ${newPriority}.`,
      type: 'info',
    });
  };

  const handleApplyBatchPriorities = (updates: { id: string; priority: PriorityLevel }[]) => {
    const updateMap = new Map(updates.map((u) => [u.id, u.priority]));
    setTasks((prev) =>
      prev.map((t) => {
        if (updateMap.has(t.id)) {
          return { ...t, priority: updateMap.get(t.id)! };
        }
        return t;
      })
    );
    setToast({
      id: `batch-${Date.now()}`,
      title: 'AI Prioritization Applied! 🌿',
      description: `${updates.length} tasks re-aligned with your current stamina & health goals.`,
      type: 'ai',
    });
  };

  const handleSaveTask = (taskData: Partial<CareTask>) => {
    if (taskData.id) {
      // Edit existing
      setTasks((prev) =>
        prev.map((t) => (t.id === taskData.id ? ({ ...t, ...taskData } as CareTask) : t))
      );
      setToast({
        id: `save-${Date.now()}`,
        title: 'Routine Updated',
        description: `"${taskData.title}" saved.`,
        type: 'info',
      });
    } else {
      // Add new
      const newTask: CareTask = {
        id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        title: taskData.title || 'New Routine',
        description: taskData.description || '',
        projectId: taskData.projectId || projects[0]?.id || 'proj-skincare',
        priority: taskData.priority || 'Medium',
        status: taskData.status || 'To Do',
        timeOfDay: taskData.timeOfDay || 'Morning',
        durationMinutes: taskData.durationMinutes || 15,
        recurrence: taskData.recurrence || 'Daily',
        tags: taskData.tags || ['Care'],
        streak: 0,
        energyCost: taskData.energyCost || 'Low',
        notes: taskData.notes || '',
        createdAt: new Date().toISOString(),
      };
      setTasks((prev) => [newTask, ...prev]);
      setToast({
        id: `add-${Date.now()}`,
        title: 'New Care Routine Added! 🌱',
        description: `"${newTask.title}" added to your care schedule.`,
        type: 'success',
      });
    }
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
    setToast({
      id: `del-${Date.now()}`,
      title: 'Task Removed',
      description: 'Routine deleted from care plan.',
      type: 'info',
    });
  };

  const handleCreateProject = (projData: Partial<CareProject>) => {
    const newProj: CareProject = {
      id: `proj-${Date.now()}`,
      name: projData.name || 'New Pillar',
      description: projData.description || '',
      color: projData.color || '#0D9488',
      icon: projData.icon || 'Layers',
      category: projData.category || 'Physical Health',
      targetFrequency: projData.targetFrequency || 'Daily',
      createdAt: new Date().toISOString(),
    };
    setProjects((prev) => [...prev, newProj]);
    setToast({
      id: `proj-${Date.now()}`,
      title: 'Care Pillar Created',
      description: `"${newProj.name}" added to your wellness foundation.`,
      type: 'success',
    });
  };

  const handleIncrementHydration = (oz: number) => {
    setMetrics((prev) => ({
      ...prev,
      hydrationOz: Math.min(160, prev.hydrationOz + oz),
    }));
    setToast({
      id: `water-${Date.now()}`,
      title: `+${oz} oz Water Logged 💧`,
      description: `Current: ${metrics.hydrationOz + oz} of ${metrics.hydrationTargetOz} oz target.`,
      type: 'success',
    });
  };

  const handleIncrementMindful = (mins: number) => {
    setMetrics((prev) => ({
      ...prev,
      mindfulMinutes: prev.mindfulMinutes + mins,
    }));
    setToast({
      id: `mind-${Date.now()}`,
      title: `+${mins} min Mindful Breath Logged 🧠`,
      description: 'Nervous system recalibrated.',
      type: 'success',
    });
  };

  const handleIncrementMovement = (mins: number) => {
    setMetrics((prev) => ({
      ...prev,
      movementMinutes: prev.movementMinutes + mins,
    }));
    setToast({
      id: `move-${Date.now()}`,
      title: `+${mins} min Movement Logged 🏃`,
      description: 'Cardiovascular & lymphatic circulation activated.',
      type: 'success',
    });
  };

  const handleOpenAiWithPrompt = (promptText: string) => {
    setAiInitialPrompt(promptText);
    setIsAiDrawerOpen(true);
  };

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col text-slate-900 font-sans selection:bg-teal-500/20 selection:text-teal-900">
      {/* Top Navigation Bar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenNewTask={() => {
          setEditingTask(null);
          setTaskModalDefaultProject(undefined);
          setIsTaskModalOpen(true);
        }}
        onOpenSearch={() => setIsSearchModalOpen(true)}
        onToggleAiDrawer={() => setIsAiDrawerOpen((prev) => !prev)}
        onToggleSidebar={() => setIsSidebarOpen((prev) => !prev)}
        streakDays={metrics.streakDays}
        careScore={currentCareScore}
        completedTodayCount={completedCount}
        totalTodayCount={tasks.length}
      />

      {/* Main Layout Body */}
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        {/* Left Responsive Navigation Sidebar */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={(tab) => {
            setActiveTab(tab);
            if (tab !== 'tasks') {
              setSelectedProjectId(undefined);
            }
          }}
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          activeTaskCount={activeTaskCount}
          urgentTaskCount={urgentTaskCount}
          projectCount={projects.length}
          energyLevel={energyLevel}
          setEnergyLevel={setEnergyLevel}
          hydrationOz={metrics.hydrationOz}
          hydrationTargetOz={metrics.hydrationTargetOz}
          sleepHours={metrics.sleepHours}
        />

        {/* Content Canvas */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 min-w-0 overflow-x-hidden">
          {activeTab === 'dashboard' && (
            <DashboardView
              tasks={tasks}
              projects={projects}
              metrics={metrics}
              energyLevel={energyLevel}
              onToggleTaskStatus={handleToggleTaskStatus}
              onOpenNewTask={() => {
                setEditingTask(null);
                setTaskModalDefaultProject(undefined);
                setIsTaskModalOpen(true);
              }}
              onOpenTaskDetails={(task) => {
                setEditingTask(task);
                setIsTaskModalOpen(true);
              }}
              onNavigateToTab={(tab) => setActiveTab(tab)}
              onOpenAiChatWithPrompt={handleOpenAiWithPrompt}
              onIncrementHydration={handleIncrementHydration}
              onIncrementMindful={handleIncrementMindful}
              onIncrementMovement={handleIncrementMovement}
            />
          )}

          {activeTab === 'tasks' && (
            <TasksView
              tasks={tasks}
              projects={projects}
              onToggleTaskStatus={handleToggleTaskStatus}
              onUpdateTaskStatus={handleUpdateTaskStatus}
              onOpenNewTask={() => {
                setEditingTask(null);
                setTaskModalDefaultProject(selectedProjectId);
                setIsTaskModalOpen(true);
              }}
              onEditTask={(task) => {
                setEditingTask(task);
                setIsTaskModalOpen(true);
              }}
              onDeleteTask={handleDeleteTask}
              onOpenAiPrioritize={() => setActiveTab('priorities')}
              selectedProjectId={selectedProjectId}
              onClearSelectedProject={() => setSelectedProjectId(undefined)}
            />
          )}

          {activeTab === 'projects' && (
            <ProjectsView
              projects={projects}
              tasks={tasks}
              onSelectProject={(projId) => {
                setSelectedProjectId(projId);
                setActiveTab('tasks');
              }}
              onCreateProject={handleCreateProject}
              onOpenNewTaskForProject={(projId) => {
                setEditingTask(null);
                setTaskModalDefaultProject(projId);
                setIsTaskModalOpen(true);
              }}
              onGenerateAiRoutine={(pillarName) => {
                setRoutinePillarTarget(pillarName);
                setIsAiRoutineModalOpen(true);
              }}
            />
          )}

          {activeTab === 'priorities' && (
            <PrioritiesView
              tasks={tasks}
              projects={projects}
              energyLevel={energyLevel}
              setEnergyLevel={setEnergyLevel}
              onToggleTaskStatus={handleToggleTaskStatus}
              onUpdateTaskPriority={handleUpdateTaskPriority}
              onApplyBatchPriorities={handleApplyBatchPriorities}
            />
          )}

          {activeTab === 'analytics' && (
            <AnalyticsView
              tasks={tasks}
              projects={projects}
              metrics={metrics}
              dayLogs={dayLogs}
            />
          )}

          {activeTab === 'assistant' && (
            <div className="space-y-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900">
                  AI Personal Care Assistant
                </h1>
                <p className="text-xs text-slate-500 mt-0.5">
                  Your empathetic routine architect, task organizer, and health progress companion.
                </p>
              </div>
              <AiAssistantView
                tasks={tasks}
                projects={projects}
                energyLevel={energyLevel}
                onAddTask={handleSaveTask}
                initialPrompt={aiInitialPrompt}
                onClearInitialPrompt={() => setAiInitialPrompt(undefined)}
              />
            </div>
          )}
        </main>
      </div>

      {/* Slide-out AI Assistant Drawer (accessible from any screen) */}
      {isAiDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div
            onClick={() => setIsAiDrawerOpen(false)}
            className="absolute inset-0 bg-slate-900/30 backdrop-blur-xs transition-opacity"
          />

          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col animate-in slide-in-from-right duration-200">
              <AiAssistantView
                tasks={tasks}
                projects={projects}
                energyLevel={energyLevel}
                onAddTask={handleSaveTask}
                isDrawer={true}
                onCloseDrawer={() => setIsAiDrawerOpen(false)}
                initialPrompt={aiInitialPrompt}
                onClearInitialPrompt={() => setAiInitialPrompt(undefined)}
              />
            </div>
          </div>
        </div>
      )}

      {/* Floating AI Action Button for quick accessibility */}
      {!isAiDrawerOpen && activeTab !== 'assistant' && (
        <button
          id="floating-ai-copilot-btn"
          onClick={() => setIsAiDrawerOpen(true)}
          className="fixed bottom-6 right-6 z-30 flex items-center gap-2 px-4 py-3 rounded-full bg-gradient-to-r from-teal-600 to-indigo-600 text-white font-bold text-xs shadow-lg shadow-teal-600/30 hover:shadow-xl hover:scale-105 transition-all group active:scale-95"
          aria-label="Open AI Assistant"
        >
          <Sparkles className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          <span className="hidden sm:inline">Ask AI Assistant</span>
        </button>
      )}

      {/* Add / Edit Task Modal */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        onSave={handleSaveTask}
        initialTask={editingTask}
        projects={projects}
        defaultProjectId={taskModalDefaultProject}
      />

      {/* Global Search Modal */}
      <SearchModal
        isOpen={isSearchModalOpen}
        onClose={() => setIsSearchModalOpen(false)}
        tasks={tasks}
        projects={projects}
        onSelectTask={(task) => {
          setEditingTask(task);
          setIsTaskModalOpen(true);
        }}
        onSelectProject={(projId) => {
          setSelectedProjectId(projId);
          setActiveTab('tasks');
        }}
      />

      {/* AI Routine Generator Modal */}
      <AiRoutineModal
        isOpen={isAiRoutineModalOpen}
        onClose={() => setIsAiRoutineModalOpen(false)}
        pillarName={routinePillarTarget}
        projects={projects}
        onAddGeneratedTasks={(newTasks) => {
          newTasks.forEach((t) => handleSaveTask(t));
          setToast({
            id: `routine-${Date.now()}`,
            title: 'Routine Package Added! ✨',
            description: `${newTasks.length} tasks scheduled for ${routinePillarTarget}.`,
            type: 'ai',
          });
        }}
      />

      {/* Action Toast Notifications */}
      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
