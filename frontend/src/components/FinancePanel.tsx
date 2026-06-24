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
    `px-4 py-2.5 rounded-lg font-medium transition-all duration-200 text-sm
     ${loading === name ? 'opacity-50 cursor-wait' : 'hover:scale-[1.02] active:scale-[0.98]'}`;

  return (
    <div className="card-glass rounded-xl p-6 border border-white/[0.04] mb-6">
      <div className="flex items-center gap-3 mb-4">
        <div className="w-8 h-8 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
          <Icon name="wallet" size={16} className="text-emerald-400" />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-white">Painel Financeiro</h3>
          <p className="text-xs text-gray-500">Sprint 3 — Saldo, PIX, Boletos</p>
        </div>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5">
        <button className={`${btnClass('balance')} bg-indigo-600/80 hover:bg-indigo-600 text-white`}
          onClick={() => callGet('/api/v1/account/balance?account=123', 'balance')} disabled={loading !== null}>
          Consultar Saldo
        </button>
        <button className={`${btnClass('balance-slow')} bg-indigo-800/80 hover:bg-indigo-800 text-white`}
          onClick={() => callGet('/api/v1/account/balance?account=123&slow=true', 'balance-slow')} disabled={loading !== null}>
          Saldo Lento
        </button>
        <button className={`${btnClass('pix-success')} bg-emerald-600/80 hover:bg-emerald-600 text-white`}
          onClick={() => callPost('/api/v1/transactions/pix', { fromAccount: '123', toAccount: '456', amount: 250 }, 'pix-success')} disabled={loading !== null}>
          PIX Sucesso
        </button>
        <button className={`${btnClass('pix-insufficient')} bg-red-600/80 hover:bg-red-600 text-white`}
          onClick={() => callPost('/api/v1/transactions/pix', { fromAccount: '123', toAccount: '456', amount: 99999 }, 'pix-insufficient')} disabled={loading !== null}>
          PIX sem Saldo
        </button>
        <button className={`${btnClass('pix-timeout')} bg-amber-600/80 hover:bg-amber-600 text-white`}
          onClick={() => callPost('/api/v1/transactions/pix', { fromAccount: '123', toAccount: '456', amount: 999 }, 'pix-timeout')} disabled={loading !== null}>
          PIX Timeout
        </button>
        <button className={`${btnClass('pix-slow')} bg-orange-600/80 hover:bg-orange-600 text-white`}
          onClick={() => callPost('/api/v1/transactions/pix', { fromAccount: '123', toAccount: 'slow', amount: 100 }, 'pix-slow')} disabled={loading !== null}>
          Simular Latencia
        </button>
        <button className={`${btnClass('boleto-success')} bg-blue-600/80 hover:bg-blue-600 text-white`}
          onClick={() => callPost('/api/v1/payments/boleto', { boletoCode: '123456', amount: 150 }, 'boleto-success')} disabled={loading !== null}>
          Pagar Boleto
        </button>
        <button className={`${btnClass('boleto-invalid')} bg-pink-600/80 hover:bg-pink-600 text-white`}
          onClick={() => callPost('/api/v1/payments/boleto', { boletoCode: '00', amount: 50 }, 'boleto-invalid')} disabled={loading !== null}>
          Boleto Invalido
        </button>
        <button className={`${btnClass('boleto-expired')} bg-purple-600/80 hover:bg-purple-600 text-white`}
          onClick={() => callPost('/api/v1/payments/boleto', { boletoCode: '999', amount: 50 }, 'boleto-expired')} disabled={loading !== null}>
          Boleto Vencido
        </button>
      </div>
    </div>
  );
}
