import logger from '../../../utils/logger';
import { AuditLogEntry } from '../types/security.types';

export function logAuditEvent(entry: AuditLogEntry): void {
  logger.info({
    timestamp: entry.timestamp || new Date().toISOString(),
    event_type: entry.event_type,
    user_id: entry.user_id,
    ip_address: entry.ip_address,
    risk_level: entry.risk_level,
    status_code: entry.status_code,
    endpoint: entry.endpoint,
    response_time: entry.response_time,
    details: entry.details,
  });
}
