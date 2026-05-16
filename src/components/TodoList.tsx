import { FilterType, ITodo, Priority } from '../interfaces/ITodo';
import TodoItem from './TodoItem';

interface TodoListProps {
  todos: ITodo[];
  onUpdate: (id: number, newText: string, newPriority?: Priority) => void;
  onDelete: (id: number) => void;
  onToggle: (id: number) => void;
  filter: FilterType;
  hasQuery: boolean;
}

function EmptyState({ filter, hasQuery }: { filter: FilterType; hasQuery: boolean }) {
  let title = 'Henüz görev yok';
  let description = 'Yukarıdan ilk görevini ekleyerek başla.';

  if (hasQuery) {
    title = 'Sonuç bulunamadı';
    description = 'Aramanla eşleşen bir görev yok. Farklı bir kelime dene.';
  } else if (filter === 'active') {
    title = 'Aktif görev kalmadı';
    description = 'Tebrikler — listeyi temiz tutmuşsun.';
  } else if (filter === 'completed') {
    title = 'Henüz tamamlanan yok';
    description = 'Bir görevi tamamladığında burada gözükecek.';
  }

  return (
    <div className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-14 text-center">
      <div className="relative mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03]">
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10" />
        <svg
          viewBox="0 0 24 24"
          className="relative h-6 w-6 text-violet-300"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="9" y1="13" x2="15" y2="13" />
          <line x1="9" y1="17" x2="13" y2="17" />
        </svg>
      </div>
      <p className="text-sm font-semibold text-white/85">{title}</p>
      <p className="mt-1 max-w-xs text-xs text-white/45">{description}</p>
    </div>
  );
}

export default function TodoList({
  todos,
  onUpdate,
  onDelete,
  onToggle,
  filter,
  hasQuery,
}: TodoListProps) {
  if (todos.length === 0) {
    return <EmptyState filter={filter} hasQuery={hasQuery} />;
  }

  return (
    <ul className="mt-5 space-y-2.5">
      {todos.map((todo, index) => (
        <li
          key={todo.id}
          className="animate-fade-in-up"
          style={{ animationDelay: `${Math.min(index * 35, 240)}ms`, animationFillMode: 'backwards' }}
        >
          <TodoItem
            todo={todo}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onToggle={onToggle}
          />
        </li>
      ))}
    </ul>
  );
}
