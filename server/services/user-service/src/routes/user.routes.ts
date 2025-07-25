import { Router } from 'express';
import { getCurrentUser, updateProfile } from '../controllers/user.controller';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Protected routes - require authentication
router.get('/me', authenticateToken, getCurrentUser);
router.put('/profile', authenticateToken, updateProfile);

export default router; 