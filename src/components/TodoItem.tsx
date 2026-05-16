import { useEffect, useRef, useState } from 'react';
import { ITodo, Priority } from '../interfaces/ITodo';

interface TodoItemProps {
  todo: ITodo;
  onUpdate: (id: number, newText: string, newPriority?: Priority) => void;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
}

const PRIORITY_META: Record<
  Priority,
  { label: string; bar: string; dot: string; chip: string }
> = {
  low: {
    label: 'Düşük',
    bar: 'bg-emerald-400/80',
    dot: 'bg-emerald-400',
    chip: 'border-emerald-400/30 bg-emerald-400/10 text-emerald-200',
  },
  medium: {
    label: 'Orta',
    bar: 'bg-amber-400/80',
    dot: 'bg-amber-400',
    chip: 'border-amber-400/30 bg-amber-400/10 text-amber-200',
  },
  high: {
    label: 'Yüksek',
    bar: 'bg-rose-400/80',
    dot: 'bg-rose-400',
    chip: 'border-rose-400/30 bg-rose-400/10 text-rose-200',
  },
};

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (isNaN(date.getTime())) return iso;
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 1) return 'şimdi';
  if (diffMin < 60) return `${diffMin} dk önce`;
  const diffH = Math.round(diffMin / 60);
  if (diffH < 24) return `${diffH} sa önce`;
  return date.toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export default function TodoItem({ todo, onUpdate, onDelete, onToggle }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);
  const [editPriority, setEditPriority] = useState<Priority>(todo.priority);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const meta = PRIORITY_META[todo.priority];

  const handleSave = () => {
    const trimmed = editText.trim();
    if (trimmed === '') return;
    onUpdate(todo.id, trimmed, editPriority);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setEditPriority(todo.priority);
    setIsEditing(false);
  };

  return (
    <div
      className={`group relative overflow-hidden rounded-2xl border bg-white/[0.03] transition ${
        todo.completed
          ? 'border-white/5 opacity-70'
          : 'border-white/10 hover:border-white/20 hover:bg-white/[0.05]'
      }`}
    >
      <span
        aria-hidden
        className={`absolute inset-y-0 left-0 w-1 ${meta.bar} ${
          todo.completed ? 'opacity-30' : 'opacity-100'
        }`}
      />

      <div className="flex items-start gap-3 p-4 pl-5">
        <button
          type="button"
          onClick={() => onToggle(todo.id)}
          aria-pressed={todo.completed}
          aria-label={todo.completed ? 'Tamamlanmadı yap' : 'Tamamlandı yap'}
          className={`relative mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
            todo.completed
              ? 'border-emerald-400/70 bg-emerald-400/20 text-emerald-300'
              : 'border-white/20 bg-white/[0.03] hover:border-violet-400/70 hover:bg-violet-400/10'
          }`}
        >
          {todo.completed && (
            <svg
              viewBox="0 0 24 24"
              className="h-3.5 w-3.5 animate-scale-in"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12" />
            </svg>
          )}
        </button>

        {isEditing ? (
          <div className="flex-1 space-y-3">
            <input
              ref={inputRef}
              type="text"
              value={editText}
              onChange={(e) => setEditText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleSave();
                if (e.key === 'Escape') handleCancel();
              }}
              className="w-full rounded-lg border border-violet-400/50 bg-white/5 px-3 py-2 text-sm text-white focus:border-violet-400 focus:outline-none focus:ring-2 focus:ring-violet-500/25"
            />
            <div className="flex flex-wrap items-center gap-2">
              {(Object.keys(PRIORITY_META) as Priority[]).map((p) => {
                const m = PRIORITY_META[p];
                const isActive = editPriority === p;
                return (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setEditPriority(p)}
                    className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium transition ${
                      isActive
                        ? m.chip
                        : 'border-white/10 bg-white/[0.03] text-white/55 hover:text-white/80'
                    }`}
                  >
                    <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />
                    {m.label}
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="min-w-0 flex-1">
            <p
              className={`break-words text-[15px] leading-snug ${
                todo.completed ? 'text-white/40 line-through' : 'text-white/95'
              }`}
            >
              {todo.text}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2 text-[11px] text-white/40">
              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 ${meta.chip}`}
              >
                <span className={`h-1 w-1 rounded-full ${meta.dot}`} />
                {meta.label}
              </span>
              <span className="inline-flex items-center gap-1">
                <svg
                  viewBox="0 0 24 24"
                  className="h-3 w-3"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12 6 12 12 16 14" />
                </svg>
                {formatDate(todo.createdAt)}
              </span>
            </div>
          </div>
        )}

        <div className="flex shrink-0 items-center gap-1">
          {isEditing ? (
            <>
              <button
                onClick={handleSave}
                aria-label="Kaydet"
                className="inline-flex h-8 items-center gap-1 rounded-lg bg-emerald-500/90 px-2.5 text-xs font-semibold text-white transition hover:bg-emerald-500"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
                <span className="hidden sm:inline">Kaydet</span>
              </button>
              <button
                onClick={handleCancel}
                aria-label="İptal"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/55 transition hover:bg-white/10 hover:text-white"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                aria-label="Düzenle"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/60 transition hover:border-violet-400/40 hover:bg-violet-500/15 hover:text-violet-200"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 20h9" />
                  <path d="M16.5 3.5a2.121 2.121 0 1 1 3 3L7 19l-4 1 1-4 12.5-12.5z" />
                </svg>
              </button>
              <button
                onClick={() => onDelete(todo.id)}
                aria-label="Sil"
                className="inline-flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-white/60 transition hover:border-rose-400/40 hover:bg-rose-500/15 hover:text-rose-200"
              >
                <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 6h18" />
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
