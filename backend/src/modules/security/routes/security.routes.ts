import { Router } from 'express';
import {
  deviceRegisterHandler,
  limitChangeHandler,
  bruteForceHandler,
  suspiciousActivityHandler,
} from '../controllers/security.controller';

const router = Router();

router.post('/devices/register', deviceRegisterHandler);
router.put('/user/limits', limitChangeHandler);
router.post('/security/simulate/brute-force', bruteForceHandler);
router.post('/security/simulate/suspicious', suspiciousActivityHandler);

export default router;
