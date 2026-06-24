import { useState } from 'react';
import axios from 'axios';
import Icon from './Icon';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface RequestStatus {
  endpoint: string;
  status: number;
  body: string;
  time: number;
}

export default function IncidentPanel({ onEvent }: { onEvent: (e: RequestStatus) => void }) {
  const [loading, setLoading] = useState<string | null>(null);
  const [activeIncidents, setActiveIncidents] = useState<string[]>([]);

  async function callPost(endpoint: string, payload: object, label: string) {
    setLoading(label);
    const start = Date.now();
    try {
      const res = await axios.post(`${API_URL}${endpoint}`, payload, { timeout: 15000 });
      const time = Date.now() - start;
      onEvent({ endpoint, status: res.status, body: JSON.stringify(res.data), time });
      if (res.data.activeIncidents) {
        setActiveIncidents(res.data.activeIncidents);
      }
    } catch (err: any) {
      const time = Date.now() - start;
      const status = err.response?.status || 0;
      const body = err.response?.data ? JSON.stringify(err.response.data) : err.message;
      onEvent({ endpoint, status, body, time });
      if (err.response?.data?.activeIncidents) {
        setActiveIncidents(err.response.data.activeIncidents);
      }
    }
    setLoading(null);
    fetchActiveIncidents();
  }

  async function fetchActiveIncidents() {
    try {
      const res = await axios.get(`${API_URL}/api/v1/incidents/active`);
      setActiveIncidents(res.data.activeIncidents || []);
    } catch { /* ignore */ }
  }

  const btnClass = (name: string) =>
    `px-4 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm
     ${loading === name ? 'opacity-50 cursor-wait' : 'hover:scale-[1.02] active:scale-[0.98]'}`;

  const incidentMeta: Record<string, { color: string; icon: string; label: string }> = {
    'service-down': { color: 'text-red-400', icon: 'server', label: 'Servico DOWN' },
    timeout: { color: 'text-amber-400', icon: 'clock', label: 'Timeout' },
    'internal-error': { color: 'text-pink-400', icon: 'xmark', label: 'Erro 500' },
    overload: { color: 'text-orange-400', icon: 'cpu', label: 'Sobrecarga' },
  };

  return (
    <div className="card-glass rounded-xl p-6 border border-white/[0.04] mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
          <Icon name="alert" size={16} className="text-red-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Painel de Incidentes</h3>
          <p className="text-xs text-gray-500">Sprint 5 — Chaos Engineering</p>
        </div>
      </div>

      {activeIncidents.length > 0 && (
        <div className="mb-4 p-4 rounded-xl bg-red-500/5 border border-red-500/15">
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
            <p className="text-sm font-semibold text-red-400">
              {activeIncidents.length} Incidente{activeIncidents.length > 1 ? 's' : ''} Ativo{activeIncidents.length > 1 ? 's' : ''}
            </p>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {activeIncidents.map((inc) => {
              const meta = incidentMeta[inc] || { color: 'text-gray-400', icon: 'alert', label: inc };
              return (
                <span key={inc} className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-navy-700/60 border border-white/[0.04] ${meta.color}`}>
                  <Icon name={meta.icon} size={12} />
                  {meta.label}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {activeIncidents.length === 0 && (
        <div className="mb-4 p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15 flex items-center gap-2">
          <Icon name="check" size={16} className="text-emerald-400" />
          <p className="text-sm text-emerald-400">Sistema saudavel — sem incidentes ativos</p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
        <button className={`${btnClass('service-down')} bg-red-600/80 hover:bg-red-600 text-white`}
          onClick={() => callPost('/api/v1/incidents/service-down', {}, 'service-down')} disabled={loading !== null}>
          Simular Queda
        </button>
        <button className={`${btnClass('timeout')} bg-amber-600/80 hover:bg-amber-600 text-white`}
          onClick={() => callPost('/api/v1/incidents/timeout', { delay: 5000 }, 'timeout')} disabled={loading !== null}>
          Simular Timeout
        </button>
        <button className={`${btnClass('error-500')} bg-pink-600/80 hover:bg-pink-600 text-white`}
          onClick={() => callPost('/api/v1/incidents/internal-error', {}, 'error-500')} disabled={loading !== null}>
          Simular Erro 500
        </button>
        <button className={`${btnClass('overload')} bg-orange-600/80 hover:bg-orange-600 text-white`}
          onClick={() => callPost('/api/v1/incidents/overload', {}, 'overload')} disabled={loading !== null}>
          Simular Sobrecarga
        </button>
        <button className={`${btnClass('recover')} bg-emerald-600/80 hover:bg-emerald-600 text-white col-span-2 md:col-span-2`}
          onClick={() => callPost('/api/v1/incidents/recover', {}, 'recover')} disabled={loading !== null}>
          <span className="flex items-center justify-center gap-1.5">
            <Icon name="refresh" size={14} />
            Restaurar Sistema
          </span>
        </button>
      </div>
    </div>
  );
}
