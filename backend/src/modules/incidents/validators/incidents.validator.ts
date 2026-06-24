import { IncidentDto } from '../dto/incidents.dto';

export function validateIncident(body: any): {
  valid: boolean;
  errors: string[];
  data: IncidentDto | null;
} {
  const errors: string[] = [];

  if (!body || typeof body !== 'object') {
    return { valid: true, errors: [], data: {} };
  }

  if (body.delay !== undefined && typeof body.delay !== 'number') {
    errors.push('delay must be a number if provided');
  }

  if (body.userId !== undefined && typeof body.userId !== 'string') {
    errors.push('userId must be a string if provided');
  }

  if (errors.length > 0) {
    return { valid: false, errors, data: null };
  }

  return {
    valid: true,
    errors: [],
    data: { delay: body.delay, userId: body.userId },
  };
}
