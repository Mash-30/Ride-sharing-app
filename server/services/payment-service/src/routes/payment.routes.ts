import { Router } from 'express';
import { getPaymentMethods, addPaymentMethod } from '../controllers/payment.controller';

const router = Router();

// Example route
router.get('/methods', getPaymentMethods);
router.post('/methods', addPaymentMethod);

export default router; 