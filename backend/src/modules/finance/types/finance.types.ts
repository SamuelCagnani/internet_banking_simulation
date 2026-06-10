export interface Account {
  id: string;
  balance: number;
  currency: string;
}

export interface BalanceResponse {
  balance: number;
  currency: string;
}

export interface PixRequest {
  fromAccount: string;
  toAccount: string;
  amount: number;
}

export interface PixResponse {
  success: boolean;
  message: string;
  transactionId?: string;
  amount?: number;
}

export interface BoletoRequest {
  boletoCode: string;
  amount: number;
}

export interface BoletoResponse {
  success: boolean;
  message: string;
  transactionId?: string;
}

export type FinanceEventType =
  | 'PIX_SUCCESS'
  | 'PIX_FAILURE'
  | 'PIX_TIMEOUT'
  | 'BALANCE_REQUEST'
  | 'BOLETO_SUCCESS'
  | 'BOLETO_FAILURE';

export interface FinanceLogEntry {
  timestamp?: string;
  event_type: FinanceEventType;
  transaction_id?: string;
  amount?: number;
  status_code: number;
  response_time: number;
  user_id: string;
  endpoint: string;
  method: string;
}
