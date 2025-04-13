import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import { DatabaseService } from './services/databaseService';
import { StrategyManager } from './strategy-engine/strategyManager';
import authRoutes from './routes/auth';
import userRoutes from './routes/user';
import assetRoutes from './routes/asset';
import strategyRoutes from './routes/strategy';
import { scheduleWeeklyFeeDeduction } from './tasks/feeDeduction';

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/panda-quant')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Initialize PostgreSQL database
const dbService = new DatabaseService();
dbService.initialize()
  .then(() => console.log('PostgreSQL connected'))
  .catch(err => console.error('PostgreSQL connection error:', err));

// Initialize strategy manager
const strategyManager = new StrategyManager();
app.set('strategyManager', strategyManager);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/asset', assetRoutes);
app.use('/api/strategy', strategyRoutes);

// Schedule weekly fee deduction
scheduleWeeklyFeeDeduction();

// Graceful shutdown
process.on('SIGTERM', async () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  await dbService.close();
  process.exit(0);
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 