import { Schema, model, Document, Types } from 'mongoose';

export interface IRide extends Document {
    userId: Types.ObjectId;
    driverId?: Types.ObjectId;
    pickupLocation: {
        type: 'Point';
        coordinates: [number, number]; // [longitude, latitude]
    };
    dropoffLocation: {
        type: 'Point';
        coordinates: [number, number]; // [longitude, latitude]
    };
    pickupAddress: string;
    dropoffAddress: string;
    status: 'pending' | 'accepted' | 'ongoing' | 'completed' | 'cancelled';
    fare?: number;
    paymentStatus: 'pending' | 'completed';
    createdAt: Date;
    updatedAt: Date;
}

const rideSchema = new Schema<IRide>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    driverId: { type: Schema.Types.ObjectId, ref: 'Driver' },
    pickupLocation: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true } // [longitude, latitude]
    },
    dropoffLocation: {
        type: { type: String, enum: ['Point'], required: true },
        coordinates: { type: [Number], required: true } // [longitude, latitude]
    },
    pickupAddress: { type: String, required: true },
    dropoffAddress: { type: String, required: true },
    status: { type: String, enum: ['pending', 'accepted', 'ongoing', 'completed', 'cancelled'], default: 'pending' },
    fare: { type: Number },
    paymentStatus: { type: String, enum: ['pending', 'completed'], default: 'pending' },
}, { timestamps: true });

rideSchema.index({ pickupLocation: '2dsphere' });
rideSchema.index({ dropoffLocation: '2dsphere' });

const Ride = model<IRide>('Ride', rideSchema);

export default Ride; 