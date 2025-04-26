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

export const checkUserApiHealth = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${process.env.USER_API_URL}/health`);
    return response.data.status === 'ok';
  } catch (error) {
    console.error('User API health check failed:', error);
    return false;
  }
};

export const checkAdminApiHealth = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${process.env.ADMIN_API_URL}/health`);
    return response.data.status === 'ok';
  } catch (error) {
    console.error('Admin API health check failed:', error);
    return false;
  }
};

export const checkStrategyEngineHealth = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${process.env.STRATEGY_ENGINE_URL}/health`);
    return response.data.status === 'ok';
  } catch (error) {
    console.error('Strategy Engine health check failed:', error);
    return false;
  }
}; 