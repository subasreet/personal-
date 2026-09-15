import React, { useState } from 'react';
import { 
  Plus, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  Brain, 
  Activity, 
  Pill, 
  Moon, 
  Droplets, 
  X,
  Check
} from 'lucide-react';
import { CareProject, CareTask } from '../types';

interface ProjectsViewProps {
  projects: CareProject[];
  tasks: CareTask[];
  onSelectProject: (projectId: string) => void;
  onCreateProject: (project: Partial<CareProject>) => void;
  onOpenNewTaskForProject: (projectId: string) => void;
  onGenerateAiRoutine: (pillarName: string) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({
  projects,
  tasks,
  onSelectProject,
  onCreateProject,
  onOpenNewTaskForProject,
  onGenerateAiRoutine,
}) => {
  const [isCreatingProject, setIsCreatingProject] = useState(false);
  const [projectName, setProjectName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<CareProject['category']>('Physical Health');
  const [color, setColor] = useState('#0D9488');
  const [targetFrequency, setTargetFrequency] = useState('Daily');

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectName.trim()) return;

    onCreateProject({
      name: projectName.trim(),
      description: description.trim(),
      category,
      color,
      targetFrequency,
      icon: 'Layers',
    });

    setProjectName('');
    setDescription('');
    setIsCreatingProject(false);
  };

  const getPillarIcon = (categoryName: string) => {
    switch (categoryName) {
      case 'Physical Health':
        return Activity;
      case 'Mental Well-being':
        return Brain;
      case 'Medication & Vitals':
        return Pill;
      case 'Sleep & Recovery':
        return Moon;
      case 'Nutrition & Hydration':
        return Droplets;
      default:
        return Sparkles;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-display text-slate-900 flex items-center gap-2.5">
            <span>Care Pillars & Projects</span>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-teal-50 text-teal-800 border border-teal-200 font-semibold">
              {projects.length} Pillars
            </span>
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            The fundamental domains of your physical health, mental calm, and daily vitality.
          </p>
        </div>

        <button
          id="new-pillar-btn"
          onClick={() => setIsCreatingProject(true)}
          className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-sm active:scale-[0.98] self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>New Care Pillar</span>
        </button>
      </div>

      {/* Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {projects.map((proj) => {
          const projectTasks = tasks.filter((t) => t.projectId === proj.id);
          const completedCount = projectTasks.filter((t) => t.status === 'Completed').length;
          const ratio = projectTasks.length > 0 
            ? Math.round((completedCount / projectTasks.length) * 100) 
            : 0;
          const IconComp = getPillarIcon(proj.category);

          return (
            <div
              key={proj.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all p-5 flex flex-col justify-between space-y-4 group"
            >
              {/* Header */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-white shadow-xs"
                    style={{ backgroundColor: proj.color }}
                  >
                    <IconComp className="w-5 h-5" />
                  </div>

                  <span className="text-[11px] font-semibold text-slate-500 px-2 py-0.5 rounded-full bg-slate-100">
                    {proj.targetFrequency}
                  </span>
                </div>

                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display group-hover:text-teal-900 transition-colors">
                    {proj.name}
                  </h3>
                  <span className="text-[11px] font-medium text-slate-400 block mt-0.5">
                    {proj.category}
                  </span>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                    {proj.description}
                  </p>
                </div>
              </div>

              {/* Progress Bar & Stats */}
              <div className="space-y-1.5 pt-2 border-t border-slate-100">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Daily Adherence</span>
                  <span className="font-bold text-slate-800">
                    {completedCount}/{projectTasks.length} ({ratio}%)
                  </span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${ratio}%`,
                      backgroundColor: proj.color,
                    }}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-1">
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => onSelectProject(proj.id)}
                    className="flex items-center justify-center gap-1.5 py-1.5 px-3 text-xs font-semibold text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-xl border border-slate-200 transition-colors"
                  >
                    <span>View Tasks</span>
                    <ArrowRight className="w-3 h-3 text-slate-400" />
                  </button>

                  <button
                    onClick={() => onOpenNewTaskForProject(proj.id)}
                    className="flex items-center justify-center gap-1 py-1.5 px-3 text-xs font-semibold text-teal-800 bg-teal-50 hover:bg-teal-100 rounded-xl border border-teal-200 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Task</span>
                  </button>
                </div>

                {/* AI Routine Generator Trigger for this Pillar */}
                <button
                  onClick={() => onGenerateAiRoutine(proj.name)}
                  className="w-full flex items-center justify-center gap-1.5 py-1.5 px-3 text-[11px] font-semibold text-indigo-900 bg-indigo-50/70 hover:bg-indigo-100 rounded-xl border border-indigo-200/70 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                  <span>AI Generate Routine for this Pillar</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Modal: Create Care Pillar */}
      {isCreatingProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
              <h2 className="text-base font-bold text-slate-900 font-display">
                Create New Care Pillar
              </h2>
              <button
                onClick={() => setIsCreatingProject(false)}
                className="p-1 text-slate-400 hover:text-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Pillar Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Ergonomics & Spinal Health"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Description & Health Target
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Posture resets, cervical spine traction, and ergonomic standing intervals."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500"
                  >
                    <option value="Physical Health">Physical Health</option>
                    <option value="Mental Well-being">Mental Well-being</option>
                    <option value="Skincare & Hygiene">Skincare & Hygiene</option>
                    <option value="Medication & Vitals">Medication & Vitals</option>
                    <option value="Sleep & Recovery">Sleep & Recovery</option>
                    <option value="Nutrition & Hydration">Nutrition & Hydration</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                    Frequency
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Daily, 3x Weekly"
                    value={targetFrequency}
                    onChange={(e) => setTargetFrequency(e.target.value)}
                    className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Accent Color
                </label>
                <div className="flex items-center gap-2">
                  {['#0D9488', '#6366F1', '#F97316', '#E11D48', '#0284C7', '#16A34A', '#8B5CF6'].map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setColor(c)}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${
                        color === c ? 'scale-110 border-slate-900 shadow-xs' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreatingProject(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-xs"
                >
                  <Check className="w-4 h-4" />
                  <span>Create Pillar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
