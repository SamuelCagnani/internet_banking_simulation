import { Request, Response } from 'express';
import { getHealthStatus } from '../services/health.service';

export function healthCheck(req: Request, res: Response): void {
  const health = getHealthStatus();
  const statusCode = health.status === 'UP' ? 200 : 503;
  res.status(statusCode).json(health);
}
