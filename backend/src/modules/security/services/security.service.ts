import {
  DeviceRegistrationResponse,
  LimitChangeResponse,
  SimulateFraudResponse,
} from '../types/security.types';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const userDevices: Map<string, string[]> = new Map();
const userLimitChanges: Map<string, number[]> = new Map();

export async function registerDevice(
  userId: string,
  deviceId: string,
  deviceName: string,
): Promise<{
  status: number;
  body: DeviceRegistrationResponse;
  duration: number;
}> {
  const start = Date.now();

  if (deviceId === 'suspicious' || deviceName.toLowerCase().includes('suspeito')) {
    await delay(50 + Math.floor(Math.random() * 100));
    return {
      status: 403,
      body: { success: false, message: 'Dispositivo bloqueado por suspeita de fraude' },
      duration: Date.now() - start,
    };
  }

  const devices = userDevices.get(userId) || [];

  if (devices.length >= 3 && deviceId !== 'override') {
    await delay(50 + Math.floor(Math.random() * 100));
    return {
      status: 403,
      body: { success: false, message: 'Múltiplos dispositivos detectados - possível fraude' },
      duration: Date.now() - start,
    };
  }

  devices.push(deviceId);
  userDevices.set(userId, devices);

  await delay(80 + Math.floor(Math.random() * 120));

  return {
    status: 201,
    body: { success: true, message: 'Dispositivo registrado com sucesso', deviceId },
    duration: Date.now() - start,
  };
}

export async function changeLimit(
  userId: string,
  newLimit: number,
): Promise<{
  status: number;
  body: LimitChangeResponse;
  duration: number;
}> {
  const start = Date.now();
  const now = Date.now();
  const changes = userLimitChanges.get(userId) || [];
  const recent = changes.filter((t) => now - t < 120000);

  if (recent.length >= 5) {
    await delay(50);
    return {
      status: 429,
      body: { success: false, message: 'Muitas alterações de limite - ação bloqueada temporariamente' },
      duration: Date.now() - start,
    };
  }

  recent.push(now);
  userLimitChanges.set(userId, recent);

  await delay(60 + Math.floor(Math.random() * 100));

  return {
    status: 200,
    body: { success: true, message: 'Limite PIX alterado com sucesso', newLimit },
    duration: Date.now() - start,
  };
}

export async function simulateBruteForce(
  userId: string,
  attempts: number,
): Promise<{
  status: number;
  body: SimulateFraudResponse;
  duration: number;
}> {
  const start = Date.now();

  await delay(50 + Math.floor(Math.random() * 100));

  if (attempts >= 15) {
    return {
      status: 403,
      body: {
        success: false,
        message: `Brute force detectado: ${attempts} tentativas de login em 1 minuto`,
        risk_level: 'HIGH',
      },
      duration: Date.now() - start,
    };
  }

  return {
    status: 200,
    body: {
      success: true,
      message: `${attempts} tentativas registradas - abaixo do limiar de alerta`,
      risk_level: 'LOW',
    },
    duration: Date.now() - start,
  };
}

export async function simulateSuspiciousActivity(
  userId: string,
): Promise<{
  status: number;
  body: SimulateFraudResponse;
  duration: number;
}> {
  const start = Date.now();

  await delay(50 + Math.floor(Math.random() * 100));

  return {
    status: 403,
    body: {
      success: false,
      message: 'Atividade suspeita detectada: comportamento anômalo de acesso',
      risk_level: 'CRITICAL',
    },
    duration: Date.now() - start,
  };
}
