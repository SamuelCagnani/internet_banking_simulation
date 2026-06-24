import logger from '../../../utils/logger';
import { IncidentLogEntry } from '../types/incidents.types';

export function logIncidentEvent(entry: IncidentLogEntry): void {
  logger.info({
    timestamp: entry.timestamp || new Date().toISOString(),
    event_type: entry.event_type,
    user_id: entry.user_id,
    ip_address: entry.ip_address,
    incident: entry.incident,
    status_code: entry.status_code,
    endpoint: entry.endpoint,
    response_time: entry.response_time,
  });
}
