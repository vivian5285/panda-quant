import mongoose from 'mongoose';
import { redis } from './redis';
import { config } from '../config';
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
    await redis.ping();
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

export async function checkHealth(): Promise<{
  status: string;
  services: {
    redis: boolean;
    database: boolean;
    server: boolean;
  };
}> {
  const redisStatus = await checkRedis();
  const databaseStatus = await checkDatabase();
  const serverStatus = await checkServer();

  return {
    status: redisStatus && databaseStatus && serverStatus ? 'healthy' : 'degraded',
    services: {
      redis: redisStatus,
      database: databaseStatus,
      server: serverStatus
    }
  };
}

async function checkRedis(): Promise<boolean> {
  try {
    await redis.ping();
    return true;
  } catch (error) {
    console.error('Redis health check failed:', error);
    return false;
  }
}

async function checkDatabase(): Promise<boolean> {
  // TODO: Implement database health check
  return true;
}

async function checkServer(): Promise<boolean> {
  // TODO: Implement server health check
  return true;
} 