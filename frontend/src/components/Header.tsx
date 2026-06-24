import { useState, useEffect } from 'react';
import Icon from './Icon';

interface HeaderProps {
  title: string;
}

const subtitles: Record<string, string> = {
  Dashboard: 'Visao geral do sistema e métricas em tempo real',
  'Segurança': 'Autenticacao, dispositivos e monitoramento de fraudes',
  'Operações': 'PIX, boletos, saldo e transacoes financeiras',
  'Incidentes': 'Chaos engineering e simulacao de falhas operacionais',
};

export default function Header({ title }: HeaderProps) {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <header className="border-b border-white/[0.04] bg-navy-800/50 backdrop-blur-sm">
      <div className="px-6 py-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-1">
            <span className="text-accent-500">BankSim</span>
            <span>/</span>
            <span className="text-gray-400">{title}</span>
          </div>
          <h1 className="text-xl font-semibold text-white">{title}</h1>
          <p className="text-sm text-gray-500 mt-0.5">{subtitles[title] || ''}</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-gray-400 bg-navy-700/50 px-3 py-1.5 rounded-lg border border-white/[0.04]">
            <Icon name="clock" size={14} className="text-accent-400" />
            <span className="font-mono tabular-nums">
              {time.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
