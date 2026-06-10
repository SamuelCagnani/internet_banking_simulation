import { useState } from 'react';
import axios from 'axios';

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
      const res = await axios.post(`${API_URL}${endpoint}`, payload, {
        timeout: 10000,
      });
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
    `px-4 py-3 rounded-lg font-medium transition-colors text-sm ${
      loading === name ? 'opacity-50 cursor-wait' : ''
    }`;

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-gray-400 text-sm uppercase tracking-wide mb-4">
        Painel de Autenticação
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <button
          className={`${btnClass('login-success')} bg-green-600 hover:bg-green-700`}
          onClick={() => callEndpoint('/api/v1/auth/login', { username: 'admin', password: '123456' })}
          disabled={loading !== null}
        >
          Login Sucesso
        </button>
        <button
          className={`${btnClass('login-fail')} bg-red-600 hover:bg-red-700`}
          onClick={() => callEndpoint('/api/v1/auth/login', { username: 'admin', password: 'wrong' })}
          disabled={loading !== null}
        >
          Login Falho
        </button>
        <button
          className={`${btnClass('login-timeout')} bg-yellow-600 hover:bg-yellow-700`}
          onClick={() => callEndpoint('/api/v1/auth/login', { username: 'timeout', password: 'x' })}
          disabled={loading !== null}
        >
          Simular Timeout
        </button>
        <button
          className={`${btnClass('mfa-valid')} bg-blue-600 hover:bg-blue-700`}
          onClick={() => callEndpoint('/api/v1/auth/mfa', { code: '123456' })}
          disabled={loading !== null}
        >
          MFA Válido
        </button>
        <button
          className={`${btnClass('mfa-invalid')} bg-orange-600 hover:bg-orange-700`}
          onClick={() => callEndpoint('/api/v1/auth/mfa', { code: '999999' })}
          disabled={loading !== null}
        >
          MFA Inválido
        </button>
        <button
          className={`${btnClass('mfa-expired')} bg-pink-600 hover:bg-pink-700`}
          onClick={() => callEndpoint('/api/v1/auth/mfa', { code: '000000' })}
          disabled={loading !== null}
        >
          MFA Expirado
        </button>
        <button
          className={`${btnClass('logout')} bg-gray-600 hover:bg-gray-700 col-span-2 md:col-span-3`}
          onClick={() => callEndpoint('/api/v1/auth/logout')}
          disabled={loading !== null}
        >
          Logout
        </button>
      </div>
    </div>
  );
}
