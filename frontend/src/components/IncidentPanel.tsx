import { useState } from 'react';
import axios from 'axios';

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
    } catch {
      // ignore
    }
  }

  const btnClass = (name: string) =>
    `px-4 py-3 rounded-lg font-medium transition-colors text-sm ${
      loading === name ? 'opacity-50 cursor-wait' : ''
    }`;

  const incidentColors: Record<string, string> = {
    'service-down': 'bg-red-600',
    timeout: 'bg-yellow-600',
    'internal-error': 'bg-pink-600',
    overload: 'bg-orange-600',
  };

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-gray-400 text-sm uppercase tracking-wide mb-4">
        Painel de Incidentes
      </h3>

      {activeIncidents.length > 0 && (
        <div className="mb-4 p-3 bg-red-900/40 border border-red-700 rounded-lg">
          <span className="text-red-400 text-sm font-semibold">
            Alertas Ativos: {activeIncidents.length}
          </span>
          <div className="flex flex-wrap gap-1 mt-1">
            {activeIncidents.map((inc) => (
              <span
                key={inc}
                className={`px-2 py-0.5 rounded text-xs text-white ${incidentColors[inc] || 'bg-gray-600'}`}
              >
                {inc}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <button
          className={`${btnClass('service-down')} bg-red-600 hover:bg-red-700`}
          onClick={() => callPost('/api/v1/incidents/service-down', {}, 'service-down')}
          disabled={loading !== null}
        >
          Simular Queda
        </button>
        <button
          className={`${btnClass('timeout')} bg-yellow-600 hover:bg-yellow-700`}
          onClick={() => callPost('/api/v1/incidents/timeout', { delay: 5000 }, 'timeout')}
          disabled={loading !== null}
        >
          Simular Timeout
        </button>
        <button
          className={`${btnClass('error-500')} bg-pink-600 hover:bg-pink-700`}
          onClick={() => callPost('/api/v1/incidents/internal-error', {}, 'error-500')}
          disabled={loading !== null}
        >
          Simular Erro 500
        </button>
        <button
          className={`${btnClass('overload')} bg-orange-600 hover:bg-orange-700`}
          onClick={() => callPost('/api/v1/incidents/overload', {}, 'overload')}
          disabled={loading !== null}
        >
          Simular Sobrecarga
        </button>
        <button
          className={`${btnClass('recover')} bg-green-600 hover:bg-green-700 col-span-2 md:col-span-2`}
          onClick={() => callPost('/api/v1/incidents/recover', {}, 'recover')}
          disabled={loading !== null}
        >
          Restaurar Sistema
        </button>
      </div>
    </div>
  );
}
