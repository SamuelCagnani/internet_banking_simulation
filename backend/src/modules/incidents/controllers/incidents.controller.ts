import { Request, Response } from 'express';
import {
  triggerServiceDown,
  triggerTimeout,
  triggerInternalError,
  triggerOverload,
  recoverSystem,
  getActiveIncidents,
  getSimulatedCpu,
  getSimulatedMemory,
} from '../services/incidents.service';
import { logIncidentEvent } from './incidents-logger';
import {
  incidentsTotal,
  serviceDownTotal,
  timeoutEventsTotal,
  internalErrorsTotal,
  overloadEventsTotal,
  incidentRequestDurationSeconds,
  simulatedCpuUsage,
  simulatedMemoryUsage,
  activeIncidentsGauge,
} from '../../../metrics/prometheus';

function updateGauges(): void {
  simulatedCpuUsage.set(getSimulatedCpu());
  simulatedMemoryUsage.set(getSimulatedMemory());
  activeIncidentsGauge.set(getActiveIncidents().length);
}

export async function serviceDownHandler(req: Request, res: Response): Promise<void> {
  const start = Date.now();
  const ipAddress = req.ip || req.socket.remoteAddress || '127.0.0.1';
  const userId = req.body.userId || 'system';

  const result = await triggerServiceDown(userId);
  const responseTime = Date.now() - start;

  incidentRequestDurationSeconds.observe(
    { method: 'POST', endpoint: '/api/v1/incidents/service-down', status_code: String(result.status) },
    responseTime / 1000,
  );

  incidentsTotal.inc();
  serviceDownTotal.inc();
  updateGauges();

  logIncidentEvent({
    event_type: 'SERVICE_DOWN',
    user_id: userId,
    ip_address: ipAddress,
    incident: 'service-down',
    status_code: result.status,
    endpoint: '/api/v1/incidents/service-down',
    response_time: responseTime,
  });

  res.status(result.status).json(result.body);
}

export async function timeoutHandler(req: Request, res: Response): Promise<void> {
  const start = Date.now();
  const ipAddress = req.ip || req.socket.remoteAddress || '127.0.0.1';
  const userId = req.body.userId || 'system';
  const incidentDelay = req.body.delay || 5000;

  const result = await triggerTimeout(incidentDelay, userId);
  const responseTime = Date.now() - start;

  incidentRequestDurationSeconds.observe(
    { method: 'POST', endpoint: '/api/v1/incidents/timeout', status_code: String(result.status) },
    responseTime / 1000,
  );

  incidentsTotal.inc();
  timeoutEventsTotal.inc();
  updateGauges();

  logIncidentEvent({
    event_type: 'TIMEOUT_EVENT',
    user_id: userId,
    ip_address: ipAddress,
    incident: 'timeout',
    status_code: result.status,
    endpoint: '/api/v1/incidents/timeout',
    response_time: responseTime,
  });

  res.status(result.status).json(result.body);
}

export async function internalErrorHandler(req: Request, res: Response): Promise<void> {
  const start = Date.now();
  const ipAddress = req.ip || req.socket.remoteAddress || '127.0.0.1';
  const userId = req.body.userId || 'system';

  const result = await triggerInternalError(userId);
  const responseTime = Date.now() - start;

  incidentRequestDurationSeconds.observe(
    { method: 'POST', endpoint: '/api/v1/incidents/internal-error', status_code: String(result.status) },
    responseTime / 1000,
  );

  incidentsTotal.inc();
  internalErrorsTotal.inc();
  updateGauges();

  logIncidentEvent({
    event_type: 'INTERNAL_ERROR',
    user_id: userId,
    ip_address: ipAddress,
    incident: 'internal-error',
    status_code: result.status,
    endpoint: '/api/v1/incidents/internal-error',
    response_time: responseTime,
  });

  res.status(result.status).json(result.body);
}

export async function overloadHandler(req: Request, res: Response): Promise<void> {
  const start = Date.now();
  const ipAddress = req.ip || req.socket.remoteAddress || '127.0.0.1';
  const userId = req.body.userId || 'system';

  const result = await triggerOverload(userId);
  const responseTime = Date.now() - start;

  incidentRequestDurationSeconds.observe(
    { method: 'POST', endpoint: '/api/v1/incidents/overload', status_code: String(result.status) },
    responseTime / 1000,
  );

  incidentsTotal.inc();
  overloadEventsTotal.inc();
  updateGauges();

  logIncidentEvent({
    event_type: 'OVERLOAD_DETECTED',
    user_id: userId,
    ip_address: ipAddress,
    incident: 'overload',
    status_code: result.status,
    endpoint: '/api/v1/incidents/overload',
    response_time: responseTime,
  });

  res.status(result.status).json(result.body);
}

export async function recoverHandler(req: Request, res: Response): Promise<void> {
  const start = Date.now();
  const ipAddress = req.ip || req.socket.remoteAddress || '127.0.0.1';
  const userId = req.body.userId || 'system';

  const result = await recoverSystem(userId);
  const responseTime = Date.now() - start;

  incidentRequestDurationSeconds.observe(
    { method: 'POST', endpoint: '/api/v1/incidents/recover', status_code: String(result.status) },
    responseTime / 1000,
  );

  updateGauges();

  logIncidentEvent({
    event_type: 'HEALTHCHECK_FAILED',
    user_id: userId,
    ip_address: ipAddress,
    incident: 'recover',
    status_code: result.status,
    endpoint: '/api/v1/incidents/recover',
    response_time: responseTime,
  });

  res.status(result.status).json(result.body);
}

export async function activeIncidentsHandler(req: Request, res: Response): Promise<void> {
  const incidents = getActiveIncidents();
  res.status(200).json({ activeIncidents: incidents, count: incidents.length });
}
