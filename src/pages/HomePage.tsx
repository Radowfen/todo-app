import { useEffect, useMemo, useState } from 'react';
import { FilterType, ITodo, Priority } from '../interfaces/ITodo';
import TodoForm from '../components/TodoForm';
import TodoList from '../components/TodoList';
import StatsPanel from '../components/StatsPanel';
import FilterTabs from '../components/FilterTabs';

const STORAGE_KEY = 'tasker.todos.v2';

export default function HomePage() {
  const [todos, setTodos] = useState<ITodo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [query, setQuery] = useState<string>('');

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setTodos(JSON.parse(saved));
      } catch {
        setTodos([]);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string, priority: Priority) => {
    const newTodo: ITodo = {
      id: Date.now(),
      text,
      completed: false,
      priority,
      createdAt: new Date().toISOString(),
    };
    setTodos((prev) => [newTodo, ...prev]);
  };

  const updateTodo = (id: number, newText: string, newPriority?: Priority) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id
          ? { ...todo, text: newText, priority: newPriority ?? todo.priority }
          : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id));
  };

  const toggleTodo = (id: number) => {
    setTodos((prev) =>
      prev.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const clearCompleted = () => {
    setTodos((prev) => prev.filter((todo) => !todo.completed));
  };

  const filteredTodos = useMemo(() => {
    const term = query.trim().toLowerCase();
    return todos
      .filter((t) => {
        if (filter === 'active') return !t.completed;
        if (filter === 'completed') return t.completed;
        return true;
      })
      .filter((t) => (term ? t.text.toLowerCase().includes(term) : true));
  }, [todos, filter, query]);

  const total = todos.length;
  const completedCount = todos.filter((t) => t.completed).length;
  const activeCount = total - completedCount;
  const progress = total === 0 ? 0 : Math.round((completedCount / total) * 100);

  const today = new Date().toLocaleDateString('tr-TR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[480px] bg-radial-fade"
      />

      <div className="mx-auto w-full max-w-3xl px-5 py-10 sm:py-14">
        <header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-white/70 backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-violet-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-violet-400" />
              </span>
              <span className="capitalize">{today}</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
              <span className="gradient-text">Tasker</span>
            </h1>
            <p className="max-w-md text-sm text-white/55">
              Günlük görevlerini önceliklendir, ilerlemeni takip et ve odağını koru.
            </p>
          </div>

          <div className="glass-strong relative flex h-16 w-16 shrink-0 items-center justify-center self-start rounded-2xl shadow-glow sm:self-auto">
            <svg
              viewBox="0 0 24 24"
              className="h-8 w-8 text-violet-300"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 11l3 3L22 4" />
              <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
            </svg>
          </div>
        </header>

        <StatsPanel
          total={total}
          active={activeCount}
          completed={completedCount}
          progress={progress}
        />

        <section className="mt-6 glass-strong relative overflow-hidden rounded-3xl p-5 shadow-card sm:p-7">
          <TodoForm onAdd={addTodo} />

          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-3">
            <FilterTabs
              filter={filter}
              onChange={setFilter}
              counts={{ all: total, active: activeCount, completed: completedCount }}
            />

            <div className="relative w-full sm:flex-1">
              <svg
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/35"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="11" cy="11" r="7" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ara..."
                className="w-full rounded-xl border border-white/10 bg-white/5 px-9 py-2 text-sm text-white placeholder:text-white/35 focus:border-violet-400/60 focus:outline-none focus:ring-2 focus:ring-violet-500/20"
              />
            </div>
          </div>

          <TodoList
            todos={filteredTodos}
            onUpdate={updateTodo}
            onDelete={deleteTodo}
            onToggle={toggleTodo}
            filter={filter}
            hasQuery={query.trim().length > 0}
          />

          {completedCount > 0 && (
            <div className="mt-5 flex justify-end border-t border-white/5 pt-4">
              <button
                onClick={clearCompleted}
                className="group inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium text-white/50 transition hover:bg-white/5 hover:text-white/85"
              >
                <svg
                  className="h-3.5 w-3.5 transition group-hover:rotate-12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M3 6h18" />
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                </svg>
                Tamamlananları temizle ({completedCount})
              </button>
            </div>
          )}
        </section>

        <footer className="mt-10 flex flex-col items-center gap-1 text-center text-xs text-white/35">
          <p>
            <span className="font-mono">React</span> · <span className="font-mono">TypeScript</span> ·{' '}
            <span className="font-mono">Tailwind CSS</span>
          </p>
          <p>Staj Projesi · © 2026</p>
        </footer>
      </div>
    </div>
  );
}
