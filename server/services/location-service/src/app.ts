import express, { Application } from 'express';
import dotenv from 'dotenv';
import locationRoutes from './routes/location.routes';

dotenv.config();

const app: Application = express();

app.use(express.json());

// Add health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'location-service' });
});

// Mount routes at root level since API Gateway will add the /api/v1/locations prefix
app.use('/', locationRoutes);

export default app; 