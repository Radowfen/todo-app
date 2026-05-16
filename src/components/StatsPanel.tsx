interface StatsPanelProps {
  total: number;
  active: number;
  completed: number;
  progress: number;
}

interface StatCardProps {
  label: string;
  value: number | string;
  accent: string;
  icon: React.ReactNode;
}

function StatCard({ label, value, accent, icon }: StatCardProps) {
  return (
    <div className="glass group relative overflow-hidden rounded-2xl p-4 transition hover:border-white/20">
      <div
        className={`pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-25 blur-2xl transition group-hover:opacity-40 ${accent}`}
      />
      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-widest text-white/45">
            {label}
          </p>
          <p className="mt-1 text-2xl font-bold text-white">{value}</p>
        </div>
        <div
          className={`flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 ${accent.replace(
            'bg-',
            'text-'
          )}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}

export default function StatsPanel({ total, active, completed, progress }: StatsPanelProps) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      <StatCard
        label="Toplam"
        value={total}
        accent="bg-violet-500"
        icon={
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" />
            <line x1="3" y1="10" x2="21" y2="10" />
          </svg>
        }
      />
      <StatCard
        label="Aktif"
        value={active}
        accent="bg-sky-400"
        icon={
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        }
      />
      <StatCard
        label="Tamamlandı"
        value={completed}
        accent="bg-emerald-400"
        icon={
          <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        }
      />
      <div className="glass relative col-span-2 overflow-hidden rounded-2xl p-4 sm:col-span-1">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-widest text-white/45">
              İlerleme
            </p>
            <p className="mt-1 text-2xl font-bold text-white">{progress}%</p>
          </div>
          <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-fuchsia-300">
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
          </div>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-sky-400 transition-all duration-700 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
}
