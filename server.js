// Server configuration
const express = require('express');
const cors = require('cors');
const connectDB = require('./database/database');
const apiRoutes = require('./routes/api');
const pageRoutes = require('./routes/pages');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const morgan = require('morgan');

// Connect Database
connectDB();

const app = express();

// Middlewares
app.use(morgan('dev')); // Log requests to console
app.use(helmet()); // Sets various HTTP headers for security
// CORS - allow local dev and production Vercel frontend
const allowedOrigins = [
    'http://localhost:5173',
    'http://localhost:3000',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:3000',
    process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, Postman)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            return callback(null, true);
        }
        console.error(`🚫 CORS Blocked: Origin "${origin}" is not in the allowed list.`);
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
}));

app.use(express.json());
app.use(mongoSanitize()); // Prevent NoSQL injection attacks (must be after express.json)

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
});

// Apply rate limiter to all routes
app.use('/api/', limiter);

// Specific stricter limiter for login/register
const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // Limit each IP to 10 login attempts per hour
    message: { message: 'Too many login attempts, please try again after an hour' }
});
app.use('/api/admin/login', authLimiter);
app.use('/api/login', authLimiter);

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
