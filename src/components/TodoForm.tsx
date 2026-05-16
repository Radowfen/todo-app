import { FormEvent, useState } from 'react';
import { Priority } from '../interfaces/ITodo';

interface TodoFormProps {
  onAdd: (text: string, priority: Priority) => void;
}

const PRIORITY_OPTIONS: {
  value: Priority;
  label: string;
  dot: string;
  active: string;
}[] = [
  {
    value: 'low',
    label: 'Düşük',
    dot: 'bg-emerald-400',
    active: 'border-emerald-400/60 bg-emerald-400/10 text-emerald-200',
  },
  {
    value: 'medium',
    label: 'Orta',
    dot: 'bg-amber-400',
    active: 'border-amber-400/60 bg-amber-400/10 text-amber-200',
  },
  {
    value: 'high',
    label: 'Yüksek',
    dot: 'bg-rose-400',
    active: 'border-rose-400/60 bg-rose-400/10 text-rose-200',
  },
];

export default function TodoForm({ onAdd }: TodoFormProps) {
  const [text, setText] = useState<string>('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const trimmed = text.trim();
    if (trimmed === '') return;
    onAdd(trimmed, priority);
    setText('');
    setPriority('medium');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div
        className={`group relative flex items-center gap-3 rounded-2xl border bg-white/[0.04] px-4 py-3 transition ${
          focused
            ? 'border-violet-400/60 ring-2 ring-violet-500/20'
            : 'border-white/10 hover:border-white/20'
        }`}
      >
        <svg
          className="h-5 w-5 shrink-0 text-white/40"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Bugün ne yapmak istiyorsun?"
          aria-label="Yeni görev"
          className="flex-1 bg-transparent text-[15px] text-white placeholder:text-white/35 focus:outline-none"
        />
        <button
          type="submit"
          disabled={text.trim() === ''}
          className="group/btn relative inline-flex items-center gap-1.5 overflow-hidden rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 px-4 py-2 text-sm font-semibold text-white shadow-glow transition hover:shadow-glow-lg disabled:cursor-not-allowed disabled:opacity-40 disabled:shadow-none"
        >
          <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover/btn:translate-x-full" />
          <svg
            className="h-4 w-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          <span className="hidden sm:inline">Ekle</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="text-[11px] font-medium uppercase tracking-widest text-white/35">
          Öncelik
        </span>
        {PRIORITY_OPTIONS.map((option) => {
          const isActive = priority === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => setPriority(option.value)}
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition ${
                isActive
                  ? option.active
                  : 'border-white/10 bg-white/[0.03] text-white/55 hover:border-white/20 hover:text-white/85'
              }`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${option.dot}`} />
              {option.label}
            </button>
          );
        })}
      </div>
    </form>
  );
}
