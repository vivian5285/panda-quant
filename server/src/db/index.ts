import { connect } from 'mongoose';
import { Redis } from 'ioredis';
import config from '../config';

export const connectDB = async () => {
  try {
    await connect(config.mongodb.uri);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export const redis = new Redis({
  host: config.redis.host,
  port: config.redis.port,
  password: config.redis.password
}); 