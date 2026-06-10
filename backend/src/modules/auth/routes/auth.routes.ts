import { Router } from 'express';
import { loginHandler, mfaHandler, logoutHandler } from '../controllers/auth.controller';

const router = Router();

router.post('/login', loginHandler);
router.post('/mfa', mfaHandler);
router.post('/logout', logoutHandler);

export default router;
