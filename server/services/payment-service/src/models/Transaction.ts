import { Schema, model, Document, Types } from 'mongoose';

export interface ITransaction extends Document {
    userId: Types.ObjectId;
    rideId: Types.ObjectId;
    amount: number;
    currency: string;
    stripeChargeId: string;
    status: 'pending' | 'succeeded' | 'failed';
}

const transactionSchema = new Schema<ITransaction>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rideId: { type: Schema.Types.ObjectId, ref: 'Ride', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true, default: 'usd' },
    stripeChargeId: { type: String, required: true, unique: true },
    status: { type: String, enum: ['pending', 'succeeded', 'failed'], required: true },
}, { timestamps: true });

const Transaction = model<ITransaction>('Transaction', transactionSchema);

export default Transaction; 