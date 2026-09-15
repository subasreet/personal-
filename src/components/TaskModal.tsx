import React, { useState, useEffect } from 'react';
import { X, Check } from 'lucide-react';
import { CareProject, CareTask, EnergyLevel, PriorityLevel, RecurrenceType, TaskStatus, TimeOfDay } from '../types';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<CareTask>) => void;
  initialTask?: CareTask | null;
  projects: CareProject[];
  defaultProjectId?: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialTask,
  projects,
  defaultProjectId,
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [projectId, setProjectId] = useState('');
  const [priority, setPriority] = useState<PriorityLevel>('Medium');
  const [status, setStatus] = useState<TaskStatus>('To Do');
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('Morning');
  const [durationMinutes, setDurationMinutes] = useState(15);
  const [recurrence, setRecurrence] = useState<RecurrenceType>('Daily');
  const [energyCost, setEnergyCost] = useState<EnergyLevel>('Low');
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || '');
      setProjectId(initialTask.projectId);
      setPriority(initialTask.priority);
      setStatus(initialTask.status);
      setTimeOfDay(initialTask.timeOfDay);
      setDurationMinutes(initialTask.durationMinutes);
      setRecurrence(initialTask.recurrence);
      setEnergyCost(initialTask.energyCost);
      setTags(initialTask.tags || []);
      setNotes(initialTask.notes || '');
    } else {
      setTitle('');
      setDescription('');
      setProjectId(defaultProjectId || projects[0]?.id || '');
      setPriority('Medium');
      setStatus('To Do');
      setTimeOfDay('Morning');
      setDurationMinutes(15);
      setRecurrence('Daily');
      setEnergyCost('Low');
      setTags(['Wellness']);
      setNotes('');
    }
  }, [initialTask, isOpen, projects, defaultProjectId]);

  if (!isOpen) return null;

  const handleAddTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    onSave({
      id: initialTask?.id,
      title: title.trim(),
      description: description.trim(),
      projectId: projectId || projects[0]?.id || 'proj-skincare',
      priority,
      status,
      timeOfDay,
      durationMinutes: Number(durationMinutes) || 15,
      recurrence,
      energyCost,
      tags,
      notes: notes.trim(),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-xs">
      <div 
        className="bg-white w-full max-w-xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-150"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-slate-50/50">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-display">
              {initialTask ? 'Edit Care Task' : 'New Personal Care Task'}
            </h2>
            <p className="text-xs text-slate-500">
              Set schedules, priorities, and care pillars for your daily wellness.
            </p>
          </div>
          <button
            id="close-task-modal-btn"
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Task / Routine Title *
            </label>
            <input
              id="task-title-input"
              type="text"
              required
              placeholder="e.g. Morning 10-minute Sun & Hydration Ritual"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Instructions & Care Benefit
            </label>
            <textarea
              id="task-description-input"
              rows={2}
              placeholder="e.g. Drink 500ml water with pinch of electrolytes, view sunlight without sunglasses to anchor circadian clock."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 transition-all text-slate-900 placeholder:text-slate-400"
            />
          </div>

          {/* Row: Care Project & Time of Day */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Care Pillar / Project
              </label>
              <select
                id="task-project-select"
                value={projectId}
                onChange={(e) => setProjectId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Time of Day
              </label>
              <select
                id="task-time-select"
                value={timeOfDay}
                onChange={(e) => setTimeOfDay(e.target.value as TimeOfDay)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900"
              >
                <option value="Morning">Morning Ritual</option>
                <option value="Afternoon">Afternoon Care</option>
                <option value="Evening">Evening Wind-down</option>
                <option value="Anytime">Anytime / Flexible</option>
              </select>
            </div>
          </div>

          {/* Row: Priority & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Priority Level
              </label>
              <div className="grid grid-cols-4 gap-1">
                {(['Urgent', 'High', 'Medium', 'Low'] as PriorityLevel[]).map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setPriority(p)}
                    className={`py-1.5 px-2 text-xs rounded-lg font-semibold border transition-all text-center ${
                      priority === p
                        ? p === 'Urgent'
                          ? 'bg-rose-50 text-rose-800 border-rose-300'
                          : p === 'High'
                          ? 'bg-amber-50 text-amber-800 border-amber-300'
                          : p === 'Medium'
                          ? 'bg-sky-50 text-sky-800 border-sky-300'
                          : 'bg-slate-100 text-slate-800 border-slate-300'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Status
              </label>
              <select
                id="task-status-select"
                value={status}
                onChange={(e) => setStatus(e.target.value as TaskStatus)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900"
              >
                <option value="To Do">To Do</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>
          </div>

          {/* Row: Duration, Recurrence, Energy Cost */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Duration (mins)
              </label>
              <input
                id="task-duration-input"
                type="number"
                min={1}
                max={180}
                value={durationMinutes}
                onChange={(e) => setDurationMinutes(parseInt(e.target.value) || 5)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Recurrence
              </label>
              <select
                id="task-recurrence-select"
                value={recurrence}
                onChange={(e) => setRecurrence(e.target.value as RecurrenceType)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900"
              >
                <option value="Daily">Daily Routine</option>
                <option value="Weekly">Weekly Task</option>
                <option value="Once">One-off Item</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Energy Cost
              </label>
              <select
                id="task-energy-select"
                value={energyCost}
                onChange={(e) => setEnergyCost(e.target.value as EnergyLevel)}
                className="w-full px-3 py-2 text-sm bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900"
              >
                <option value="Low">Low (Effortless)</option>
                <option value="Medium">Medium (Moderate)</option>
                <option value="High">High (High Focus)</option>
              </select>
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
              Care Tags
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
                >
                  #{tag}
                  <button
                    type="button"
                    onClick={() => handleRemoveTag(tag)}
                    className="text-slate-400 hover:text-slate-700 ml-0.5"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                id="task-tag-input"
                type="text"
                placeholder="Add tag (e.g. Skin, Recovery, Vitals)"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddTag();
                  }
                }}
                className="flex-1 px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
              <button
                type="button"
                onClick={handleAddTag}
                className="px-3 py-1.5 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Action buttons */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-2.5">
            <button
              id="cancel-task-modal-btn"
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              id="save-task-modal-btn"
              type="submit"
              className="flex items-center gap-1.5 px-5 py-2 text-xs font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-sm shadow-teal-600/20 transition-all"
            >
              <Check className="w-4 h-4" />
              <span>{initialTask ? 'Update Task' : 'Save Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
