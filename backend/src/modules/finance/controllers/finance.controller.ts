import { Request, Response } from 'express';
import { validatePix, validateBoleto } from '../validators/finance.validator';
import { getBalance, processPix, processBoleto } from '../services/finance.service';
import { logFinanceEvent } from './finance-logger';
import {
  pixTransactionsTotal,
  pixFailuresTotal,
  pixTimeoutTotal,
  boletoPaymentsTotal,
  boletoFailuresTotal,
  financeRequestDurationSeconds,
  transactionVolumeTotal,
} from '../../../metrics/prometheus';

export async function balanceHandler(req: Request, res: Response): Promise<void> {
  const start = Date.now();
  const slow = req.query.slow === 'true';
  const accountId = (req.query.account as string) || '123';

  const result = await getBalance(accountId, slow);
  const responseTime = Date.now() - start;

  financeRequestDurationSeconds.observe(
    { method: 'GET', endpoint: '/api/v1/account/balance', status_code: String(result.status) },
    responseTime / 1000,
  );

  logFinanceEvent({
    event_type: 'BALANCE_REQUEST',
    status_code: result.status,
    response_time: responseTime,
    user_id: accountId,
    amount: result.balance,
    endpoint: '/api/v1/account/balance',
    method: 'GET',
  });

  res.status(result.status).json(result.body);
}

export async function pixHandler(req: Request, res: Response): Promise<void> {
  const start = Date.now();

  const validation = validatePix(req.body);
  if (!validation.valid || !validation.data) {
    res.status(400).json({ success: false, message: validation.errors.join(', ') });
    return;
  }

  const result = await processPix(
    validation.data.fromAccount,
    validation.data.toAccount,
    validation.data.amount,
  );
  const responseTime = Date.now() - start;

  financeRequestDurationSeconds.observe(
    { method: 'POST', endpoint: '/api/v1/transactions/pix', status_code: String(result.status) },
    responseTime / 1000,
  );

  transactionVolumeTotal.set(validation.data.amount);

  if (result.status === 201) {
    pixTransactionsTotal.inc();
    logFinanceEvent({
      event_type: 'PIX_SUCCESS',
      transaction_id: result.transactionId,
      amount: result.amount,
      status_code: result.status,
      response_time: responseTime,
      user_id: validation.data.fromAccount,
      endpoint: '/api/v1/transactions/pix',
      method: 'POST',
    });
  } else if (result.status === 503) {
    pixTimeoutTotal.inc();
    logFinanceEvent({
      event_type: 'PIX_TIMEOUT',
      transaction_id: result.transactionId,
      amount: result.amount,
      status_code: result.status,
      response_time: responseTime,
      user_id: validation.data.fromAccount,
      endpoint: '/api/v1/transactions/pix',
      method: 'POST',
    });
  } else {
    pixFailuresTotal.inc();
    logFinanceEvent({
      event_type: 'PIX_FAILURE',
      transaction_id: result.transactionId,
      amount: result.amount,
      status_code: result.status,
      response_time: responseTime,
      user_id: validation.data.fromAccount,
      endpoint: '/api/v1/transactions/pix',
      method: 'POST',
    });
  }

  res.status(result.status).json(result.body);
}

export async function boletoHandler(req: Request, res: Response): Promise<void> {
  const start = Date.now();

  const validation = validateBoleto(req.body);
  if (!validation.valid || !validation.data) {
    res.status(400).json({ success: false, message: validation.errors.join(', ') });
    return;
  }

  const result = await processBoleto(
    validation.data.boletoCode,
    validation.data.amount,
  );
  const responseTime = Date.now() - start;

  financeRequestDurationSeconds.observe(
    { method: 'POST', endpoint: '/api/v1/payments/boleto', status_code: String(result.status) },
    responseTime / 1000,
  );

  if (result.status === 200) {
    boletoPaymentsTotal.inc();
    logFinanceEvent({
      event_type: 'BOLETO_SUCCESS',
      transaction_id: result.transactionId,
      amount: result.amount,
      status_code: result.status,
      response_time: responseTime,
      user_id: '123',
      endpoint: '/api/v1/payments/boleto',
      method: 'POST',
    });
  } else {
    boletoFailuresTotal.inc();
    logFinanceEvent({
      event_type: 'BOLETO_FAILURE',
      transaction_id: result.transactionId,
      amount: result.amount,
      status_code: result.status,
      response_time: responseTime,
      user_id: '123',
      endpoint: '/api/v1/payments/boleto',
      method: 'POST',
    });
  }

  res.status(result.status).json(result.body);
}
