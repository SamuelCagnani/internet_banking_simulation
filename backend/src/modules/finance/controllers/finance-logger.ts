import logger from '../../../utils/logger';
import { FinanceLogEntry } from '../types/finance.types';

export function logFinanceEvent(entry: FinanceLogEntry): void {
  logger.info({
    timestamp: entry.timestamp || new Date().toISOString(),
    event_type: entry.event_type,
    transaction_id: entry.transaction_id,
    amount: entry.amount,
    status_code: entry.status_code,
    response_time: entry.response_time,
    user_id: entry.user_id,
    endpoint: entry.endpoint,
    method: entry.method,
  });
}
