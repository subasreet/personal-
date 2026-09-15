import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  Send, 
  Sparkles, 
  User, 
  RefreshCw, 
  Plus, 
  Check, 
  Copy, 
  Clock, 
  Flame, 
  ShieldCheck,
  X
} from 'lucide-react';
import { CareProject, CareTask, ChatMessage, EnergyLevel } from '../types';

interface AiAssistantViewProps {
  tasks: CareTask[];
  projects: CareProject[];
  energyLevel: EnergyLevel;
  onAddTask: (task: Partial<CareTask>) => void;
  isDrawer?: boolean;
  onCloseDrawer?: () => void;
  initialPrompt?: string;
  onClearInitialPrompt?: () => void;
}

export const AiAssistantView: React.FC<AiAssistantViewProps> = ({
  tasks,
  projects,
  energyLevel,
  onAddTask,
  isDrawer = false,
  onCloseDrawer,
  initialPrompt,
  onClearInitialPrompt,
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-1',
      role: 'assistant',
      content: `Hello! I'm **Aura**, your AI Personal Care Assistant. 🌿\n\nI can help you:\n- **Organize & schedule** daily wellness and care routines\n- **Prioritize** tasks according to your current energy level (${energyLevel})\n- **Summarize** your care habits and consistency\n- **Deconstruct** wellness goals into achievable micro-habits\n\nHow can I support your well-being today?`,
      timestamp: new Date().toISOString(),
    },
  ]);

  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [addedTaskMap, setAddedTaskMap] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Handle external initial prompt if provided
  useEffect(() => {
    if (initialPrompt && initialPrompt.trim()) {
      handleSendMessage(initialPrompt);
      if (onClearInitialPrompt) onClearInitialPrompt();
    }
  }, [initialPrompt]);

  const handleSendMessage = async (textToSend?: string) => {
    const query = (textToSend || inputMessage).trim();
    if (!query || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: query,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const completionRate = tasks.length > 0 
        ? Math.round((tasks.filter((t) => t.status === 'Completed').length / tasks.length) * 100) 
        : 0;

      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages, userMsg].map((m) => ({
            role: m.role,
            content: m.content,
          })),
          userContext: {
            tasks: tasks.slice(0, 10).map((t) => ({
              id: t.id,
              title: t.title,
              priority: t.priority,
              status: t.status,
              timeOfDay: t.timeOfDay,
            })),
            projects: projects.map((p) => p.name),
            completionRate,
            currentEnergy: energyLevel,
          },
        }),
      });

      const data = await response.json();
      const replyText = data.reply || "I'm here to support your self-care. Could you tell me a bit more?";

      // Check if response contains actionable routine suggestions
      const suggestedTasks: Partial<CareTask>[] = [];
      if (query.toLowerCase().includes('morning') || query.toLowerCase().includes('routine') || query.toLowerCase().includes('add task')) {
        suggestedTasks.push({
          title: 'Morning 500ml Hydration & Deep Belly Breathing',
          description: 'Rehydrate cells and take 5 slow diaphragmatic breaths upon waking.',
          priority: 'High',
          timeOfDay: 'Morning',
          durationMinutes: 5,
          projectId: projects[0]?.id || 'proj-skincare',
          tags: ['Morning', 'Hydration'],
        });
      }

      const assistantMsg: ChatMessage = {
        id: `assistant-${Date.now()}`,
        role: 'assistant',
        content: replyText,
        timestamp: new Date().toISOString(),
        suggestedTasks: suggestedTasks.length > 0 ? suggestedTasks : undefined,
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err-${Date.now()}`,
          role: 'assistant',
          content: "I'm having trouble connecting to the care network right now. Please try again in a moment.",
          timestamp: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSuggestedTask = (task: Partial<CareTask>, idx: number) => {
    onAddTask(task);
    setAddedTaskMap((prev) => ({ ...prev, [`${task.title}-${idx}`]: true }));
  };

  return (
    <div
      className={`flex flex-col bg-white border border-slate-200 rounded-2xl shadow-2xs overflow-hidden ${
        isDrawer ? 'h-full' : 'h-[calc(100vh-130px)]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100 bg-slate-50/70">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-teal-600 to-indigo-600 flex items-center justify-center text-white shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-bold text-slate-900 font-display">Aura Care Copilot</h2>
              <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.2 rounded-full bg-teal-50 text-teal-700 border border-teal-200">
                <Sparkles className="w-2.5 h-2.5" /> Gemini AI
              </span>
            </div>
            <p className="text-[11px] text-slate-500">
              Personalized wellness, habit prioritization & progress review
            </p>
          </div>
        </div>

        {isDrawer && onCloseDrawer && (
          <button
            onClick={onCloseDrawer}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200/50"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 sm:p-5 overflow-y-auto space-y-4">
        {messages.map((msg) => {
          const isUser = msg.role === 'user';

          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-2xl ${isUser ? 'ml-auto justify-end' : 'mr-auto'}`}
            >
              {!isUser && (
                <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center shrink-0 mt-0.5">
                  <Sparkles className="w-4 h-4" />
                </div>
              )}

              <div className="space-y-2 max-w-lg">
                <div
                  className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                    isUser
                      ? 'bg-slate-900 text-white rounded-br-xs'
                      : 'bg-slate-50 text-slate-800 border border-slate-200/80 rounded-bl-xs'
                  }`}
                >
                  <div className="whitespace-pre-line prose prose-sm max-w-none">
                    {msg.content}
                  </div>
                </div>

                {/* Optional Task Suggestions in chat bubble */}
                {msg.suggestedTasks && msg.suggestedTasks.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">
                      Recommended Routine Item:
                    </span>
                    {msg.suggestedTasks.map((task, idx) => {
                      const isAdded = addedTaskMap[`${task.title}-${idx}`];
                      return (
                        <div
                          key={idx}
                          className="p-3 rounded-xl bg-teal-50/50 border border-teal-200 flex items-center justify-between gap-2"
                        >
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-teal-950 truncate">
                              {task.title}
                            </h4>
                            <p className="text-[11px] text-teal-800 truncate">
                              {task.description}
                            </p>
                            <span className="text-[10px] text-teal-600 font-medium">
                              {task.timeOfDay} • {task.durationMinutes} mins
                            </span>
                          </div>

                          <button
                            onClick={() => handleAddSuggestedTask(task, idx)}
                            disabled={isAdded}
                            className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold shrink-0 transition-all ${
                              isAdded
                                ? 'bg-emerald-600 text-white'
                                : 'bg-teal-600 hover:bg-teal-700 text-white shadow-xs'
                            }`}
                          >
                            {isAdded ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>Added</span>
                              </>
                            ) : (
                              <>
                                <Plus className="w-3.5 h-3.5" />
                                <span>Add to Tasks</span>
                              </>
                            )}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {isUser && (
                <div className="w-8 h-8 rounded-lg bg-slate-900 text-white flex items-center justify-center shrink-0 mt-0.5">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {isLoading && (
          <div className="flex gap-3 max-w-lg mr-auto">
            <div className="w-8 h-8 rounded-lg bg-teal-50 text-teal-700 border border-teal-200 flex items-center justify-center shrink-0">
              <RefreshCw className="w-4 h-4 animate-spin text-teal-600" />
            </div>
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-500 flex items-center gap-2">
              <span className="inline-block w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce" />
              <span className="inline-block w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce [animation-delay:0.2s]" />
              <span className="inline-block w-1.5 h-1.5 bg-teal-500 rounded-full animate-bounce [animation-delay:0.4s]" />
              <span className="ml-1">Aura is formulating your care plan...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Prompts */}
      <div className="px-4 py-2 bg-slate-50/70 border-t border-slate-100 flex items-center gap-1.5 overflow-x-auto text-xs">
        <span className="text-slate-400 font-semibold shrink-0 text-[11px]">Quick Prompts:</span>
        <button
          onClick={() => handleSendMessage('Prioritize my tasks for today based on low energy.')}
          className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-teal-300 text-slate-700 hover:text-teal-900 font-medium whitespace-nowrap transition-colors shadow-2xs"
        >
          ⚡ Prioritize with low energy
        </button>
        <button
          onClick={() => handleSendMessage('Summarize my weekly personal care progress and habits.')}
          className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-teal-300 text-slate-700 hover:text-teal-900 font-medium whitespace-nowrap transition-colors shadow-2xs"
        >
          📊 Summarize my progress
        </button>
        <button
          onClick={() => handleSendMessage('Suggest a balanced evening wind-down routine for restful sleep.')}
          className="px-2.5 py-1 rounded-full bg-white border border-slate-200 hover:border-teal-300 text-slate-700 hover:text-teal-900 font-medium whitespace-nowrap transition-colors shadow-2xs"
        >
          🌙 Evening sleep routine
        </button>
      </div>

      {/* Input Box */}
      <div className="p-4 border-t border-slate-100 bg-white">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            placeholder="Ask Aura to organize tasks, prioritize routines, or review your wellness..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 text-slate-900 placeholder:text-slate-400"
          />
          <button
            type="submit"
            disabled={!inputMessage.trim() || isLoading}
            className="p-2.5 rounded-xl bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-bold transition-all shadow-xs shrink-0"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
