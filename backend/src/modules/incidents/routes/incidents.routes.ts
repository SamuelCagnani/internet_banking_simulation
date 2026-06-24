import { Router } from 'express';
import {
  serviceDownHandler,
  timeoutHandler,
  internalErrorHandler,
  overloadHandler,
  recoverHandler,
  activeIncidentsHandler,
} from '../controllers/incidents.controller';

const router = Router();

router.post('/incidents/service-down', serviceDownHandler);
router.post('/incidents/timeout', timeoutHandler);
router.post('/incidents/internal-error', internalErrorHandler);
router.post('/incidents/overload', overloadHandler);
router.post('/incidents/recover', recoverHandler);
router.get('/incidents/active', activeIncidentsHandler);

export default router;
