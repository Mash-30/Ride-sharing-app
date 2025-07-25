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
    res.status(200).json({ status: 'OK', service: 'analytics-service' });
});

app.post('/api/v1/track', (req, res) => {
    const { event, data } = req.body;
    if (!event) {
        return res.status(400).json({ message: 'Event name is required' });
    }

    // In a real system, this would be sent to a data warehouse,
    // a message queue, or stored in a database.
    console.log(`📊 [Analytics Event] Event: ${event}, Data: ${JSON.stringify(data)}`);

    res.status(202).json({ message: 'Event received' });
});

const PORT = process.env.PORT || 5006;

app.listen(PORT, () => {
    console.log(`✅ Analytics service is running on port ${PORT}`);
}); 