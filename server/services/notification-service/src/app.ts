import express, { Application } from 'express';
import dotenv from 'dotenv';
import notificationRoutes from './routes/notification.routes';

dotenv.config();

const app: Application = express();

app.use(express.json());

// Add health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'notification-service' });
});

app.use('/api/v1/notifications', notificationRoutes);

export default app; 