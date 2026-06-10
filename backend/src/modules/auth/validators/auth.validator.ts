import { LoginDto } from '../dto/auth.dto';

export function validateLogin(body: any): { valid: boolean; errors: string[]; data: LoginDto | null } {
  const errors: string[] = [];

  if (!body || typeof body !== 'object') {
    return { valid: false, errors: ['Body must be an object'], data: null };
  }

  if (!body.username || typeof body.username !== 'string') {
    errors.push('username is required and must be a string');
  }

  if (!body.password || typeof body.password !== 'string') {
    errors.push('password is required and must be a string');
  }

  if (errors.length > 0) {
    return { valid: false, errors, data: null };
  }

  return {
    valid: true,
    errors: [],
    data: { username: body.username, password: body.password },
  };
}

export function validateMfa(body: any): { valid: boolean; errors: string[]; data: string | null } {
  const errors: string[] = [];

  if (!body || typeof body !== 'object') {
    return { valid: false, errors: ['Body must be an object'], data: null };
  }

  if (!body.code || typeof body.code !== 'string') {
    errors.push('code is required and must be a string');
  }

  if (errors.length > 0) {
    return { valid: false, errors, data: null };
  }

  return { valid: true, errors: [], data: body.code };
}
