import { Router } from 'express';
import { sendOtp, verifyOtp, checkUser } from '../controllers/auth.controller';

const router = Router();

router.post('/send-otp', sendOtp);
router.post('/verify-otp', verifyOtp);
router.get('/check-user/:phoneNumber', checkUser);

export default router; 