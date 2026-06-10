import { Request, Response } from 'express';
import { validateLogin, validateMfa } from '../validators/auth.validator';
import { login, verifyMfa, logout } from '../services/auth.service';
import { logSecurityEvent } from './security-logger';
import {
  loginSuccessTotal,
  loginFailuresTotal,
  mfaSuccessTotal,
  mfaFailuresTotal,
  authTimeoutTotal,
  authRequestDurationSeconds,
} from '../../../metrics/prometheus';

export async function loginHandler(req: Request, res: Response): Promise<void> {
  const start = Date.now();
  const ipAddress = req.ip || req.socket.remoteAddress || '127.0.0.1';
  const userAgent = req.headers['user-agent'] || 'unknown';

  const validation = validateLogin(req.body);
  if (!validation.valid || !validation.data) {
    res.status(400).json({ success: false, message: validation.errors.join(', ') });
    return;
  }

  const result = await login(validation.data.username, validation.data.password);
  const responseTime = Date.now() - start;

  authRequestDurationSeconds.observe(
    { method: 'POST', endpoint: '/api/v1/auth/login', status_code: String(result.status) },
    responseTime / 1000,
  );

  if (result.status === 200) {
    loginSuccessTotal.inc();
    logSecurityEvent({
      event_type: 'LOGIN_SUCCESS',
      user_id: result.userId,
      ip_address: ipAddress,
      endpoint: '/api/v1/auth/login',
      status_code: result.status,
      response_time: responseTime,
      user_agent: userAgent,
    });
  } else if (result.status === 401) {
    loginFailuresTotal.inc();
    logSecurityEvent({
      event_type: 'LOGIN_FAILURE',
      user_id: result.userId,
      ip_address: ipAddress,
      endpoint: '/api/v1/auth/login',
      status_code: result.status,
      response_time: responseTime,
      user_agent: userAgent,
    });
  } else if (result.status === 503) {
    authTimeoutTotal.inc();
    logSecurityEvent({
      event_type: 'AUTH_TIMEOUT',
      user_id: result.userId,
      ip_address: ipAddress,
      endpoint: '/api/v1/auth/login',
      status_code: result.status,
      response_time: responseTime,
      user_agent: userAgent,
    });
  }

  res.status(result.status).json(result.body);
}

export async function mfaHandler(req: Request, res: Response): Promise<void> {
  const start = Date.now();
  const ipAddress = req.ip || req.socket.remoteAddress || '127.0.0.1';
  const userAgent = req.headers['user-agent'] || 'unknown';

  const validation = validateMfa(req.body);
  if (!validation.valid || !validation.data) {
    res.status(400).json({ success: false, message: validation.errors.join(', ') });
    return;
  }

  const result = await verifyMfa(validation.data);
  const responseTime = Date.now() - start;

  authRequestDurationSeconds.observe(
    { method: 'POST', endpoint: '/api/v1/auth/mfa', status_code: String(result.status) },
    responseTime / 1000,
  );

  if (result.status === 200) {
    mfaSuccessTotal.inc();
    logSecurityEvent({
      event_type: 'MFA_SUCCESS',
      user_id: '1',
      ip_address: ipAddress,
      endpoint: '/api/v1/auth/mfa',
      status_code: result.status,
      response_time: responseTime,
      user_agent: userAgent,
    });
  } else {
    mfaFailuresTotal.inc();
    logSecurityEvent({
      event_type: 'MFA_FAILURE',
      user_id: '1',
      ip_address: ipAddress,
      endpoint: '/api/v1/auth/mfa',
      status_code: result.status,
      response_time: responseTime,
      user_agent: userAgent,
    });
  }

  res.status(result.status).json(result.body);
}

export async function logoutHandler(req: Request, res: Response): Promise<void> {
  const start = Date.now();
  const ipAddress = req.ip || req.socket.remoteAddress || '127.0.0.1';
  const userAgent = req.headers['user-agent'] || 'unknown';

  const result = await logout();
  const responseTime = Date.now() - start;

  authRequestDurationSeconds.observe(
    { method: 'POST', endpoint: '/api/v1/auth/logout', status_code: String(result.status) },
    responseTime / 1000,
  );

  logSecurityEvent({
    event_type: 'LOGOUT_SUCCESS',
    user_id: '1',
    ip_address: ipAddress,
    endpoint: '/api/v1/auth/logout',
    status_code: result.status,
    response_time: responseTime,
    user_agent: userAgent,
  });

  res.status(result.status).json(result.body);
}
