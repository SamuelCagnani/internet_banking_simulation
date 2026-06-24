import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import MainPanel from './components/MainPanel';
import AuthPanel from './components/AuthPanel';
import FinancePanel from './components/FinancePanel';
import SecurityPanel from './components/SecurityPanel';
import IncidentPanel from './components/IncidentPanel';
import LogPanel from './components/LogPanel';

interface LogEntry {
  endpoint: string;
  status: number;
  body: string;
  time: number;
  timestamp: string;
}

const navItems = [
  { label: 'Dashboard', icon: 'dashboard' },
  { label: 'Segurança', icon: 'shield' },
  { label: 'Operações', icon: 'wallet' },
  { label: 'Incidentes', icon: 'alert' },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState('Dashboard');
  const [events, setEvents] = useState<LogEntry[]>([]);

  const activeNav = navItems.map((item) => ({
    ...item,
    active: item.label === currentPage,
  }));

  function handleEvent(ev: Omit<LogEntry, 'timestamp'>) {
    const entry: LogEntry = {
      ...ev,
      timestamp: new Date().toLocaleTimeString(),
    };
    setEvents((prev) => [entry, ...prev].slice(0, 50));
  }

  function renderPage() {
    switch (currentPage) {
      case 'Segurança':
        return (
          <>
            <AuthPanel onEvent={handleEvent} />
            <SecurityPanel onEvent={handleEvent} />
            <LogPanel events={events} />
          </>
        );
      case 'Operações':
        return (
          <>
            <FinancePanel onEvent={handleEvent} />
            <LogPanel events={events} />
          </>
        );
      case 'Incidentes':
        return (
          <>
            <IncidentPanel onEvent={handleEvent} />
            <LogPanel events={events} />
          </>
        );
      default:
        return <MainPanel />;
    }
  }

  return (
    <div className="flex h-screen bg-gray-900">
      <Sidebar items={activeNav} onNavigate={setCurrentPage} />
      <div className="flex-1 flex flex-col">
        <Header title={currentPage} />
        <div className="flex-1 p-6 overflow-y-auto">{renderPage()}</div>
      </div>
    </div>
  );
}
