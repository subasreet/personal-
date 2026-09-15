import React, { useState } from 'react';
import { Sparkles, X, Check, RefreshCw, Plus, Clock } from 'lucide-react';
import { CareProject, CareTask } from '../types';

interface AiRoutineModalProps {
  isOpen: boolean;
  onClose: () => void;
  pillarName: string;
  projects: CareProject[];
  onAddGeneratedTasks: (tasks: Partial<CareTask>[]) => void;
}

export const AiRoutineModal: React.FC<AiRoutineModalProps> = ({
  isOpen,
  onClose,
  pillarName,
  projects,
  onAddGeneratedTasks,
}) => {
  const [userGoal, setUserGoal] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedRoutine, setGeneratedRoutine] = useState<{
    projectName: string;
    description: string;
    tasks: Partial<CareTask>[];
  } | null>(null);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/ai/generate-routine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          goal: userGoal || `Optimize ${pillarName}`,
          targetPillar: pillarName,
        }),
      });

      const data = await response.json();
      setGeneratedRoutine(data);
    } catch (err) {
      console.error('Failed to generate routine:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyAll = () => {
    if (!generatedRoutine || !generatedRoutine.tasks) return;
    const targetProject = projects.find((p) => p.name === pillarName) || projects[0];

    const tasksWithProject = generatedRoutine.tasks.map((t) => ({
      ...t,
      projectId: targetProject?.id || 'proj-skincare',
      status: 'To Do' as const,
      streak: 0,
      createdAt: new Date().toISOString(),
    }));

    onAddGeneratedTasks(tasksWithProject);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-600 border border-teal-200 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm sm:text-base font-bold text-slate-900 font-display">
                AI Routine Architect: {pillarName}
              </h2>
              <p className="text-xs text-slate-500">
                Generate high-impact self-care habits calibrated for your target outcome.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1">
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              What specific wellness goal would you like to achieve?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. Alleviate desk neck tightness, deeper slow-wave sleep, or calm morning focus..."
                value={userGoal}
                onChange={(e) => setUserGoal(e.target.value)}
                className="flex-1 px-3.5 py-2 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
              <button
                onClick={handleGenerate}
                disabled={isLoading}
                className="px-4 py-2 text-xs font-bold bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white rounded-xl shadow-xs transition-colors flex items-center gap-1.5 shrink-0"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Designing...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Generate</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Preset Inspirations */}
          <div className="flex items-center gap-1.5 flex-wrap text-xs">
            <span className="text-slate-400 text-[11px] font-medium">Try goal:</span>
            {[
              'Desk Neck & Posture Relief',
              'Deep REM Sleep Protocol',
              'Gentle Morning Awakening',
              'Gut Hydration Balance',
            ].map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => setUserGoal(preset)}
                className="px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 hover:bg-slate-200 text-[11px] transition-colors"
              >
                {preset}
              </button>
            ))}
          </div>

          {/* Generated Result Preview */}
          {generatedRoutine && (
            <div className="p-4 rounded-2xl bg-teal-50/40 border border-teal-200/80 space-y-3 animate-in fade-in">
              <div>
                <h3 className="text-xs font-bold text-teal-950 uppercase tracking-wider">
                  {generatedRoutine.projectName}
                </h3>
                <p className="text-xs text-teal-800 mt-0.5">{generatedRoutine.description}</p>
              </div>

              <div className="space-y-2">
                {generatedRoutine.tasks.map((task, idx) => (
                  <div
                    key={idx}
                    className="p-3 bg-white rounded-xl border border-teal-200/70 shadow-2xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold text-slate-900">{task.title}</h4>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-teal-50 text-teal-800 border border-teal-200">
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500">{task.description}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 pt-0.5">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {task.durationMinutes} mins
                      </span>
                      <span>•</span>
                      <span>{task.timeOfDay}</span>
                    </div>
                  </div>
                ))}
              </div>

              <button
                onClick={handleApplyAll}
                className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs shadow-xs transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add All {generatedRoutine.tasks.length} Routines to My Plan</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
