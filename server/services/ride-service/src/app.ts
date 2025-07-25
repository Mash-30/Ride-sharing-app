import express, { Application } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import rideRoutes from './routes/ride.routes';

dotenv.config();

const app: Application = express();

app.use(express.json());

// Add health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'ride-service' });
});

app.use('/api/v1/rides', rideRoutes);

const PORT = process.env.PORT || 5002;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ride-sharing-ride-service';

// Connect to MongoDB with better error handling
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB connected successfully to Ride Service');
        console.log(`📊 Database: ${MONGO_URI}`);
    })
    .catch(err => {
        console.error('❌ MongoDB connection error in Ride Service:', err.message);
        console.log('💡 Make sure MongoDB is running on your system');
        console.log('⚠️  Service will start without database connection');
    });

export default app; 