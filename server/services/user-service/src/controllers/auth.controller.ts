import { Request, Response } from 'express';
import User from '../models/User';
import jwt from 'jsonwebtoken';

// Twilio configuration (optional - will use console logging if not configured)
let twilioClient: any = null;
try {
    const twilio = require('twilio');
    const accountSid = process.env.TWILIO_ACCOUNT_SID;
    const authToken = process.env.TWILIO_AUTH_TOKEN;
    const fromNumber = process.env.TWILIO_PHONE_NUMBER;
    
    if (accountSid && authToken && fromNumber) {
        twilioClient = twilio(accountSid, authToken);
        console.log('✅ Twilio SMS service configured');
    } else {
        console.log('⚠️  Twilio not configured - using console logging for OTP');
    }
} catch (error) {
    console.log('⚠️  Twilio not installed - using console logging for OTP');
}

// Rate limiting store (in production, use Redis)
const otpAttempts = new Map<string, { count: number, lastAttempt: number }>();

export const sendOtp = async (req: Request, res: Response) => {
    const { phoneNumber } = req.body;
    
    // Enhanced validation for international phone numbers
    if (!phoneNumber) {
        return res.status(400).json({ message: 'Phone number is required' });
    }
    
    // E.164 format validation: +[country code][number]
    if (!/^\+\d{1,4}\d{6,14}$/.test(phoneNumber)) {
        return res.status(400).json({ 
            message: 'Invalid phone number format. Please use international format (e.g., +1234567890)' 
        });
    }

    // Rate limiting: max 3 OTP requests per phone number per hour
    const now = Date.now();
    const attempts = otpAttempts.get(phoneNumber);
    if (attempts && attempts.count >= 3 && (now - attempts.lastAttempt) < 3600000) {
        return res.status(429).json({ 
            message: 'Too many OTP requests. Please wait before requesting another code.' 
        });
    }

    try {
        // Generate a 4-digit OTP (matching frontend expectation)
        const otp = Math.floor(1000 + Math.random() * 9000).toString();
        const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

        let user = await User.findOne({ phoneNumber });
        if (user) {
            user.otp = otp;
            user.otpExpiry = otpExpiry;
            await user.save();
        } else {
            user = await User.create({
                phoneNumber,
                otp,
                otpExpiry,
                isVerified: false,
            });
        }

        // Update rate limiting
        otpAttempts.set(phoneNumber, {
            count: (attempts?.count || 0) + 1,
            lastAttempt: now
        });

        // Send OTP via SMS or console logging
        if (twilioClient && process.env.TWILIO_PHONE_NUMBER) {
            try {
                await twilioClient.messages.create({
                    body: `Your ride-sharing app verification code is: ${otp}. Valid for 10 minutes.`,
                    from: process.env.TWILIO_PHONE_NUMBER,
                    to: phoneNumber
                });
                console.log(`📱 SMS sent to ${phoneNumber} with OTP: ${otp}`);
            } catch (smsError) {
                console.error('❌ SMS sending failed:', smsError);
                console.log(`📱 OTP for ${phoneNumber} is ${otp} (SMS failed, check console)`);
            }
        } else {
            // Fallback to console logging
            console.log(`📱 OTP for ${phoneNumber} is ${otp}`);
            console.log(`🌍 International number detected: ${phoneNumber}`);
            console.log(`💡 To enable real SMS, configure Twilio environment variables`);
        }

        res.status(200).json({ 
            message: 'OTP sent successfully',
            phoneNumber: phoneNumber // Echo back for confirmation
        });

    } catch (error) {
        console.error('❌ Error in sendOtp:', error);
        res.status(500).json({ message: 'Server error while sending OTP' });
    }
};

export const verifyOtp = async (req: Request, res: Response) => {
    const { phoneNumber, otp } = req.body;
    
    if (!phoneNumber || !otp) {
        return res.status(400).json({ message: 'Phone number and OTP are required' });
    }
    
    // Validate phone number format
    if (!/^\+\d{1,4}\d{6,14}$/.test(phoneNumber)) {
        return res.status(400).json({ 
            message: 'Invalid phone number format. Please use international format (e.g., +1234567890)' 
        });
    }
    
    // Validate OTP format (4 digits)
    if (!/^\d{4}$/.test(otp)) {
        return res.status(400).json({ message: 'OTP must be 4 digits' });
    }

    try {
        const user = await User.findOne({ phoneNumber });
        if (!user) {
            return res.status(404).json({ message: 'User not found. Please request OTP first.' });
        }

        if (!user.otp) {
            return res.status(400).json({ message: 'No OTP found. Please request a new OTP.' });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP. Please check and try again.' });
        }

        if (user.otpExpiry && user.otpExpiry < new Date()) {
            return res.status(400).json({ message: 'OTP has expired. Please request a new OTP.' });
        }

        // Mark user as verified and clear OTP
        user.isVerified = true;
        user.otp = undefined;
        user.otpExpiry = undefined;
        await user.save();

        // Generate JWT token
        const token = jwt.sign(
            { 
                id: user._id,
                phoneNumber: user.phoneNumber,
                isVerified: user.isVerified
            }, 
            process.env.JWT_SECRET || 'your_jwt_secret', 
            { expiresIn: '7d' }
        );

        console.log(`✅ User ${phoneNumber} verified successfully`);
        console.log(`🌍 International verification completed for: ${phoneNumber}`);

        res.status(200).json({ 
            message: 'Phone number verified successfully', 
            token,
            user: {
                id: user._id,
                phoneNumber: user.phoneNumber,
                isVerified: user.isVerified,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });

    } catch (error) {
        console.error('❌ Error in verifyOtp:', error);
        res.status(500).json({ message: 'Server error while verifying OTP' });
    }
};

// Additional endpoint to check if user exists
export const checkUser = async (req: Request, res: Response) => {
    const { phoneNumber } = req.params;
    
    if (!phoneNumber || !/^\+\d{1,4}\d{6,14}$/.test(phoneNumber)) {
        return res.status(400).json({ message: 'Valid international phone number is required' });
    }

    try {
        const user = await User.findOne({ phoneNumber });
        res.status(200).json({ 
            exists: !!user,
            isVerified: user?.isVerified || false
        });
    } catch (error) {
        console.error('❌ Error in checkUser:', error);
        res.status(500).json({ message: 'Server error while checking user' });
    }
}; 