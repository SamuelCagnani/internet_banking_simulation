import express from 'express';
import cors from 'cors';
import routes from './routes';
import { loggerMiddleware } from './middlewares/logger.middleware';
import { metricsMiddleware } from './middlewares/metrics.middleware';
import { client } from './metrics/prometheus';
import logger from './utils/logger';

const app = express();

app.use(cors());
app.use(express.json());

app.use(loggerMiddleware);
app.use(metricsMiddleware);

app.use(routes);

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.use((err: Error, req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error({ err, endpoint: req.originalUrl }, 'Unhandled error');
  res.status(500).json({ success: false, message: 'Erro interno do servidor' });
});

export default app;
