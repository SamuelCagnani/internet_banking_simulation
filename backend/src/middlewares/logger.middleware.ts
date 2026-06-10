import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

export function loggerMiddleware(req: Request, res: Response, next: NextFunction): void {
  const start = Date.now();

  res.on('finish', () => {
    const responseTime = Date.now() - start;

    logger.info({
      timestamp: new Date().toISOString(),
      method: req.method,
      endpoint: req.originalUrl,
      status_code: res.statusCode,
      response_time: responseTime,
    });
  });

  next();
}
