import { Router } from 'express';
import { autocomplete, updateLocation, getNearbyDrivers } from '../controllers/location.controller';

const router = Router();

router.get('/autocomplete', autocomplete);
router.post('/update', updateLocation);
router.get('/nearby-drivers', getNearbyDrivers);

export default router; 