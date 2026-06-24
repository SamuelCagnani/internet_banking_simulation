import Icon from './Icon';

interface NavItem {
  label: string;
  icon: string;
  active?: boolean;
}

interface SidebarProps {
  items: NavItem[];
  onNavigate: (label: string) => void;
}

export default function Sidebar({ items, onNavigate }: SidebarProps) {
  return (
    <aside className="w-64 h-screen flex flex-col bg-navy-800 border-r border-white/[0.04]">
      <div className="p-5 pb-4">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-accent-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-accent-500/20">
            <Icon name="bank" size={20} className="text-navy-900" />
          </div>
          <div>
            <h1 className="text-base font-bold text-white tracking-tight">BankSim</h1>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">Observability</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-3 flex flex-col gap-0.5">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={() => onNavigate(item.label)}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all duration-200 text-sm font-medium
              ${item.active
                ? 'bg-accent-500/10 text-accent-400 border border-accent-500/20'
                : 'text-gray-400 hover:bg-white/[0.03] hover:text-gray-200 border border-transparent'
              }`}
          >
            <Icon name={item.icon} size={18} className={item.active ? 'text-accent-400' : 'text-gray-500'} />
            <span>{item.label}</span>
            {item.active && (
              <span className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-400 shadow-glow" />
            )}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-white/[0.04]">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span>Sistema operacional</span>
        </div>
        <p className="text-[11px] text-gray-600 mt-1">v1.0.0 — Sprint 5</p>
      </div>
    </aside>
  );
}
