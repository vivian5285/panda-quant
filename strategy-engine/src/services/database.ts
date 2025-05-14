import mongoose from 'mongoose';
import { logger } from '../utils/logger';

export async function connectDatabase(): Promise<void> {
  const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/panda-quant';
  await mongoose.connect(mongoUri);
  console.log('Connected to MongoDB');
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
  console.log('Disconnected from MongoDB');
}

export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    if (!mongoose.connection.db) {
      throw new Error('Database connection not established');
    }
    await mongoose.connection.db.admin().ping();
    return true;
  } catch (error) {
    logger.error('Database connection check failed:', error);
    return false;
  }
} 