import { Request, Response } from 'express';
import {
  validateDeviceRegister,
  validateLimitChange,
  validateBruteForce,
} from '../validators/security.validator';
import {
  registerDevice,
  changeLimit,
  simulateBruteForce,
  simulateSuspiciousActivity,
} from '../services/security.service';
import { logAuditEvent } from './security-logger';
import {
  deviceRegistrationsTotal,
  suspiciousActionsTotal,
  limitChangesTotal,
  bruteForceAttemptsTotal,
  securityRequestDurationSeconds,
} from '../../../metrics/prometheus';

export async function deviceRegisterHandler(req: Request, res: Response): Promise<void> {
  const start = Date.now();
  const ipAddress = req.ip || req.socket.remoteAddress || '127.0.0.1';

  const validation = validateDeviceRegister(req.body);
  if (!validation.valid || !validation.data) {
    res.status(400).json({ success: false, message: validation.errors.join(', ') });
    return;
  }

  const result = await registerDevice(
    validation.data.userId,
    validation.data.deviceId,
    validation.data.deviceName,
  );
  const responseTime = Date.now() - start;

  securityRequestDurationSeconds.observe(
    { method: 'POST', endpoint: '/api/v1/devices/register', status_code: String(result.status) },
    responseTime / 1000,
  );

  if (result.status === 201) {
    deviceRegistrationsTotal.inc();
    logAuditEvent({
      event_type: 'DEVICE_REGISTERED',
      user_id: validation.data.userId,
      ip_address: ipAddress,
      risk_level: 'LOW',
      status_code: result.status,
      endpoint: '/api/v1/devices/register',
      response_time: responseTime,
      details: `Device ${validation.data.deviceId} (${validation.data.deviceName}) registered`,
    });
  } else {
    suspiciousActionsTotal.inc();
    logAuditEvent({
      event_type: 'DEVICE_BLOCKED',
      user_id: validation.data.userId,
      ip_address: ipAddress,
      risk_level: 'HIGH',
      status_code: result.status,
      endpoint: '/api/v1/devices/register',
      response_time: responseTime,
      details: result.body.message,
    });
  }

  res.status(result.status).json(result.body);
}

export async function limitChangeHandler(req: Request, res: Response): Promise<void> {
  const start = Date.now();
  const ipAddress = req.ip || req.socket.remoteAddress || '127.0.0.1';

  const validation = validateLimitChange(req.body);
  if (!validation.valid || !validation.data) {
    res.status(400).json({ success: false, message: validation.errors.join(', ') });
    return;
  }

  const result = await changeLimit(validation.data.userId, validation.data.newLimit);
  const responseTime = Date.now() - start;

  securityRequestDurationSeconds.observe(
    { method: 'PUT', endpoint: '/api/v1/user/limits', status_code: String(result.status) },
    responseTime / 1000,
  );

  if (result.status === 200) {
    limitChangesTotal.inc();
    logAuditEvent({
      event_type: 'LIMIT_CHANGED',
      user_id: validation.data.userId,
      ip_address: ipAddress,
      risk_level: 'MEDIUM',
      status_code: result.status,
      endpoint: '/api/v1/user/limits',
      response_time: responseTime,
      details: `Limit changed to ${validation.data.newLimit}`,
    });
  } else {
    suspiciousActionsTotal.inc();
    logAuditEvent({
      event_type: 'LIMIT_CHANGED',
      user_id: validation.data.userId,
      ip_address: ipAddress,
      risk_level: 'HIGH',
      status_code: result.status,
      endpoint: '/api/v1/user/limits',
      response_time: responseTime,
      details: result.body.message,
    });
  }

  res.status(result.status).json(result.body);
}

export async function bruteForceHandler(req: Request, res: Response): Promise<void> {
  const start = Date.now();
  const ipAddress = req.ip || req.socket.remoteAddress || '127.0.0.1';

  const validation = validateBruteForce(req.body);
  if (!validation.valid || !validation.data) {
    res.status(400).json({ success: false, message: validation.errors.join(', ') });
    return;
  }

  const result = await simulateBruteForce(validation.data.userId, validation.data.attempts);
  const responseTime = Date.now() - start;

  securityRequestDurationSeconds.observe(
    { method: 'POST', endpoint: '/api/v1/security/simulate/brute-force', status_code: String(result.status) },
    responseTime / 1000,
  );

  bruteForceAttemptsTotal.inc(validation.data.attempts);
  suspiciousActionsTotal.inc();

  logAuditEvent({
    event_type: 'BRUTE_FORCE_DETECTED',
    user_id: validation.data.userId,
    ip_address: ipAddress,
    risk_level: result.body.risk_level,
    status_code: result.status,
    endpoint: '/api/v1/security/simulate/brute-force',
    response_time: responseTime,
    details: `Brute force simulation: ${validation.data.attempts} attempts`,
  });

  res.status(result.status).json(result.body);
}

export async function suspiciousActivityHandler(req: Request, res: Response): Promise<void> {
  const start = Date.now();
  const ipAddress = req.ip || req.socket.remoteAddress || '127.0.0.1';
  const userId = req.body.userId || 'unknown';

  const result = await simulateSuspiciousActivity(userId);
  const responseTime = Date.now() - start;

  securityRequestDurationSeconds.observe(
    { method: 'POST', endpoint: '/api/v1/security/simulate/suspicious', status_code: String(result.status) },
    responseTime / 1000,
  );

  suspiciousActionsTotal.inc();

  logAuditEvent({
    event_type: 'SUSPICIOUS_ACTIVITY',
    user_id: userId,
    ip_address: ipAddress,
    risk_level: result.body.risk_level,
    status_code: result.status,
    endpoint: '/api/v1/security/simulate/suspicious',
    response_time: responseTime,
    details: result.body.message,
  });

  res.status(result.status).json(result.body);
}
