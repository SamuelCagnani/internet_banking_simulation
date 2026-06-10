import logger from '../../../utils/logger';
import { SecurityLogEntry } from '../types/auth.types';

export function logSecurityEvent(entry: SecurityLogEntry): void {
  logger.info({
    timestamp: entry.timestamp || new Date().toISOString(),
    event_type: entry.event_type,
    user_id: entry.user_id,
    ip_address: entry.ip_address,
    endpoint: entry.endpoint,
    status_code: entry.status_code,
    response_time: entry.response_time,
    user_agent: entry.user_agent,
  });
}
