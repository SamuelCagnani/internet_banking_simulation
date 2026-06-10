import { PixDto, BoletoDto } from '../dto/finance.dto';

export function validatePix(body: any): { valid: boolean; errors: string[]; data: PixDto | null } {
  const errors: string[] = [];

  if (!body || typeof body !== 'object') {
    return { valid: false, errors: ['Body must be an object'], data: null };
  }

  if (!body.fromAccount || typeof body.fromAccount !== 'string') {
    errors.push('fromAccount is required and must be a string');
  }

  if (!body.toAccount || typeof body.toAccount !== 'string') {
    errors.push('toAccount is required and must be a string');
  }

  if (body.amount === undefined || typeof body.amount !== 'number' || body.amount <= 0) {
    errors.push('amount is required and must be a positive number');
  }

  if (errors.length > 0) {
    return { valid: false, errors, data: null };
  }

  return {
    valid: true,
    errors: [],
    data: { fromAccount: body.fromAccount, toAccount: body.toAccount, amount: body.amount },
  };
}

export function validateBoleto(body: any): { valid: boolean; errors: string[]; data: BoletoDto | null } {
  const errors: string[] = [];

  if (!body || typeof body !== 'object') {
    return { valid: false, errors: ['Body must be an object'], data: null };
  }

  if (!body.boletoCode || typeof body.boletoCode !== 'string') {
    errors.push('boletoCode is required and must be a string');
  }

  if (body.amount === undefined || typeof body.amount !== 'number' || body.amount <= 0) {
    errors.push('amount is required and must be a positive number');
  }

  if (errors.length > 0) {
    return { valid: false, errors, data: null };
  }

  return {
    valid: true,
    errors: [],
    data: { boletoCode: body.boletoCode, amount: body.amount },
  };
}
