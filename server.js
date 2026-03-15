// Server configuration
const express = require('express');
const cors = require('cors');
const connectDB = require('./database/database');
const apiRoutes = require('./routes/api');
const pageRoutes = require('./routes/pages');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

// Connect Database
connectDB();

const app = express();

// CORS - allow local dev and production Vercel frontend
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    process.env.FRONTEND_URL, // e.g. https://your-app.vercel.app
].filter(Boolean); // remove undefined if FRONTEND_URL not set

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));

app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check endpoint - used by Render to verify server is alive
app.get('/api/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api', apiRoutes);
app.use('/api/pages', pageRoutes);
app.use('/api/admin/pages', pageRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err.message);
    res.status(500).json({ message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
