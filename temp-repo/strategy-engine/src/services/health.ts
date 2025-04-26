import mongoose from 'mongoose';
import Redis from 'ioredis';
import axios from 'axios';

export const checkDatabaseHealth = async (): Promise<boolean> => {
  try {
    if (!mongoose.connection.db) {
      return false;
    }
    await mongoose.connection.db.admin().ping();
    return true;
  } catch (error) {
    console.error('Database health check failed:', error);
    return false;
  }
};

export const checkRedisHealth = async (): Promise<boolean> => {
  try {
    const redis = new Redis(process.env.REDIS_URI);
    await redis.ping();
    redis.disconnect();
    return true;
  } catch (error) {
    console.error('Redis health check failed:', error);
    return false;
  }
};

export const checkServerHealth = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${process.env.SERVER_URL}/health`);
    return response.data.status === 'ok';
  } catch (error) {
    console.error('Server health check failed:', error);
    return false;
  }
}; 