import { useState } from 'react';
import axios from 'axios';

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
    `px-4 py-3 rounded-lg font-medium transition-colors text-sm ${
      loading === name ? 'opacity-50 cursor-wait' : ''
    }`;

  return (
    <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
      <h3 className="text-gray-400 text-sm uppercase tracking-wide mb-4">
        Painel de Segurança
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <button
          className={`${btnClass('register-device')} bg-green-600 hover:bg-green-700`}
          onClick={() =>
            callPost(
              '/api/v1/devices/register',
              { userId: 'user-1', deviceId: 'device-001', deviceName: 'iPhone 15' },
              'register-device',
            )
          }
          disabled={loading !== null}
        >
          Registrar Dispositivo
        </button>
        <button
          className={`${btnClass('suspicious-device')} bg-red-600 hover:bg-red-700`}
          onClick={() =>
            callPost(
              '/api/v1/devices/register',
              { userId: 'user-1', deviceId: 'suspicious', deviceName: 'Dispositivo Suspeito' },
              'suspicious-device',
            )
          }
          disabled={loading !== null}
        >
          Dispositivo Suspeito
        </button>
        <button
          className={`${btnClass('change-limit')} bg-indigo-600 hover:bg-indigo-700`}
          onClick={() =>
            callPut(
              '/api/v1/user/limits',
              { userId: 'user-1', newLimit: 5000 },
              'change-limit',
            )
          }
          disabled={loading !== null}
        >
          Alterar Limite PIX
        </button>
        <button
          className={`${btnClass('brute-force')} bg-yellow-600 hover:bg-yellow-700`}
          onClick={() =>
            callPost(
              '/api/v1/security/simulate/brute-force',
              { userId: 'user-1', attempts: 20 },
              'brute-force',
            )
          }
          disabled={loading !== null}
        >
          Simular Brute Force
        </button>
        <button
          className={`${btnClass('suspicious-activity')} bg-orange-600 hover:bg-orange-700`}
          onClick={() =>
            callPost(
              '/api/v1/security/simulate/suspicious',
              { userId: 'user-1' },
              'suspicious-activity',
            )
          }
          disabled={loading !== null}
        >
          Atividade Suspeita
        </button>
      </div>
    </div>
  );
}
