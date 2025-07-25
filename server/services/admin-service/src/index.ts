const express = require('express');

// Safe dotenv import
try {
    require('dotenv').config();
} catch (error) {
    console.log('⚠️  dotenv not available, using default environment variables');
}

const app = express();

app.use(express.json());

// Add health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', service: 'admin-service' });
});

// This could serve a static admin dashboard
// app.use(express.static('public'));

app.get('/api/v1/admin/dashboard', (req, res) => {
    // This would fetch and return data for an admin dashboard
    res.json({
        users: 100, // mock data
        rides: 500, // mock data
        revenue: 12000 // mock data
    });
});

const PORT = process.env.PORT || 5007;

app.listen(PORT, () => {
    console.log(`✅ Admin service is running on port ${PORT}`);
}); 