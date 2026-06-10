export interface AuthUser {
  id: string;
  username: string;
  password: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface MfaRequest {
  code: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  token?: string;
}

export interface MfaResponse {
  success: boolean;
  message: string;
}

export interface LogoutResponse {
  success: boolean;
  message: string;
}

export type SecurityEventType =
  | 'LOGIN_SUCCESS'
  | 'LOGIN_FAILURE'
  | 'MFA_SUCCESS'
  | 'MFA_FAILURE'
  | 'LOGOUT_SUCCESS'
  | 'AUTH_TIMEOUT';

export interface SecurityLogEntry {
  timestamp?: string;
  event_type: SecurityEventType;
  user_id: string;
  ip_address: string;
  endpoint: string;
  status_code: number;
  response_time: number;
  user_agent: string;
}
