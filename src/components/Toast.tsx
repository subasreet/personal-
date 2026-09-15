import React, { useEffect } from 'react';
import { CheckCircle2, Sparkles, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type?: 'success' | 'ai' | 'info';
}

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 3500);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 fade-in duration-200">
      <div className="flex items-center gap-3 px-4 py-3 bg-slate-900 text-white rounded-2xl shadow-xl border border-slate-700/60 max-w-sm">
        {toast.type === 'ai' ? (
          <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />
        ) : (
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
        )}
        <div className="min-w-0">
          <p className="text-xs font-bold text-white leading-tight">{toast.title}</p>
          {toast.description && (
            <p className="text-[11px] text-slate-400 mt-0.5 leading-tight truncate">
              {toast.description}
            </p>
          )}
        </div>
        <button
          onClick={onDismiss}
          className="text-slate-400 hover:text-white ml-2 p-1 rounded-lg"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
