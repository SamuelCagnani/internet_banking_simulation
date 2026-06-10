import { Request, Response, NextFunction } from 'express';
import {
  httpRequestsTotal,
  httpRequestDurationSeconds,
  httpErrorsTotal,
} from '../metrics/prometheus';

export function metricsMiddleware(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const { method, originalUrl: endpoint } = req;
    const statusCode = String(res.statusCode);

    httpRequestsTotal.inc({ method, endpoint, status_code: statusCode });
    httpRequestDurationSeconds.observe({ method, endpoint, status_code: statusCode }, duration);

    if (res.statusCode >= 400) {
      httpErrorsTotal.inc({ method, endpoint, status_code: statusCode });
    }
  });

  next();
}
