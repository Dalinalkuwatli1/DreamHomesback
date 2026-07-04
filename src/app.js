// src/app.js — Express Application Setup
const express    = require('express');
const cors       = require('cors');
const helmet     = require('helmet');
const morgan     = require('morgan');
const rateLimit  = require('express-rate-limit');
const cookieParser = require('cookie-parser');

const { errorHandler, notFound } = require('./middlewares/error.middleware');

// Route modules
const authRoutes         = require('./modules/users/user.routes');     // /api/auth — public
const userRoutes         = require('./modules/users/profile.routes');   // /api/users — protected
const propertyRoutes     = require('./modules/properties/property.routes');
const favoriteRoutes     = require('./modules/favorites/favorite.routes');
const messageRoutes      = require('./modules/messages/message.routes');
const notificationRoutes = require('./modules/notifications/notification.routes');
const adminRoutes        = require('./modules/admin/admin.routes');

const app = express();

// ─── Global Middlewares ──────────────────────────────────────────
// Security headers
app.use(helmet());

// CORS
const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:3000',
  'http://localhost:5173', // Vite dev server
  'http://localhost:4173', // Vite preview
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
    callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}));

// HTTP Request Logger
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Body parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Global Rate Limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  message: { success: false, message: 'Too many requests, please try again later.' },
  standardHeaders: true,
  legacyHeaders: false,
});
app.use('/api', limiter);

// Stricter limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many auth attempts, please try again later.' },
});

// ─── Health Check & Root Route ────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ success: true, message: '🏠 DreamHomes Backend API is running 🚀' });
});

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: '🏠 DreamHomes API is running', timestamp: new Date() });
});

// ─── API Routes ──────────────────────────────────────────────────
app.use('/api/auth',          authLimiter, authRoutes);   // register, login, logout ...
app.use('/api/users',         userRoutes);                // /me, /me/avatar, admin CRUD
app.use('/api/properties',    propertyRoutes);
app.use('/api/favorites',     favoriteRoutes);
app.use('/api/messages',      messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/admin',         adminRoutes);

// ─── Error Handling ──────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

module.exports = app;
