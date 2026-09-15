import React, { useState, useMemo } from 'react';
import { Search, X, CheckSquare, Layers, ArrowRight } from 'lucide-react';
import { CareProject, CareTask, PriorityLevel, TaskStatus } from '../types';
import { getPriorityBadgeColor, getStatusBadgeColor } from '../utils/helpers';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  tasks: CareTask[];
  projects: CareProject[];
  onSelectTask: (task: CareTask) => void;
  onSelectProject: (projectId: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  tasks,
  projects,
  onSelectTask,
  onSelectProject,
}) => {
  const [query, setQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const filteredResults = useMemo(() => {
    const q = query.toLowerCase().trim();

    const matchedTasks = tasks.filter((task) => {
      const matchQuery =
        !q ||
        task.title.toLowerCase().includes(q) ||
        (task.description && task.description.toLowerCase().includes(q)) ||
        (task.tags && task.tags.some((t) => t.toLowerCase().includes(q))) ||
        (task.notes && task.notes.toLowerCase().includes(q));

      const matchPriority = priorityFilter === 'all' || task.priority === priorityFilter;
      const matchStatus = statusFilter === 'all' || task.status === statusFilter;

      return matchQuery && matchPriority && matchStatus;
    });

    const matchedProjects = !q
      ? projects
      : projects.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.description.toLowerCase().includes(q) ||
            p.category.toLowerCase().includes(q)
        );

    return {
      tasks: matchedTasks,
      projects: matchedProjects,
    };
  }, [query, priorityFilter, statusFilter, tasks, projects]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-slate-900/40 backdrop-blur-xs">
      <div 
        className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[80vh] animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Search Input Box */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-slate-200 bg-slate-50/70">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input
            id="search-modal-input"
            type="text"
            autoFocus
            placeholder="Search care routines, supplements, pillars, tags..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-sm bg-transparent border-none focus:outline-none text-slate-900 placeholder:text-slate-400"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-600 text-xs px-1.5 py-0.5"
            >
              Clear
            </button>
          )}
          <button
            id="search-modal-close-btn"
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Filter Bar */}
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-50 border-b border-slate-100 overflow-x-auto text-xs">
          <span className="text-slate-400 font-medium">Priority:</span>
          {['all', 'Urgent', 'High', 'Medium', 'Low'].map((p) => (
            <button
              key={p}
              onClick={() => setPriorityFilter(p)}
              className={`px-2 py-0.5 rounded-full font-medium transition-colors ${
                priorityFilter === p
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {p === 'all' ? 'All' : p}
            </button>
          ))}

          <span className="text-slate-400 font-medium ml-2">Status:</span>
          {['all', 'To Do', 'In Progress', 'Completed'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-2 py-0.5 rounded-full font-medium transition-colors ${
                statusFilter === s
                  ? 'bg-teal-700 text-white'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>

        {/* Search Results List */}
        <div className="p-4 overflow-y-auto space-y-5 flex-1">
          {/* Projects Results */}
          {filteredResults.projects.length > 0 && (
            <div>
              <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-teal-600" />
                Care Pillars ({filteredResults.projects.length})
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {filteredResults.projects.map((proj) => (
                  <button
                    key={proj.id}
                    onClick={() => {
                      onSelectProject(proj.id);
                      onClose();
                    }}
                    className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 hover:border-teal-300 hover:bg-teal-50/30 text-left transition-all group"
                  >
                    <div className="flex items-center gap-2.5 truncate">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: proj.color }}
                      />
                      <span className="text-xs font-semibold text-slate-800 truncate group-hover:text-teal-900">
                        {proj.name}
                      </span>
                    </div>
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-teal-600 shrink-0" />
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tasks Results */}
          <div>
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <CheckSquare className="w-3.5 h-3.5 text-teal-600" />
              Care Tasks ({filteredResults.tasks.length})
            </div>

            {filteredResults.tasks.length === 0 ? (
              <div className="text-center py-8 text-slate-400 text-xs">
                No matching care routines found for "{query}". Try another keyword or reset filters.
              </div>
            ) : (
              <div className="space-y-1.5">
                {filteredResults.tasks.map((task) => {
                  const pBadge = getPriorityBadgeColor(task.priority);
                  const sBadge = getStatusBadgeColor(task.status);
                  const project = projects.find((p) => p.id === task.projectId);

                  return (
                    <div
                      key={task.id}
                      onClick={() => {
                        onSelectTask(task);
                        onClose();
                      }}
                      className="p-3 rounded-xl border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/80 cursor-pointer transition-all flex items-start justify-between gap-3 group"
                    >
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
                            <span className="text-[11px] text-slate-500 font-medium">
                              • {project.name}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400">
                            • {task.timeOfDay} ({task.durationMinutes}m)
                          </span>
                        </div>
                        <h4 className="text-xs font-semibold text-slate-900 group-hover:text-teal-800 transition-colors">
                          {task.title}
                        </h4>
                        {task.description && (
                          <p className="text-[11px] text-slate-500 line-clamp-1">
                            {task.description}
                          </p>
                        )}
                      </div>

                      <span className="text-xs font-semibold text-slate-400 group-hover:text-slate-800 shrink-0">
                        View →
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
          <span>Click on any result to inspect or edit</span>
          <span>ESC to close</span>
        </div>
      </div>
    </div>
  );
};
