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

export default function SecurityPanel({ onEvent }: { onEvent: (e: RequestStatus) => void }) {
  const [loading, setLoading] = useState<string | null>(null);

  async function callPost(endpoint: string, payload: object, label: string) {
    setLoading(label);
    const start = Date.now();
    try {
      const res = await axios.post(`${API_URL}${endpoint}`, payload, { timeout: 10000 });
      const time = Date.now() - start;
      onEvent({ endpoint, status: res.status, body: JSON.stringify(res.data), time });
    } catch (err: any) {
      const time = Date.now() - start;
      const status = err.response?.status || 0;
      const body = err.response?.data ? JSON.stringify(err.response.data) : err.message;
      onEvent({ endpoint, status, body, time });
    }
    setLoading(null);
  }

  async function callPut(endpoint: string, payload: object, label: string) {
    setLoading(label);
    const start = Date.now();
    try {
      const res = await axios.put(`${API_URL}${endpoint}`, payload, { timeout: 10000 });
      const time = Date.now() - start;
      onEvent({ endpoint, status: res.status, body: JSON.stringify(res.data), time });
    } catch (err: any) {
      const time = Date.now() - start;
      const status = err.response?.status || 0;
      const body = err.response?.data ? JSON.stringify(err.response.data) : err.message;
      onEvent({ endpoint, status, body, time });
    }
    setLoading(null);
  }

  const btnClass = (name: string) =>
    `px-4 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm
     ${loading === name ? 'opacity-50 cursor-wait' : 'hover:scale-[1.02] active:scale-[0.98]'}`;

  return (
    <div className="card-glass rounded-xl p-6 border border-white/[0.04] mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
          <Icon name="eye" size={16} className="text-purple-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Painel de Seguranca Avancada</h3>
          <p className="text-xs text-gray-500">Sprint 4 — Dispositivos, Fraudes, Limites</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
        <button className={`${btnClass('register-device')} bg-emerald-600/80 hover:bg-emerald-600 text-white`}
          onClick={() => callPost('/api/v1/devices/register', { userId: 'user-1', deviceId: 'device-001', deviceName: 'iPhone 15' }, 'register-device')} disabled={loading !== null}>
          Registrar Dispositivo
        </button>
        <button className={`${btnClass('suspicious-device')} bg-red-600/80 hover:bg-red-600 text-white`}
          onClick={() => callPost('/api/v1/devices/register', { userId: 'user-1', deviceId: 'suspicious', deviceName: 'Dispositivo Suspeito' }, 'suspicious-device')} disabled={loading !== null}>
          Dispositivo Suspeito
        </button>
        <button className={`${btnClass('change-limit')} bg-indigo-600/80 hover:bg-indigo-600 text-white`}
          onClick={() => callPut('/api/v1/user/limits', { userId: 'user-1', newLimit: 5000 }, 'change-limit')} disabled={loading !== null}>
          Alterar Limite PIX
        </button>
        <button className={`${btnClass('brute-force')} bg-amber-600/80 hover:bg-amber-600 text-white`}
          onClick={() => callPost('/api/v1/security/simulate/brute-force', { userId: 'user-1', attempts: 20 }, 'brute-force')} disabled={loading !== null}>
          Simular Brute Force
        </button>
        <button className={`${btnClass('suspicious-activity')} bg-orange-600/80 hover:bg-orange-600 text-white`}
          onClick={() => callPost('/api/v1/security/simulate/suspicious', { userId: 'user-1' }, 'suspicious-activity')} disabled={loading !== null}>
          Atividade Suspeita
        </button>
      </div>
    </div>
  );
}
