const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const net = require('net');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const subscriptionRoutes = require('./routes/subscriptions');
const notificationRoutes = require('./routes/notifications');

const app = express();

// Security middleware
app.use(helmet());

// Dynamic CORS configuration - allow any localhost port and Chrome extensions
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
  'http://localhost:3004',
  'http://localhost:3005'
].filter(Boolean); // Remove undefined values

app.use(cors({
  origin: function (origin, callback) {
    // For development, allow all origins (remove this in production)
    if (process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow any localhost port
    if (origin.startsWith('http://localhost:')) {
      return callback(null, true);
    }
    
    // Allow specific origins from environment
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    // Allow requests from Chrome extensions (any chrome-extension:// origin)
    if (origin.startsWith('chrome-extension://')) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000 // limit each IP to 1000 requests per windowMs (more reasonable for extensions)
});
app.use(limiter);

// More lenient rate limiting for auth endpoints (extensions need to check auth frequently)
const authLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30 // limit each IP to 30 auth requests per minute
});

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use(morgan('combined'));

// Apply auth rate limiting to auth routes
app.use('/api/auth', authLimiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/ai', require('./routes/aiAnalysis'));

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'SubTrackr API is running',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    port: process.env.ACTUAL_PORT || process.env.PORT || 5000,
    cors: {
      allowedOrigins: allowedOrigins,
      dynamicLocalhost: true
    }
  });
});

// Server info endpoint for frontend discovery
app.get('/api/server-info', (req, res) => {
  res.json({
    port: process.env.ACTUAL_PORT || process.env.PORT || 5000,
    baseUrl: `http://localhost:${process.env.ACTUAL_PORT || process.env.PORT || 5000}`,
    cors: {
      dynamicLocalhost: true,
      allowedOrigins: allowedOrigins
    },
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ 
    error: 'Something went wrong!',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Database connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/subtrackr';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');
    return true;
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    console.log('\n📋 To fix this:');
    console.log('1. Install MongoDB: brew install mongodb-community');
    console.log('2. Start MongoDB: brew services start mongodb-community');
    console.log('3. Or use MongoDB Atlas (cloud): Update MONGODB_URI in .env');
    console.log('\n🔄 Starting server without database connection...');
    return false;
  }
};

// Function to check if a port is available
const isPortAvailable = (port) => {
  return new Promise((resolve) => {
    const server = net.createServer();
    
    server.listen(port, () => {
      server.once('close', () => {
        resolve(true);
      });
      server.close();
    });
    
    server.on('error', () => {
      resolve(false);
    });
  });
};

// Function to find an available port
const findAvailablePort = async (startPort) => {
  let port = startPort;
  const maxAttempts = 10; // Try up to 10 different ports
  
  for (let i = 0; i < maxAttempts; i++) {
    if (await isPortAvailable(port)) {
      return port;
    }
    port++;
  }
  
  throw new Error(`Could not find an available port after ${maxAttempts} attempts`);
};

// Start server
const startServer = async () => {
  const preferredPort = parseInt(process.env.PORT) || 5000;
  
  try {
    // Try to connect to database
    await connectDB();
    
    // Find an available port
    const actualPort = await findAvailablePort(preferredPort);
    
    app.listen(actualPort, () => {
      console.log(`🚀 SubTrackr API server running on port ${actualPort}`);
      console.log(`📊 Health check: http://localhost:${actualPort}/api/health`);
      
      if (actualPort !== preferredPort) {
        console.log(`⚠️  Port ${preferredPort} was busy, using port ${actualPort} instead`);
      }
      
      // Update CORS to include the actual port
      console.log(`🔗 Server will accept requests from any localhost port`);
      console.log(`🔗 Frontend URL: ${process.env.FRONTEND_URL || 'http://localhost:3001'}`);
      
      if (mongoose.connection.readyState !== 1) {
        console.log('\n⚠️  Note: Database features will be limited without MongoDB connection');
      }
      
      // Export the port for potential use by other processes
      process.env.ACTUAL_PORT = actualPort.toString();
    });
    
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down server...');
  if (mongoose.connection.readyState === 1) {
    await mongoose.connection.close();
    console.log('✅ Database connection closed');
  }
  process.exit(0);
});

startServer().catch(console.error);

module.exports = app; 