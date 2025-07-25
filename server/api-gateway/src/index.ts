import express, { Application } from 'express';
import proxy from 'express-http-proxy';
import morgan from 'morgan';
import dotenv from 'dotenv';

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

app.use(morgan('dev'));
app.use(express.json());

// Add health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        service: 'api-gateway',
        timestamp: new Date().toISOString(),
        services: {
            user: 'http://localhost:5001',
            ride: 'http://localhost:5002',
            location: 'http://localhost:5003',
            payment: 'http://localhost:5004',
            notification: 'http://localhost:5005',
            analytics: 'http://localhost:5006',
            admin: 'http://localhost:5007'
        }
    });
});

// Add API v1 health check endpoint
app.get('/api/v1/health', (req, res) => {
    res.status(200).json({ 
        status: 'OK', 
        service: 'api-gateway',
        timestamp: new Date().toISOString(),
        services: {
            user: 'http://localhost:5001',
            ride: 'http://localhost:5002',
            location: 'http://localhost:5003',
            payment: 'http://localhost:5004',
            notification: 'http://localhost:5005',
            analytics: 'http://localhost:5006',
            admin: 'http://localhost:5007'
        }
    });
});

// Add root endpoint
app.get('/', (req, res) => {
    res.status(200).json({ 
        message: 'Ride Sharing API Gateway',
        version: '1.0.0',
        endpoints: {
            auth: '/api/v1/auth',
            users: '/api/v1/users',
            rides: '/api/v1/rides',
            locations: '/api/v1/locations',
            payments: '/api/v1/payments',
            notifications: '/api/v1/notifications',
            analytics: '/api/v1/track',
            admin: '/api/v1/admin'
        }
    });
});

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://localhost:5001';
const RIDE_SERVICE_URL = process.env.RIDE_SERVICE_URL || 'http://localhost:5002';
const LOCATION_SERVICE_URL = process.env.LOCATION_SERVICE_URL || 'http://localhost:5003';
const PAYMENT_SERVICE_URL = process.env.PAYMENT_SERVICE_URL || 'http://localhost:5004';
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:5005';
const ANALYTICS_SERVICE_URL = process.env.ANALYTICS_SERVICE_URL || 'http://localhost:5006';
const ADMIN_SERVICE_URL = process.env.ADMIN_SERVICE_URL || 'http://localhost:5007';

// Proxy routes with error handling
app.use('/api/v1/auth', proxy(USER_SERVICE_URL, {
    proxyErrorHandler: (err, res, next) => {
        console.error('❌ User Service Error:', err.message);
        res.status(503).json({ error: 'User Service unavailable' });
    }
}));

app.use('/api/v1/users', proxy(USER_SERVICE_URL, {
    proxyErrorHandler: (err, res, next) => {
        console.error('❌ User Service Error:', err.message);
        res.status(503).json({ error: 'User Service unavailable' });
    }
}));

app.use('/api/v1/rides', proxy(RIDE_SERVICE_URL, {
    proxyErrorHandler: (err, res, next) => {
        console.error('❌ Ride Service Error:', err.message);
        res.status(503).json({ error: 'Ride Service unavailable' });
    }
}));

app.use('/api/v1/locations', proxy(LOCATION_SERVICE_URL, {
    proxyErrorHandler: (err, res, next) => {
        console.error('❌ Location Service Error:', err.message);
        res.status(503).json({ error: 'Location Service unavailable' });
    }
}));

app.use('/api/v1/payments', proxy(PAYMENT_SERVICE_URL, {
    proxyErrorHandler: (err, res, next) => {
        console.error('❌ Payment Service Error:', err.message);
        res.status(503).json({ error: 'Payment Service unavailable' });
    }
}));

app.use('/api/v1/notifications', proxy(NOTIFICATION_SERVICE_URL, {
    proxyErrorHandler: (err, res, next) => {
        console.error('❌ Notification Service Error:', err.message);
        res.status(503).json({ error: 'Notification Service unavailable' });
    }
}));

app.use('/api/v1/track', proxy(ANALYTICS_SERVICE_URL, {
    proxyReqPathResolver: (req) => `/api/v1/track${req.url}`,
    proxyErrorHandler: (err, res, next) => {
        console.error('❌ Analytics Service Error:', err.message);
        res.status(503).json({ error: 'Analytics Service unavailable' });
    }
}));

app.use('/api/v1/admin', proxy(ADMIN_SERVICE_URL, {
    proxyErrorHandler: (err, res, next) => {
        console.error('❌ Admin Service Error:', err.message);
        res.status(503).json({ error: 'Admin Service unavailable' });
    }
}));

// 404 handler for unknown routes - using a function instead of wildcard
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Route not found',
        path: req.originalUrl,
        availableRoutes: [
            '/',
            '/health',
            '/api/v1/auth',
            '/api/v1/users',
            '/api/v1/rides',
            '/api/v1/locations',
            '/api/v1/payments',
            '/api/v1/notifications',
            '/api/v1/track',
            '/api/v1/admin'
        ]
    });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`✅ API Gateway is running on port ${PORT}`);
    console.log(`🌐 Gateway URL: http://localhost:${PORT}`);
    console.log(`📊 Health Check: http://localhost:${PORT}/health`);
}); 