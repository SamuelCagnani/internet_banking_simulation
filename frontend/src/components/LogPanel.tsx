import { useEffect, useRef } from 'react';

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

  const statusColor = (status: number) => {
    if (status >= 200 && status < 300) return 'text-green-400';
    if (status >= 400 && status < 500) return 'text-yellow-400';
    if (status >= 500) return 'text-red-400';
    return 'text-gray-400';
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 mt-6">
      <h3 className="text-gray-400 text-sm uppercase tracking-wide mb-4">Últimos Eventos</h3>
      <div className="max-h-64 overflow-y-auto space-y-2">
        {events.length === 0 && (
          <p className="text-gray-500 text-sm">Nenhum evento ainda. Dispare uma requisição acima.</p>
        )}
        {events.map((ev, i) => (
          <div
            key={i}
            className="bg-gray-900 rounded px-3 py-2 text-xs font-mono flex items-start gap-3"
          >
            <span className="text-gray-500 shrink-0">{ev.timestamp}</span>
            <span className="text-blue-400 shrink-0">{ev.endpoint}</span>
            <span className={`${statusColor(ev.status)} shrink-0 font-bold`}>{ev.status}</span>
            <span className="text-gray-400 truncate">{ev.body}</span>
            <span className="text-gray-600 shrink-0">{ev.time}ms</span>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </div>
  );
}
