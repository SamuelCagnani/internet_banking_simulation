export interface IncidentResponse {
  success: boolean;
  message: string;
  incident?: string;
  duration?: number;
  activeIncidents?: string[];
}

export interface RecoveryResponse {
  success: boolean;
  message: string;
  incidentsCleared: string[];
}

export type IncidentEventType =
  | 'SERVICE_DOWN'
  | 'TIMEOUT_EVENT'
  | 'INTERNAL_ERROR'
  | 'OVERLOAD_DETECTED'
  | 'HEALTHCHECK_FAILED';

export interface IncidentLogEntry {
  timestamp?: string;
  event_type: IncidentEventType;
  user_id: string;
  ip_address: string;
  incident: string;
  status_code: number;
  endpoint: string;
  response_time?: number;
}
