import { FilterType } from '../interfaces/ITodo';

interface FilterTabsProps {
  filter: FilterType;
  onChange: (filter: FilterType) => void;
  counts: { all: number; active: number; completed: number };
}

const TABS: { value: FilterType; label: string }[] = [
  { value: 'all', label: 'Tümü' },
  { value: 'active', label: 'Aktif' },
  { value: 'completed', label: 'Tamamlanan' },
];

export default function FilterTabs({ filter, onChange, counts }: FilterTabsProps) {
  return (
    <div
      role="tablist"
      className="inline-flex w-fit max-w-full self-start rounded-xl border border-white/10 bg-white/[0.03] p-1"
    >
      {TABS.map((tab) => {
        const isActive = filter === tab.value;
        const count = counts[tab.value];
        return (
          <button
            key={tab.value}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.value)}
            className={`relative inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-medium transition ${
              isActive
                ? 'bg-gradient-to-br from-violet-500/90 to-fuchsia-500/90 text-white shadow-glow'
                : 'text-white/55 hover:text-white/90'
            }`}
          >
            <span>{tab.label}</span>
            <span
              className={`rounded-md px-1.5 py-0.5 text-[10px] font-semibold leading-none ${
                isActive ? 'bg-white/20 text-white' : 'bg-white/5 text-white/45'
              }`}
            >
              {count}
            </span>
          </button>
        );
      })}
    </div>
  );
}
