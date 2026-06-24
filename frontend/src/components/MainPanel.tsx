import { useEffect, useState } from 'react';
import axios from 'axios';
import Icon from './Icon';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface HealthData {
  status: string;
}

export default function MainPanel() {
  const [health, setHealth] = useState<HealthData | null>(null);
  const [activeIncidents, setActiveIncidents] = useState(0);

  useEffect(() => {
    function poll() {
      axios.get(`${API_URL}/api/v1/health`, { timeout: 3000 })
        .then((res) => setHealth(res.data))
        .catch(() => setHealth({ status: 'UNREACHABLE' }));

      axios.get(`${API_URL}/api/v1/incidents/active`, { timeout: 3000 })
        .then((res) => setActiveIncidents(res.data.count ?? 0))
        .catch(() => {});
    }
    poll();
    const id = setInterval(poll, 5000);
    return () => clearInterval(id);
  }, []);

  const statusColor = health?.status === 'UP'
    ? 'text-emerald-400'
    : 'text-red-400';

  const statusBg = health?.status === 'UP'
    ? 'bg-emerald-400/10 border-emerald-400/20'
    : 'bg-red-400/10 border-red-400/20';

  return (
    <main className="flex-1 animate-slide-up">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className={`card-glass rounded-xl p-5 ${statusBg} border`}>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs text-gray-400 uppercase tracking-wider font-medium">Status do Servidor</h3>
            <Icon name="server" size={18} className={statusColor} />
          </div>
          <p className={`text-3xl font-bold ${statusColor}`}>
            {health?.status || '---'}
          </p>
          <p className="text-xs text-gray-500 mt-1">/api/v1/health</p>
        </div>

        <div className="card-glass rounded-xl p-5 border border-white/[0.04]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs text-gray-400 uppercase tracking-wider font-medium">Incidentes Ativos</h3>
            <Icon name="alert" size={18} className={activeIncidents > 0 ? 'text-red-400' : 'text-gray-500'} />
          </div>
          <p className={`text-3xl font-bold ${activeIncidents > 0 ? 'text-red-400' : 'text-emerald-400'}`}>
            {activeIncidents}
          </p>
          <p className="text-xs text-gray-500 mt-1">/api/v1/incidents/active</p>
        </div>

        <div className="card-glass rounded-xl p-5 border border-white/[0.04]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs text-gray-400 uppercase tracking-wider font-medium">Métricas</h3>
            <Icon name="activity" size={18} className="text-accent-400" />
          </div>
          <p className="text-3xl font-bold text-accent-400">/metrics</p>
          <p className="text-xs text-gray-500 mt-1">Prometheus scrape</p>
        </div>

        <div className="card-glass rounded-xl p-5 border border-white/[0.04]">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs text-gray-400 uppercase tracking-wider font-medium">Grafana</h3>
            <Icon name="eye" size={18} className="text-purple-400" />
          </div>
          <p className="text-3xl font-bold text-purple-400">:3000</p>
          <p className="text-xs text-gray-500 mt-1">admin / admin</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card-glass rounded-xl p-6 border border-white/[0.04]">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-accent-500/10 border border-accent-500/20 flex items-center justify-center">
              <Icon name="zap" size={16} className="text-accent-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Quick Actions</h3>
              <p className="text-xs text-gray-500">Acoes rapidas do sistema</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Health Check', path: '/api/v1/health', method: 'GET', color: 'emerald' },
              { label: 'Consultar Saldo', path: '/api/v1/account/balance', method: 'GET', color: 'blue' },
              { label: 'Fazer PIX', path: '/api/v1/transactions/pix', method: 'POST', color: 'accent' },
              { label: 'Pagar Boleto', path: '/api/v1/payments/boleto', method: 'POST', color: 'purple' },
              { label: 'Login', path: '/api/v1/auth/login', method: 'POST', color: 'amber' },
              { label: 'Registrar Device', path: '/api/v1/devices/register', method: 'POST', color: 'rose' },
            ].map((action) => (
              <div key={action.path} className="bg-navy-700/60 rounded-lg p-3 border border-white/[0.03] hover:border-accent-500/20 transition-colors cursor-default">
                <span className={`text-[10px] font-bold uppercase tracking-wider text-${action.color}-400`}>
                  {action.method}
                </span>
                <p className="text-xs text-gray-300 mt-1 font-mono truncate">{action.path}</p>
                <p className="text-xs text-gray-500 mt-0.5">{action.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card-glass rounded-xl p-6 border border-white/[0.04]">
          <div className="flex items-center gap-3 mb-5">
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Icon name="log" size={16} className="text-purple-400" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Sprints Concluidas</h3>
              <p className="text-xs text-gray-500">Progresso do projeto</p>
            </div>
          </div>
          <div className="space-y-2.5">
            {[
              { sprint: 1, label: 'Fundacao da Infraestrutura', color: 'emerald' },
              { sprint: 2, label: 'Autenticacao e Seguranca', color: 'blue' },
              { sprint: 3, label: 'Operacoes Financeiras', color: 'accent' },
              { sprint: 4, label: 'Fraude e Seguranca Avancada', color: 'purple' },
              { sprint: 5, label: 'Incidentes e Chaos Engineering', color: 'amber' },
              { sprint: 6, label: 'Dashboards e Documentacao', color: 'rose' },
            ].map((s) => (
              <div key={s.sprint} className="flex items-center gap-3 bg-navy-700/40 rounded-lg px-4 py-2.5 border border-white/[0.02]">
                <span className={`w-7 h-7 rounded-md bg-${s.color}-500/10 border border-${s.color}-500/20 flex items-center justify-center text-xs font-bold text-${s.color}-400`}>
                  {s.sprint}
                </span>
                <span className="text-sm text-gray-300">{s.label}</span>
                <span className="ml-auto">
                  <Icon name="check" size={14} className="text-emerald-400" />
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
