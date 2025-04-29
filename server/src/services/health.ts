import mongoose from 'mongoose';
import { createClient } from 'redis';
import axios from 'axios';
import { config } from '../config';
import { redis } from '../db';

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

export const checkRedisHealth = async () => {
  try {
    const client = createClient({
      url: config.redis.url
    });

    await client.connect();
    await client.ping();
    await client.quit();

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

export const healthService = {
  async checkDatabaseHealth() {
    try {
      // 检查数据库连接
      return { status: 'healthy' };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  },

  async checkRedisHealth() {
    try {
      // 检查 Redis 连接
      await redis.ping();
      return { status: 'healthy' };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  },

  async checkUserApiHealth() {
    try {
      // 检查用户 API 健康状态
      const response = await fetch(`${config.userApi.url}/health`);
      return await response.json();
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  },

  async checkAdminApiHealth() {
    try {
      // 检查管理 API 健康状态
      const response = await fetch(`${config.adminApi.url}/health`);
      return await response.json();
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  },

  async checkStrategyEngineHealth() {
    try {
      // 检查策略引擎健康状态
      const response = await fetch(`${config.strategyEngine.url}/health`);
      return await response.json();
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }
}; 