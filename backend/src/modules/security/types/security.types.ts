export interface DeviceRegistrationRequest {
  userId: string;
  deviceId: string;
  deviceName: string;
}

export interface DeviceRegistrationResponse {
  success: boolean;
  message: string;
  deviceId?: string;
}

export interface LimitChangeRequest {
  userId: string;
  newLimit: number;
}

export interface LimitChangeResponse {
  success: boolean;
  message: string;
  newLimit?: number;
}

export interface SimulateBruteForceRequest {
  userId: string;
  attempts: number;
}

export interface SimulateFraudResponse {
  success: boolean;
  message: string;
  risk_level: string;
}

export type AuditEventType =
  | 'DEVICE_REGISTERED'
  | 'DEVICE_BLOCKED'
  | 'LIMIT_CHANGED'
  | 'SUSPICIOUS_ACTIVITY'
  | 'BRUTE_FORCE_DETECTED';

export interface AuditLogEntry {
  timestamp?: string;
  event_type: AuditEventType;
  user_id: string;
  ip_address: string;
  risk_level: string;
  status_code: number;
  endpoint: string;
  response_time?: number;
  details?: string;
}
