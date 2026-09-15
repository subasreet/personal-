import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Search, 
  Filter, 
  CheckCircle2, 
  Circle, 
  Clock, 
  Flame, 
  Trash2, 
  Edit3, 
  Sparkles,
  LayoutGrid,
  List as ListIcon
} from 'lucide-react';
import { CareProject, CareTask, PriorityLevel, TaskStatus, TimeOfDay } from '../types';
import { getPriorityBadgeColor, getStatusBadgeColor } from '../utils/helpers';

interface TasksViewProps {
  tasks: CareTask[];
  projects: CareProject[];
  onToggleTaskStatus: (taskId: string) => void;
  onUpdateTaskStatus: (taskId: string, status: TaskStatus) => void;
  onOpenNewTask: () => void;
  onEditTask: (task: CareTask) => void;
  onDeleteTask: (taskId: string) => void;
  onOpenAiPrioritize: () => void;
  selectedProjectId?: string;
  onClearSelectedProject?: () => void;
}

export const TasksView: React.FC<TasksViewProps> = ({
  tasks,
  projects,
  onToggleTaskStatus,
  onUpdateTaskStatus,
  onOpenNewTask,
  onEditTask,
  onDeleteTask,
  onOpenAiPrioritize,
  selectedProjectId,
  onClearSelectedProject,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterProject, setFilterProject] = useState<string>(selectedProjectId || 'all');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterTime, setFilterTime] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'columns'>('list');
  const [quickTitle, setQuickTitle] = useState('');

  // Sync if selectedProjectId changes from outside
  React.useEffect(() => {
    if (selectedProjectId) {
      setFilterProject(selectedProjectId);
    }
  }, [selectedProjectId]);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchSearch =
        !searchQuery ||
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchProject = filterProject === 'all' || task.projectId === filterProject;
      const matchPriority = filterPriority === 'all' || task.priority === filterPriority;
      const matchStatus = filterStatus === 'all' || task.status === filterStatus;
      const matchTime = filterTime === 'all' || task.timeOfDay === filterTime;

      return matchSearch && matchProject && matchPriority && matchStatus && matchTime;
    });
  }, [tasks, searchQuery, filterProject, filterPriority, filterStatus, filterTime]);

  const handleQuickAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickTitle.trim()) return;

    onEditTask({
      id: '',
      title: quickTitle.trim(),
      description: '',
      projectId: filterProject !== 'all' ? filterProject : projects[0]?.id || 'proj-skincare',
      priority: 'Medium',
      status: 'To Do',
      timeOfDay: 'Morning',
      durationMinutes: 15,
      recurrence: 'Daily',
      tags: ['Care'],
      streak: 0,
      energyCost: 'Low',
      createdAt: new Date().toISOString(),
    });
    setQuickTitle('');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900 flex items-center gap-2.5">
            <span>Care Tasks & Routines</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 font-semibold">
              {filteredTasks.length} {filteredTasks.length === 1 ? 'routine' : 'routines'}
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your daily personal care cadence, medical adherence, and recovery rituals.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* AI Prioritize button */}
          <button
            id="tasks-ai-prioritize-btn"
            onClick={onOpenAiPrioritize}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-teal-900 bg-teal-50 hover:bg-teal-100 border border-teal-200 rounded-xl transition-all shadow-2xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-teal-600" />
            <span>AI Prioritize</span>
          </button>

          {/* New Task button */}
          <button
            id="tasks-add-task-btn"
            onClick={onOpenNewTask}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm active:scale-[0.98]"
          >
            <Plus className="w-4 h-4" />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Quick Add Input Bar */}
      <form
        onSubmit={handleQuickAdd}
        className="flex items-center gap-2 p-2 bg-white rounded-2xl border border-slate-200 shadow-2xs"
      >
        <Plus className="w-4 h-4 text-slate-400 ml-2 shrink-0" />
        <input
          id="quick-task-title-input"
          type="text"
          placeholder="Quick add routine (e.g. 15 min neck mobility stretch, evening herbal tea)... Press Enter"
          value={quickTitle}
          onChange={(e) => setQuickTitle(e.target.value)}
          className="flex-1 text-xs sm:text-sm bg-transparent border-none focus:outline-none text-slate-900 placeholder:text-slate-400"
        />
        <button
          type="submit"
          disabled={!quickTitle.trim()}
          className="px-3.5 py-1.5 text-xs font-semibold rounded-xl bg-teal-600 disabled:opacity-40 text-white hover:bg-teal-700 transition-colors shadow-2xs"
        >
          Add
        </button>
      </form>

      {/* Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              id="tasks-search-input"
              type="text"
              placeholder="Search routines, tags, notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* View mode toggle */}
          <div className="flex items-center gap-1.5 self-end md:self-auto">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-all ${
                viewMode === 'list'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
              title="List View"
            >
              <ListIcon className="w-4 h-4" />
              <span className="hidden sm:inline">List</span>
            </button>
            <button
              onClick={() => setViewMode('columns')}
              className={`p-1.5 rounded-lg border text-xs flex items-center gap-1 transition-all ${
                viewMode === 'columns'
                  ? 'bg-slate-900 text-white border-slate-900 shadow-2xs'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
              title="Board View"
            >
              <LayoutGrid className="w-4 h-4" />
              <span className="hidden sm:inline">Board</span>
            </button>
          </div>
        </div>

        {/* Filter Dropdowns & Pills */}
        <div className="flex items-center gap-2 flex-wrap pt-1 text-xs border-t border-slate-100">
          <span className="text-slate-400 font-medium flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" /> Filters:
          </span>

          {/* Project Filter */}
          <select
            id="filter-project-select"
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
            className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
          >
            <option value="all">All Care Pillars</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            id="filter-priority-select"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
          >
            <option value="all">All Priorities</option>
            <option value="Urgent">Urgent</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>

          {/* Status Filter */}
          <select
            id="filter-status-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
          >
            <option value="all">All Statuses</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </select>

          {/* Time of Day Filter */}
          <select
            id="filter-time-select"
            value={filterTime}
            onChange={(e) => setFilterTime(e.target.value)}
            className="px-2.5 py-1 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-700 focus:outline-none"
          >
            <option value="all">All Times of Day</option>
            <option value="Morning">Morning</option>
            <option value="Afternoon">Afternoon</option>
            <option value="Evening">Evening</option>
            <option value="Anytime">Anytime</option>
          </select>

          {/* Active project pill with reset */}
          {filterProject !== 'all' && (
            <button
              onClick={() => {
                setFilterProject('all');
                if (onClearSelectedProject) onClearSelectedProject();
              }}
              className="px-2 py-0.5 text-[11px] font-semibold text-teal-800 bg-teal-50 border border-teal-200 rounded-md hover:bg-teal-100 transition-colors"
            >
              Reset Pillar ×
            </button>
          )}
        </div>
      </div>

      {/* Task List or Kanban Board View */}
      {viewMode === 'list' ? (
        <div className="space-y-2.5">
          {filteredTasks.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">No care tasks found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                No tasks match your current filter criteria. Try clearing filters or create a new routine.
              </p>
              <button
                onClick={onOpenNewTask}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-teal-600 hover:bg-teal-700 rounded-xl transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Task</span>
              </button>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                projects={projects}
                onToggleStatus={() => onToggleTaskStatus(task.id)}
                onEdit={() => onEditTask(task)}
                onDelete={() => onDeleteTask(task.id)}
              />
            ))
          )}
        </div>
      ) : (
        /* Board / Kanban View */
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {(['To Do', 'In Progress', 'Completed'] as TaskStatus[]).map((status) => {
            const statusTasks = filteredTasks.filter((t) => t.status === status);
            const badgeColor = getStatusBadgeColor(status);

            return (
              <div key={status} className="bg-slate-100/70 rounded-2xl p-4 border border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md border ${badgeColor.bg} ${badgeColor.text} ${badgeColor.border}`}
                    >
                      {status}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      {statusTasks.length}
                    </span>
                  </div>
                </div>

                <div className="space-y-2.5 min-h-[150px]">
                  {statusTasks.length === 0 ? (
                    <div className="h-24 rounded-xl border border-dashed border-slate-300 flex items-center justify-center text-xs text-slate-400">
                      Empty
                    </div>
                  ) : (
                    statusTasks.map((task) => (
                      <div
                        key={task.id}
                        className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-sm transition-all space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h4 className="text-xs font-semibold text-slate-900 leading-snug">
                            {task.title}
                          </h4>
                          <button
                            onClick={() => onToggleTaskStatus(task.id)}
                            className="text-slate-400 hover:text-teal-600 transition-colors shrink-0"
                          >
                            {task.status === 'Completed' ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                            ) : (
                              <Circle className="w-4 h-4" />
                            )}
                          </button>
                        </div>

                        {task.description && (
                          <p className="text-[11px] text-slate-500 line-clamp-2">
                            {task.description}
                          </p>
                        )}

                        <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-[10px]">
                          <span
                            className={`font-bold px-1.5 py-0.5 rounded border ${
                              getPriorityBadgeColor(task.priority).bg
                            } ${getPriorityBadgeColor(task.priority).text} ${
                              getPriorityBadgeColor(task.priority).border
                            }`}
                          >
                            {task.priority}
                          </span>
                          <span className="text-slate-400">
                            {task.timeOfDay} • {task.durationMinutes}m
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

interface TaskCardProps {
  task: CareTask;
  projects: CareProject[];
  onToggleStatus: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  projects,
  onToggleStatus,
  onEdit,
  onDelete,
}) => {
  const isDone = task.status === 'Completed';
  const project = projects.find((p) => p.id === task.projectId);
  const pBadge = getPriorityBadgeColor(task.priority);
  const sBadge = getStatusBadgeColor(task.status);

  return (
    <div
      className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group ${
        isDone
          ? 'bg-slate-50/60 border-slate-200/80 text-slate-400'
          : 'bg-white border-slate-200 hover:border-slate-300 hover:shadow-2xs text-slate-900'
      }`}
    >
      {/* Left: Checkbox + Title + Description */}
      <div className="flex items-start gap-3.5 min-w-0 flex-1">
        <button
          onClick={onToggleStatus}
          className="mt-0.5 text-slate-300 hover:text-teal-600 transition-colors shrink-0"
          aria-label={isDone ? 'Mark uncompleted' : 'Mark completed'}
        >
          {isDone ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-500 fill-emerald-100" />
          ) : (
            <Circle className="w-5 h-5 text-slate-400 hover:text-teal-600" />
          )}
        </button>

        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${pBadge.bg} ${pBadge.text} ${pBadge.border}`}
            >
              {task.priority}
            </span>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border ${sBadge.bg} ${sBadge.text} ${sBadge.border}`}
            >
              {task.status}
            </span>
            {project && (
              <span className="flex items-center gap-1 text-[11px] text-slate-600 font-medium">
                <span
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: project.color }}
                />
                {project.name}
              </span>
            )}
          </div>

          <h3
            className={`text-sm font-semibold transition-colors ${
              isDone ? 'line-through text-slate-400' : 'text-slate-900 group-hover:text-teal-900'
            }`}
          >
            {task.title}
          </h3>

          {task.description && (
            <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
              {task.description}
            </p>
          )}

          {/* Metadata tags */}
          <div className="flex items-center gap-3 pt-1 text-[11px] text-slate-400 flex-wrap">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {task.timeOfDay} ({task.durationMinutes} min)
            </span>
            <span>•</span>
            <span>Energy: {task.energyCost}</span>
            {task.streak > 0 && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-600 font-semibold">
                  <Flame className="w-3.5 h-3.5 fill-amber-500" />
                  {task.streak}-day streak
                </span>
              </>
            )}
            {task.tags?.map((t) => (
              <span
                key={t}
                className="px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 text-[10px] font-medium"
              >
                #{t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1 self-end sm:self-center shrink-0 border-t sm:border-t-0 pt-2 sm:pt-0">
        <button
          onClick={onEdit}
          className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          title="Edit task"
        >
          <Edit3 className="w-4 h-4" />
        </button>
        <button
          onClick={onDelete}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
          title="Delete task"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
