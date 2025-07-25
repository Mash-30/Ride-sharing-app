import { Request, Response } from 'express';
import PaymentMethod from '../models/PaymentMethod';
import { Types } from 'mongoose';

// Placeholder for future payment logic
export const getPaymentMethods = async (req: Request, res: Response) => {
    // In a real app, you'd get the userId from an auth token
    const { userId } = req.query;
    if (!userId) {
        return res.status(400).json({ message: 'User ID is required' });
    }
    try {
        const methods = await PaymentMethod.find({ userId: new Types.ObjectId(userId as string) });
        res.status(200).json(methods);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const addPaymentMethod = async (req: Request, res: Response) => {
    // In a real app, userId from auth token, and paymentToken from Stripe.js
    const { userId, paymentToken } = req.body;
    if (!userId || !paymentToken) {
        return res.status(400).json({ message: 'User ID and payment token are required' });
    }

    try {
        // Here you would interact with the Stripe API:
        // 1. Find or create a Stripe Customer for the userId.
        // 2. Create a PaymentMethod in Stripe using the paymentToken.
        // 3. Attach the PaymentMethod to the Customer.

        // For now, we'll just simulate this.
        const mockStripePaymentMethodId = `pm_${Math.random().toString(36).substr(2, 9)}`;
        
        const newMethod = new PaymentMethod({
            userId: new Types.ObjectId(userId),
            stripePaymentMethodId: mockStripePaymentMethodId,
            cardBrand: 'visa', // Mock data
            last4: '4242', // Mock data
        });

        await newMethod.save();

        res.status(201).json(newMethod);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error adding payment method' });
    }
}; 