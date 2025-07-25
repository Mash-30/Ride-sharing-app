import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
    phoneNumber: string;
    otp?: string;
    otpExpiry?: Date;
    isVerified: boolean;
    firstName?: string;
    lastName?: string;
    email?: string;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new Schema<IUser>({
    phoneNumber: { type: String, required: true, unique: true },
    otp: { type: String },
    otpExpiry: { type: Date },
    isVerified: { type: Boolean, default: false },
    firstName: { type: String },
    lastName: { type: String },
    email: { type: String, unique: true, sparse: true }, // sparse allows multiple null values
    avatar: { type: String },
}, { timestamps: true });

const User = model<IUser>('User', userSchema);

export default User; 