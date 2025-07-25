import { Request, Response } from 'express';
import User from '../models/User';

export const getCurrentUser = async (req: Request, res: Response) => {
    try {
        // The user ID is set by the authenticateToken middleware
        const userId = (req as any).user?.id;
        
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const user = await User.findById(userId).select('-__v');
        
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error getting current user:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const updateProfile = async (req: Request, res: Response) => {
    try {
        const userId = (req as any).user?.id;
        
        if (!userId) {
            return res.status(401).json({ error: 'User not authenticated' });
        }

        const { profile } = req.body;

        const user = await User.findByIdAndUpdate(
            userId,
            { profile },
            { new: true, runValidators: true }
        ).select('-__v');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
}; 