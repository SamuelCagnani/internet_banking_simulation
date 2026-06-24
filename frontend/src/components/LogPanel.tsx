import { useEffect, useRef } from 'react';
import Icon from './Icon';

interface LogEntry {
  endpoint: string;
  status: number;
  body: string;
  time: number;
  timestamp: string;
}

export default function LogPanel({ events }: { events: LogEntry[] }) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [events]);

  function statusConfig(status: number) {
    if (status >= 200 && status < 300) return { color: 'text-emerald-400', bg: 'bg-emerald-400/10', dot: 'bg-emerald-400' };
    if (status >= 400 && status < 500) return { color: 'text-amber-400', bg: 'bg-amber-400/10', dot: 'bg-amber-400' };
    if (status >= 500) return { color: 'text-red-400', bg: 'bg-red-400/10', dot: 'bg-red-400' };
    return { color: 'text-gray-400', bg: 'bg-gray-400/10', dot: 'bg-gray-400' };
  }

  return (
    <div className="card-glass rounded-xl p-6 border border-white/[0.04] mt-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
          <Icon name="activity" size={16} className="text-amber-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Ultimos Eventos</h3>
          <p className="text-xs text-gray-500">{events.length} evento{events.length !== 1 ? 's' : ''} registrado{events.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="max-h-72 overflow-y-auto space-y-1.5">
        {events.length === 0 && (
          <div className="text-center py-8">
            <Icon name="activity" size={28} className="text-gray-600 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Nenhum evento ainda</p>
            <p className="text-gray-600 text-xs mt-1">Dispare uma requisicao em um dos paineis acima</p>
          </div>
        )}
        {events.map((ev, i) => {
          const sc = statusConfig(ev.status);
          return (
            <div
              key={i}
              className="flex items-center gap-3 px-3 py-2 rounded-lg bg-navy-700/40 border border-white/[0.02] hover:border-accent-500/10 transition-colors group animate-slide-up"
            >
              <span className={`w-2 h-2 rounded-full shrink-0 ${sc.dot}`} />
              <span className="text-xs text-gray-500 font-mono shrink-0 w-14">{ev.timestamp}</span>
              <span className={`text-xs font-bold font-mono shrink-0 w-8 ${sc.color}`}>{ev.status}</span>
              <span className="text-xs text-gray-300 font-mono shrink-0 w-48 truncate">{ev.endpoint}</span>
              <span className="text-xs text-gray-600 font-mono shrink-0 ml-auto">{ev.time}ms</span>
              <span className="text-xs text-gray-500 truncate max-w-xs hidden group-hover:block">{ev.body}</span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
