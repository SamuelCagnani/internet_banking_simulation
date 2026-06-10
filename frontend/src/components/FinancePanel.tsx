import { useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

interface RequestStatus {
  endpoint: string;
  status: number;
  body: string;
  time: number;
}

export default function FinancePanel({ onEvent }: { onEvent: (e: RequestStatus) => void }) {
  const [loading, setLoading] = useState<string | null>(null);

  async function callGet(endpoint: string, label: string) {
    setLoading(label);
    const start = Date.now();
    try {
      const res = await axios.get(`${API_URL}${endpoint}`);
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

  async function callPost(endpoint: string, payload: object, label: string) {
    setLoading(label);
    const start = Date.now();
    try {
      const res = await axios.post(`${API_URL}${endpoint}`, payload, { timeout: 15000 });
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
        Painel Financeiro
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        <button
          className={`${btnClass('balance')} bg-indigo-600 hover:bg-indigo-700`}
          onClick={() => callGet('/api/v1/account/balance?account=123', 'balance')}
          disabled={loading !== null}
        >
          Consultar Saldo
        </button>
        <button
          className={`${btnClass('balance-slow')} bg-indigo-800 hover:bg-indigo-900`}
          onClick={() => callGet('/api/v1/account/balance?account=123&slow=true', 'balance-slow')}
          disabled={loading !== null}
        >
          Saldo Lento
        </button>
        <button
          className={`${btnClass('pix-success')} bg-green-600 hover:bg-green-700`}
          onClick={() => callPost('/api/v1/transactions/pix', { fromAccount: '123', toAccount: '456', amount: 250 }, 'pix-success')}
          disabled={loading !== null}
        >
          PIX Sucesso
        </button>
        <button
          className={`${btnClass('pix-insufficient')} bg-red-600 hover:bg-red-700`}
          onClick={() => callPost('/api/v1/transactions/pix', { fromAccount: '123', toAccount: '456', amount: 99999 }, 'pix-insufficient')}
          disabled={loading !== null}
        >
          PIX sem Saldo
        </button>
        <button
          className={`${btnClass('pix-timeout')} bg-yellow-600 hover:bg-yellow-700`}
          onClick={() => callPost('/api/v1/transactions/pix', { fromAccount: '123', toAccount: '456', amount: 999 }, 'pix-timeout')}
          disabled={loading !== null}
        >
          PIX Timeout
        </button>
        <button
          className={`${btnClass('pix-slow')} bg-orange-600 hover:bg-orange-700`}
          onClick={() => callPost('/api/v1/transactions/pix', { fromAccount: '123', toAccount: 'slow', amount: 100 }, 'pix-slow')}
          disabled={loading !== null}
        >
          Simular Latência
        </button>
        <button
          className={`${btnClass('boleto-success')} bg-blue-600 hover:bg-blue-700`}
          onClick={() => callPost('/api/v1/payments/boleto', { boletoCode: '123456', amount: 150 }, 'boleto-success')}
          disabled={loading !== null}
        >
          Pagar Boleto
        </button>
        <button
          className={`${btnClass('boleto-invalid')} bg-pink-600 hover:bg-pink-700`}
          onClick={() => callPost('/api/v1/payments/boleto', { boletoCode: '00', amount: 50 }, 'boleto-invalid')}
          disabled={loading !== null}
        >
          Boleto Inválido
        </button>
        <button
          className={`${btnClass('boleto-expired')} bg-purple-600 hover:bg-purple-700`}
          onClick={() => callPost('/api/v1/payments/boleto', { boletoCode: '999', amount: 50 }, 'boleto-expired')}
          disabled={loading !== null}
        >
          Boleto Vencido
        </button>
      </div>
    </div>
  );
}
