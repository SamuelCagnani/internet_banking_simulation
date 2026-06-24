import { DeviceRegisterDto, LimitChangeDto, BruteForceDto } from '../dto/security.dto';

export function validateDeviceRegister(body: any): {
  valid: boolean;
  errors: string[];
  data: DeviceRegisterDto | null;
} {
  const errors: string[] = [];

  if (!body || typeof body !== 'object') {
    return { valid: false, errors: ['Body must be an object'], data: null };
  }

  if (!body.userId || typeof body.userId !== 'string') {
    errors.push('userId is required and must be a string');
  }

  if (!body.deviceId || typeof body.deviceId !== 'string') {
    errors.push('deviceId is required and must be a string');
  }

  if (!body.deviceName || typeof body.deviceName !== 'string') {
    errors.push('deviceName is required and must be a string');
  }

  if (errors.length > 0) {
    return { valid: false, errors, data: null };
  }

  return {
    valid: true,
    errors: [],
    data: { userId: body.userId, deviceId: body.deviceId, deviceName: body.deviceName },
  };
}

export function validateLimitChange(body: any): {
  valid: boolean;
  errors: string[];
  data: LimitChangeDto | null;
} {
  const errors: string[] = [];

  if (!body || typeof body !== 'object') {
    return { valid: false, errors: ['Body must be an object'], data: null };
  }

  if (!body.userId || typeof body.userId !== 'string') {
    errors.push('userId is required and must be a string');
  }

  if (body.newLimit === undefined || typeof body.newLimit !== 'number' || body.newLimit <= 0) {
    errors.push('newLimit is required and must be a positive number');
  }

  if (errors.length > 0) {
    return { valid: false, errors, data: null };
  }

  return {
    valid: true,
    errors: [],
    data: { userId: body.userId, newLimit: body.newLimit },
  };
}

export function validateBruteForce(body: any): {
  valid: boolean;
  errors: string[];
  data: BruteForceDto | null;
} {
  const errors: string[] = [];

  if (!body || typeof body !== 'object') {
    return { valid: false, errors: ['Body must be an object'], data: null };
  }

  if (!body.userId || typeof body.userId !== 'string') {
    errors.push('userId is required and must be a string');
  }

  if (body.attempts === undefined || typeof body.attempts !== 'number' || body.attempts < 1) {
    errors.push('attempts is required and must be a positive number');
  }

  if (errors.length > 0) {
    return { valid: false, errors, data: null };
  }

  return {
    valid: true,
    errors: [],
    data: { userId: body.userId, attempts: body.attempts },
  };
}
