import { Schema, model, Document, Types } from 'mongoose';

export interface IPaymentMethod extends Document {
    userId: Types.ObjectId;
    stripePaymentMethodId: string;
    cardBrand: string;
    last4: string;
    isDefault: boolean;
}

const paymentMethodSchema = new Schema<IPaymentMethod>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    stripePaymentMethodId: { type: String, required: true },
    cardBrand: { type: String, required: true },
    last4: { type: String, required: true },
    isDefault: { type: Boolean, default: false },
}, { timestamps: true });

const PaymentMethod = model<IPaymentMethod>('PaymentMethod', paymentMethodSchema);

export default PaymentMethod; 