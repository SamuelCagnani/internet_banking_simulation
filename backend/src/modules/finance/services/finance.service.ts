import { Account, BalanceResponse, PixResponse, BoletoResponse } from '../types/finance.types';

const accounts: Account[] = [
  { id: '123', balance: 5234.87, currency: 'BRL' },
  { id: '456', balance: 1500.00, currency: 'BRL' },
  { id: '789', balance: 100.00, currency: 'BRL' },
];

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

let transactionCounter = 0;

function nextTransactionId(): string {
  transactionCounter++;
  return `txn-${Date.now()}-${transactionCounter}`;
}

export async function getBalance(accountId: string, slow: boolean): Promise<{
  status: number;
  body: BalanceResponse;
  duration: number;
  balance: number;
}> {
  const start = Date.now();

  if (slow) {
    await delay(3000 + Math.floor(Math.random() * 2000));
  } else {
    await delay(50 + Math.floor(Math.random() * 100));
  }

  const account = accounts.find((a) => a.id === accountId) || accounts[0];
  const duration = Date.now() - start;

  return {
    status: 200,
    body: { balance: account.balance, currency: account.currency },
    duration,
    balance: account.balance,
  };
}

export async function processPix(
  fromAccount: string,
  toAccount: string,
  amount: number,
): Promise<{
  status: number;
  body: PixResponse;
  duration: number;
  transactionId: string;
  amount: number;
}> {
  const start = Date.now();
  const transactionId = nextTransactionId();

  const from = accounts.find((a) => a.id === fromAccount);
  if (!from) {
    await delay(50);
    return {
      status: 404,
      body: { success: false, message: 'Conta de origem não encontrada' },
      duration: Date.now() - start,
      transactionId,
      amount,
    };
  }

  if (amount === 999) {
    await delay(3000 + Math.floor(Math.random() * 2000));
    return {
      status: 503,
      body: { success: false, message: 'Timeout na comunicação com o BACEN' },
      duration: Date.now() - start,
      transactionId,
      amount,
    };
  }

  if (toAccount === 'slow') {
    await delay(5000);
    const duration = Date.now() - start;
    from.balance -= amount;
    return {
      status: 201,
      body: { success: true, message: 'PIX realizado com sucesso (com latência)', transactionId, amount },
      duration,
      transactionId,
      amount,
    };
  }

  if (from.balance < amount) {
    await delay(50 + Math.floor(Math.random() * 100));
    return {
      status: 422,
      body: { success: false, message: 'Saldo insuficiente para realizar o PIX' },
      duration: Date.now() - start,
      transactionId,
      amount,
    };
  }

  await delay(100 + Math.floor(Math.random() * 200));
  from.balance -= amount;

  const to = accounts.find((a) => a.id === toAccount);
  if (to) {
    to.balance += amount;
  }

  return {
    status: 201,
    body: { success: true, message: 'PIX realizado com sucesso', transactionId, amount },
    duration: Date.now() - start,
    transactionId,
    amount,
  };
}

export async function processBoleto(
  boletoCode: string,
  amount: number,
): Promise<{
  status: number;
  body: BoletoResponse;
  duration: number;
  transactionId: string;
  amount: number;
}> {
  const start = Date.now();
  const transactionId = nextTransactionId();

  if (boletoCode === '000' || boletoCode.length < 3) {
    await delay(50 + Math.floor(Math.random() * 50));
    return {
      status: 400,
      body: { success: false, message: 'Código de boleto inválido' },
      duration: Date.now() - start,
      transactionId,
      amount,
    };
  }

  if (boletoCode.startsWith('9') && boletoCode.length >= 3) {
    await delay(50 + Math.floor(Math.random() * 50));
    return {
      status: 422,
      body: { success: false, message: 'Boleto vencido' },
      duration: Date.now() - start,
      transactionId,
      amount,
    };
  }

  const payer = accounts.find((a) => a.id === '123');
  if (payer && payer.balance >= amount) {
    payer.balance -= amount;
  }

  await delay(100 + Math.floor(Math.random() * 200));

  return {
    status: 200,
    body: { success: true, message: 'Boleto pago com sucesso', transactionId },
    duration: Date.now() - start,
    transactionId,
    amount,
  };
}
