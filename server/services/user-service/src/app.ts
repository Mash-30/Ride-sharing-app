import express, { Application } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';

dotenv.config();

const app: Application = express();

// Add CORS middleware for web browser support
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

app.use(express.json());

// Mount routes at root level since API Gateway will add the /api/v1/auth prefix
app.use('/', authRoutes);
app.use('/', userRoutes);

// Add a health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'user-service' });
});

const PORT = process.env.PORT || 5001;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/ride-sharing-user-service';

// Connect to MongoDB with better error handling
mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('✅ MongoDB connected successfully');
        console.log(`📊 Database: ${MONGO_URI}`);
    })
    .catch(err => {
        console.error('❌ MongoDB connection error:', err.message);
        console.log('💡 Make sure MongoDB is running on your system');
        console.log('💡 You can install MongoDB or use MongoDB Atlas');
        
        // Don't exit the process, let it continue without database
        console.log('⚠️  Service will start without database connection');
    });

export default app; 