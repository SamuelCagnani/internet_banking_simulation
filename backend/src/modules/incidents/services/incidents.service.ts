import { IncidentResponse, RecoveryResponse } from '../types/incidents.types';
import { setServiceDown, isServiceDown } from '../../../services/health.service';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const activeIncidents: string[] = [];
let simulatedCpu = 5;
let simulatedMemory = 10;

export function getActiveIncidents(): string[] {
  return [...activeIncidents];
}

export function getSimulatedCpu(): number {
  return simulatedCpu;
}

export function getSimulatedMemory(): number {
  return simulatedMemory;
}

function addIncident(name: string): void {
  if (!activeIncidents.includes(name)) {
    activeIncidents.push(name);
  }
}

function removeIncident(name: string): void {
  const idx = activeIncidents.indexOf(name);
  if (idx !== -1) {
    activeIncidents.splice(idx, 1);
  }
}

export async function triggerServiceDown(
  userId: string,
): Promise<{ status: number; body: IncidentResponse; duration: number }> {
  const start = Date.now();

  setServiceDown(true);
  addIncident('service-down');
  simulatedCpu = 95;
  simulatedMemory = 87;

  await delay(50 + Math.floor(Math.random() * 100));

  return {
    status: 503,
    body: {
      success: false,
      message: 'Serviço em estado DOWN - healthcheck comprometido',
      incident: 'service-down',
      duration: Date.now() - start,
      activeIncidents: getActiveIncidents(),
    },
    duration: Date.now() - start,
  };
}

export async function triggerTimeout(
  incidentDelay: number,
  userId: string,
): Promise<{ status: number; body: IncidentResponse; duration: number }> {
  const start = Date.now();
  const waitMs = incidentDelay || 5000 + Math.floor(Math.random() * 3000);

  addIncident('timeout');
  simulatedCpu = 60;

  await delay(waitMs);

  return {
    status: 504,
    body: {
      success: false,
      message: `Timeout simulado após ${waitMs}ms - endpoints financeiros comprometidos`,
      incident: 'timeout',
      duration: Date.now() - start,
      activeIncidents: getActiveIncidents(),
    },
    duration: Date.now() - start,
  };
}

export async function triggerInternalError(
  userId: string,
): Promise<{ status: number; body: IncidentResponse; duration: number }> {
  const start = Date.now();

  addIncident('internal-error');
  simulatedCpu = 80;
  simulatedMemory = 65;

  await delay(50 + Math.floor(Math.random() * 100));

  return {
    status: 500,
    body: {
      success: false,
      message: 'Erro interno do servidor - exceção controlada simulada',
      incident: 'internal-error',
      duration: Date.now() - start,
      activeIncidents: getActiveIncidents(),
    },
    duration: Date.now() - start,
  };
}

export async function triggerOverload(
  userId: string,
): Promise<{ status: number; body: IncidentResponse; duration: number }> {
  const start = Date.now();

  addIncident('overload');
  simulatedCpu = 99;
  simulatedMemory = 95;

  await delay(2000 + Math.floor(Math.random() * 2000));

  return {
    status: 503,
    body: {
      success: false,
      message: 'Sobrecarga detectada - múltiplas requisições simultâneas elevando latência',
      incident: 'overload',
      duration: Date.now() - start,
      activeIncidents: getActiveIncidents(),
    },
    duration: Date.now() - start,
  };
}

export async function recoverSystem(
  userId: string,
): Promise<{ status: number; body: RecoveryResponse; duration: number }> {
  const start = Date.now();

  const cleared = [...activeIncidents];

  setServiceDown(false);
  activeIncidents.length = 0;
  simulatedCpu = 5;
  simulatedMemory = 10;

  await delay(300 + Math.floor(Math.random() * 500));

  return {
    status: 200,
    body: {
      success: true,
      message: 'Sistema restaurado com sucesso - todos os incidentes resolvidos',
      incidentsCleared: cleared,
    },
    duration: Date.now() - start,
  };
}
