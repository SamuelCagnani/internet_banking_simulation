import { Router } from 'express';
import { balanceHandler, pixHandler, boletoHandler } from '../controllers/finance.controller';

const router = Router();

router.get('/account/balance', balanceHandler);
router.post('/transactions/pix', pixHandler);
router.post('/payments/boleto', boletoHandler);

export default router;
