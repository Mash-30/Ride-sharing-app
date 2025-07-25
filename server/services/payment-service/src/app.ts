import express, { Application } from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import paymentRoutes from './routes/payment.routes';

dotenv.config();

const app: Application = express();

app.use(express.json());

// Add health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'payment-service' });
});

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ride-sharing-payment-service';

// Connect to MongoDB with better error handling
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB connected successfully to Payment Service');
        console.log(`📊 Database: ${MONGO_URI}`);
    })
    .catch(err => {
        console.error('❌ MongoDB connection error in Payment Service:', err.message);
        console.log('💡 Make sure MongoDB is running on your system');
        console.log('⚠️  Service will start without database connection');
    });

app.use('/api/v1/payments', paymentRoutes);

export default app; 