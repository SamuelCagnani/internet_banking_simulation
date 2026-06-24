import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from '../modules/auth/routes/auth.routes';
import financeRoutes from '../modules/finance/routes/finance.routes';
import securityRoutes from '../modules/security/routes/security.routes';
import incidentRoutes from '../modules/incidents/routes/incidents.routes';

const router = Router();

router.use('/api/v1', healthRoutes);
router.use('/api/v1/auth', authRoutes);
router.use('/api/v1', financeRoutes);
router.use('/api/v1', securityRoutes);
router.use('/api/v1', incidentRoutes);

export default router;
