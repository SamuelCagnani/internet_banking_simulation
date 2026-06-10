import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

export default function MainPanel() {
  const [health, setHealth] = useState<string>('Checking...');

  useEffect(() => {
    axios
      .get(`${API_URL}/api/v1/health`)
      .then((res) => setHealth(res.data.status))
      .catch(() => setHealth('DOWN'));
  }, []);

  return (
    <main className="flex-1">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-gray-400 text-sm uppercase tracking-wide">Servidor</h3>
          <p className="text-2xl font-bold mt-2 text-green-400">{health}</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-gray-400 text-sm uppercase tracking-wide">Requests</h3>
          <p className="text-2xl font-bold mt-2 text-blue-400">---</p>
        </div>

        <div className="bg-gray-800 rounded-lg p-6 border border-gray-700">
          <h3 className="text-gray-400 text-sm uppercase tracking-wide">Latência Média</h3>
          <p className="text-2xl font-bold mt-2 text-yellow-400">---</p>
        </div>
      </div>

      <div className="mt-8 bg-gray-800 rounded-lg p-6 border border-gray-700">
        <h3 className="text-gray-400 text-sm uppercase tracking-wide mb-4">
          Painel de Operações
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button
            className="bg-blue-600 hover:bg-blue-700 px-4 py-3 rounded-lg font-medium transition-colors"
            disabled
          >
            Consultar Saldo
          </button>
          <button
            className="bg-green-600 hover:bg-green-700 px-4 py-3 rounded-lg font-medium transition-colors"
            disabled
          >
            Fazer PIX
          </button>
          <button
            className="bg-purple-600 hover:bg-purple-700 px-4 py-3 rounded-lg font-medium transition-colors"
            disabled
          >
            Pagar Boleto
          </button>
          <button
            className="bg-red-600 hover:bg-red-700 px-4 py-3 rounded-lg font-medium transition-colors"
            disabled
          >
            Login
          </button>
        </div>
        <p className="text-gray-500 text-sm mt-4">
          Botões desabilitados — funcionalidades nas próximas sprints.
        </p>
      </div>
    </main>
  );
}
