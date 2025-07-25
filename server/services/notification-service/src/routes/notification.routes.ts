import { Router } from 'express';
import { sendNotification } from '../controllers/notification.controller';

const router = Router();

router.post('/send', sendNotification);

export default router; 