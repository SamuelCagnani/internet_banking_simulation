import { AuthUser, LoginResponse, MfaResponse, LogoutResponse } from '../types/auth.types';

const users: AuthUser[] = [
  { id: '1', username: 'admin', password: '123456' },
  { id: '2', username: 'user', password: '654321' },
];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function login(username: string, password: string): Promise<{
  status: number;
  body: LoginResponse;
  userId: string;
  duration: number;
}> {
  const start = Date.now();

  if (username === 'timeout') {
    const waitMs = 3000 + Math.floor(Math.random() * 2000);
    await delay(waitMs);
    const duration = Date.now() - start;
    return {
      status: 503,
      body: { success: false, message: 'Serviço de autenticação indisponível' },
      userId: 'unknown',
      duration,
    };
  }

  const user = users.find((u) => u.username === username && u.password === password);

  if (!user) {
    const duration = Date.now() - start;
    return {
      status: 401,
      body: { success: false, message: 'Credenciais inválidas' },
      userId: 'unknown',
      duration,
    };
  }

  await delay(100 + Math.floor(Math.random() * 200));
  const duration = Date.now() - start;

  return {
    status: 200,
    body: {
      success: true,
      message: 'Login realizado com sucesso',
      token: 'fake-jwt-token',
    },
    userId: user.id,
    duration,
  };
}

export async function verifyMfa(code: string): Promise<{
  status: number;
  body: MfaResponse;
  duration: number;
}> {
  const start = Date.now();
  await delay(100 + Math.floor(Math.random() * 150));

  const duration = Date.now() - start;

  if (code === '123456') {
    return { status: 200, body: { success: true, message: 'MFA validado com sucesso' }, duration };
  }

  if (code === '000000') {
    return { status: 403, body: { success: false, message: 'Código MFA expirado' }, duration };
  }

  return { status: 401, body: { success: false, message: 'Código MFA inválido' }, duration };
}

export async function logout(): Promise<{
  status: number;
  body: LogoutResponse;
  duration: number;
}> {
  const start = Date.now();
  await delay(50 + Math.floor(Math.random() * 100));
  const duration = Date.now() - start;

  return {
    status: 200,
    body: { success: true, message: 'Logout realizado com sucesso' },
    duration,
  };
}
