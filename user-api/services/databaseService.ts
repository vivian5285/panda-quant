import mongoose from 'mongoose';
import { logger } from '../utils/logger';

export class DatabaseService {
  private static instance: DatabaseService;
  private isConnected: boolean = false;
  private maxRetries: number = 3;
  private retryDelay: number = 5000; // 5 seconds

  private constructor() {}

  public static getInstance(): DatabaseService {
    if (!DatabaseService.instance) {
      DatabaseService.instance = new DatabaseService();
    }
    return DatabaseService.instance;
  }

  public async connect(): Promise<void> {
    if (this.isConnected) {
      logger.info('MongoDB already connected');
      return;
    }

    let retries = 0;
    while (retries < this.maxRetries) {
      try {
        const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/panda-quant';
        logger.info(`Connecting to MongoDB at ${uri} (attempt ${retries + 1}/${this.maxRetries})`);
        
        await mongoose.connect(uri, {
          serverSelectionTimeoutMS: 5000,
          socketTimeoutMS: 45000,
          maxPoolSize: 10,
          minPoolSize: 5,
          retryWrites: true,
          retryReads: true
        });
        
        this.isConnected = true;
        logger.info('MongoDB connected successfully');
        return;
      } catch (error) {
        retries++;
        const errorMessage = error instanceof Error ? error.message : '未知错误';
        logger.error(`MongoDB connection error (attempt ${retries}/${this.maxRetries}):`, errorMessage);
        
        if (retries === this.maxRetries) {
          this.isConnected = false;
          throw new Error(`Failed to connect to MongoDB after ${this.maxRetries} attempts: ${errorMessage}`);
        }
        
        // Wait before retrying
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
      }
    }
  }

  public async disconnect(): Promise<void> {
    if (!this.isConnected) {
      logger.info('MongoDB already disconnected');
      return;
    }

    try {
      await mongoose.disconnect();
      this.isConnected = false;
      logger.info('MongoDB disconnected successfully');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '未知错误';
      logger.error('MongoDB disconnection error:', errorMessage);
      throw new Error(`Failed to disconnect from MongoDB: ${errorMessage}`);
    }
  }

  public isDatabaseConnected(): boolean {
    return this.isConnected;
  }
} 