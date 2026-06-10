import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from '../modules/auth/routes/auth.routes';
import financeRoutes from '../modules/finance/routes/finance.routes';

const router = Router();

router.use('/api/v1', healthRoutes);
router.use('/api/v1/auth', authRoutes);
router.use('/api/v1', financeRoutes);

export default router;
