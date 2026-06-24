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

export default function AuthPanel({ onEvent }: { onEvent: (e: RequestStatus) => void }) {
  const [loading, setLoading] = useState<string | null>(null);

  async function callEndpoint(endpoint: string, payload?: object) {
    setLoading(endpoint);
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

  const btnClass = (name: string) =>
    `px-4 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm
     ${loading === name ? 'opacity-50 cursor-wait' : 'hover:scale-[1.02] active:scale-[0.98]'}`;

  return (
    <div className="card-glass rounded-xl p-6 border border-white/[0.04] mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
          <Icon name="shield" size={16} className="text-blue-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Painel de Autenticacao</h3>
          <p className="text-xs text-gray-500">Sprint 2 — Login, MFA, Logout</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
        <button className={`${btnClass('login-success')} bg-emerald-600/80 hover:bg-emerald-600 text-white`}
          onClick={() => callEndpoint('/api/v1/auth/login', { username: 'admin', password: '123456' })} disabled={loading !== null}>
          Login Sucesso
        </button>
        <button className={`${btnClass('login-fail')} bg-red-600/80 hover:bg-red-600 text-white`}
          onClick={() => callEndpoint('/api/v1/auth/login', { username: 'admin', password: 'wrong' })} disabled={loading !== null}>
          Login Falho
        </button>
        <button className={`${btnClass('login-timeout')} bg-amber-600/80 hover:bg-amber-600 text-white`}
          onClick={() => callEndpoint('/api/v1/auth/login', { username: 'timeout', password: 'x' })} disabled={loading !== null}>
          Simular Timeout
        </button>
        <button className={`${btnClass('mfa-valid')} bg-blue-600/80 hover:bg-blue-600 text-white`}
          onClick={() => callEndpoint('/api/v1/auth/mfa', { code: '123456' })} disabled={loading !== null}>
          MFA Valido
        </button>
        <button className={`${btnClass('mfa-invalid')} bg-orange-600/80 hover:bg-orange-600 text-white`}
          onClick={() => callEndpoint('/api/v1/auth/mfa', { code: '999999' })} disabled={loading !== null}>
          MFA Invalido
        </button>
        <button className={`${btnClass('mfa-expired')} bg-pink-600/80 hover:bg-pink-600 text-white`}
          onClick={() => callEndpoint('/api/v1/auth/mfa', { code: '000000' })} disabled={loading !== null}>
          MFA Expirado
        </button>
        <button className={`${btnClass('logout')} bg-gray-600/80 hover:bg-gray-600 text-white col-span-2 md:col-span-3`}
          onClick={() => callEndpoint('/api/v1/auth/logout')} disabled={loading !== null}>
          Logout
        </button>
      </div>
    </div>
  );
}
