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
    <aside className="w-64 bg-gray-800 h-screen flex flex-col p-4">
      <h2 className="text-lg font-bold mb-6 text-blue-400">Banking Simulator</h2>
      <nav className="flex flex-col gap-2">
        {items.map((item) => (
          <button
            key={item.label}
            onClick={() => onNavigate(item.label)}
            className={`flex items-center gap-3 px-4 py-2 rounded-lg text-left transition-colors ${
              item.active
                ? 'bg-blue-600 text-white'
                : 'text-gray-300 hover:bg-gray-700'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
