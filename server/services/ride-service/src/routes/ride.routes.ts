import { Router } from 'express';
import { estimateFare, bookRide } from '../controllers/ride.controller';

const router = Router();

router.post('/estimate-fare', estimateFare);
router.post('/book', bookRide);

export default router; 