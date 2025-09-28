import express, { Application, Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth';
import noteRoutes from './routes/notes';

// Load environment variables
dotenv.config({ path: '.env' });

// Debug environment variables
console.log('🔧 Environment Debug:');
console.log('NODE_ENV:', process.env.NODE_ENV);
console.log('SMTP_HOST:', process.env.SMTP_HOST);
console.log('SMTP_USER:', process.env.SMTP_USER);
console.log('SMTP_PASS:', process.env.SMTP_PASS ? `${process.env.SMTP_PASS.substring(0, 4)}****${process.env.SMTP_PASS.slice(-4)}` : 'NOT SET');

const app: Application = express();
const PORT = process.env.PORT || 5000;

// Security middleware
app.use(helmet());

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'), // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
});
app.use(limiter);

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  })
);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Highway Delight API is running!',
    timestamp: new Date().toISOString(),
  });
});

// Root route handler
app.get('/', (req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Welcome to Highway Delight API!',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth',
      notes: '/api/notes'
    }
  });
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/notes', noteRoutes);

// 404 handler
app.use('*', (req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: any) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error',
  });
});

// Database connection
const connectDB = async (): Promise<void> => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/highway-delight';
    
    const connectionOptions = {
      serverSelectionTimeoutMS: 5000,
      connectTimeoutMS: 10000,
      family: 4, // Use IPv4, skip trying IPv6
    };

    await mongoose.connect(mongoURI, connectionOptions);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error(' Database connection failed:', error);
    
    // Try alternative connection without some SSL options
    if (error instanceof Error && error.message.includes('SSL')) {
      console.log('🔄 Attempting connection with alternative SSL settings...');
      try {
        const mongoURI = process.env.MONGODB_URI?.replace('&ssl=true&tlsAllowInvalidCertificates=true', '') || 'mongodb://localhost:27017/highway-delight';
        await mongoose.connect(mongoURI, {
          serverSelectionTimeoutMS: 5000,
          connectTimeoutMS: 10000,
          family: 4,
        });
        console.log('MongoDB connected successfully with alternative settings');
      } catch (altError) {
        console.error('Alternative connection also failed:', altError);
        process.exit(1);
      }
    } else {
      process.exit(1);
    }
  }
};

// Start server -- set up the server
const startServer = async (): Promise<void> => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(` API Documentation: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;