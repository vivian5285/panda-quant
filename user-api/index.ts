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
const port = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/panda-quant')
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

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

// Routes
app.get('/', (req, res) => {
  res.send('Panda Quant User API is running');
});

// Start server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 