import mongoose from 'mongoose';
import { createClient } from 'redis';
import axios from 'axios';
import { config } from '../config';
import { INetworkStatus, NetworkStatusCreateInput } from '../types/Network';
import { NetworkStatus } from '../models/network-status.model';
import { logger } from '../utils/logger';
import { EventEmitter } from 'events';
import { Health, IHealthDocument } from '../models/health.model';
import { IHealth } from '../types/Health';
import { Types } from 'mongoose';

export interface HealthCheckResult {
  status: 'healthy' | 'unhealthy';
  error?: string;
}

type NetworkComponent = 'database' | 'api' | 'redis' | 'websocket' | 'userApi' | 'adminApi' | 'strategyEngine';
type NetworkType = 'database' | 'api' | 'redis' | 'websocket';

export class HealthService extends EventEmitter {
  private networkStatusModel = NetworkStatus;
  private static instance: HealthService;
  private status: Map<string, boolean> = new Map();

  private constructor() {
    super();
    this.initializeStatus();
  }

  static getInstance(): HealthService {
    if (!HealthService.instance) {
      HealthService.instance = new HealthService();
    }
    return HealthService.instance;
  }

  private initializeStatus(): void {
    this.status.set('database', false);
    this.status.set('redis', false);
    this.status.set('api', false);
    this.status.set('userApi', false);
    this.status.set('adminApi', false);
    this.status.set('strategyEngine', false);
    logger.info('Health status initialized');
  }

  setDatabaseStatus(isHealthy: boolean): void {
    this.status.set('database', isHealthy);
    logger.info(`Database health status updated: ${isHealthy}`);
  }

  setRedisStatus(isHealthy: boolean): void {
    this.status.set('redis', isHealthy);
    logger.info(`Redis health status updated: ${isHealthy}`);
  }

  setApiStatus(isHealthy: boolean): void {
    this.status.set('api', isHealthy);
    logger.info(`API health status updated: ${isHealthy}`);
  }

  getDatabaseStatus(): boolean {
    return this.status.get('database') || false;
  }

  getRedisStatus(): boolean {
    return this.status.get('redis') || false;
  }

  getApiStatus(): boolean {
    return this.status.get('api') || false;
  }

  getOverallStatus(): boolean {
    return Array.from(this.status.values()).every(status => status);
  }

  getAllStatus(): Record<string, boolean> {
    return Object.fromEntries(this.status);
  }

  public async checkHealth(): Promise<{
    status: 'healthy' | 'degraded' | 'unhealthy';
    components: Record<NetworkComponent, {
      status: 'online' | 'offline';
      message?: string;
    }>;
  }> {
    const components: Record<NetworkComponent, {
      status: 'online' | 'offline';
      message?: string;
    }> = {
      database: await this.checkDatabase(),
      api: await this.checkApi(),
      redis: await this.checkRedis(),
      websocket: await this.checkWebSocket(),
      userApi: { status: 'online' },
      adminApi: { status: 'online' },
      strategyEngine: { status: 'online' }
    };

    const status = this.determineOverallStatus(components);
    return { status, components };
  }

  private async checkDatabase(): Promise<{ status: 'online' | 'offline'; message?: string }> {
    try {
      const startTime = Date.now();
      if (!mongoose.connection.readyState) {
        throw new Error('Database not connected');
      }
      if (!mongoose.connection.db) {
        throw new Error('Database connection not established');
      }
      await mongoose.connection.db.admin().ping();
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      await this.updateNetworkComponentStatus('database', 'online', undefined, responseTime);
      return { status: 'online', message: `Response time: ${responseTime}ms` };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await this.updateNetworkComponentStatus('database', 'offline', errorMessage);
      return { status: 'offline', message: errorMessage };
    }
  }

  private async checkApi(): Promise<{ status: 'online' | 'offline'; message?: string }> {
    try {
      const startTime = Date.now();
      await axios.get(`${config.server.port}/health`);
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      await this.updateNetworkComponentStatus('api', 'online', undefined, responseTime);
      return { status: 'online', message: `Response time: ${responseTime}ms` };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await this.updateNetworkComponentStatus('api', 'offline', errorMessage);
      return { status: 'offline', message: errorMessage };
    }
  }

  private async checkRedis(): Promise<{ status: 'online' | 'offline'; message?: string }> {
    try {
      const startTime = Date.now();
      const client = createClient({ 
        url: config.redis.url,
        password: config.redis.password
      });
      await client.connect();
      await client.ping();
      await client.quit();
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      await this.updateNetworkComponentStatus('redis', 'online', undefined, responseTime);
      return { status: 'online', message: `Response time: ${responseTime}ms` };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await this.updateNetworkComponentStatus('redis', 'offline', errorMessage);
      return { status: 'offline', message: errorMessage };
    }
  }

  private async checkWebSocket(): Promise<{ status: 'online' | 'offline'; message?: string }> {
    try {
      const startTime = Date.now();
      // Add WebSocket health check logic here
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      await this.updateNetworkComponentStatus('websocket', 'online', undefined, responseTime);
      return { status: 'online', message: `Response time: ${responseTime}ms` };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await this.updateNetworkComponentStatus('websocket', 'offline', errorMessage);
      return { status: 'offline', message: errorMessage };
    }
  }

  private determineOverallStatus(components: Record<NetworkComponent, { status: 'online' | 'offline' }>): 'healthy' | 'degraded' | 'unhealthy' {
    const onlineCount = Object.values(components).filter(c => c.status === 'online').length;
    const totalCount = Object.keys(components).length;
    if (onlineCount === totalCount) return 'healthy';
    if (onlineCount >= totalCount / 2) return 'degraded';
    return 'unhealthy';
  }

  async updateNetworkComponentStatus(type: NetworkComponent, status: 'online' | 'offline', error?: string, responseTime?: number): Promise<void> {
    try {
      const networkStatusData: Omit<INetworkStatus, '_id' | 'createdAt' | 'updatedAt'> = {
        network: type,
        status: status === 'online' ? 'online' : 'offline',
        lastChecked: new Date(),
        latency: responseTime || 0,
        type: type as NetworkType,
        responseTime: responseTime || 0,
        error
      };
      await this.networkStatusModel.create(networkStatusData);
    } catch (error) {
      logger.error('Error updating network status:', error);
    }
  }

  async getNetworkStatus(): Promise<INetworkStatus[]> {
    try {
      const statuses = await this.networkStatusModel.find().sort({ lastChecked: -1 });
      return statuses.map(status => ({
        _id: status._id,
        network: status.network,
        status: status.status as 'online' | 'offline' | 'error' | 'checking',
        lastChecked: status.lastChecked,
        latency: status.latency,
        type: status.type,
        responseTime: status.responseTime,
        error: status.error,
        createdAt: status.createdAt,
        updatedAt: status.updatedAt
      }));
    } catch (error) {
      logger.error('Error getting network status:', error);
      throw error;
    }
  }

  async createHealth(data: Omit<IHealth, '_id' | 'createdAt' | 'updatedAt'>): Promise<IHealth> {
    try {
      const health = new Health({
        ...data,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      const savedHealth = await health.save();
      return this.mapToIHealth(savedHealth);
    } catch (error) {
      logger.error('Error creating health record:', error);
      throw error;
    }
  }

  async getHealthById(id: string): Promise<IHealth | null> {
    try {
      const health = await Health.findById(id);
      if (!health) return null;
      return this.mapToIHealth(health);
    } catch (error) {
      logger.error('Error getting health record:', error);
      throw error;
    }
  }

  async updateHealth(id: string, data: Partial<IHealth>): Promise<IHealth | null> {
    try {
      const health = await Health.findByIdAndUpdate(
        id,
        { ...data, updatedAt: new Date() },
        { new: true }
      );
      if (!health) return null;
      return this.mapToIHealth(health);
    } catch (error) {
      logger.error('Error updating health record:', error);
      throw error;
    }
  }

  async deleteHealth(id: string): Promise<boolean> {
    try {
      const result = await Health.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      logger.error('Error deleting health record:', error);
      throw error;
    }
  }

  async checkDatabaseConnection(): Promise<boolean> {
    try {
      if (!mongoose.connection.readyState) {
        return false;
      }
      if (!mongoose.connection.db) {
        return false;
      }
      await mongoose.connection.db.admin().ping();
      return true;
    } catch (error) {
      logger.error('Database connection check failed:', error);
      return false;
    }
  }

  public async getHealth(): Promise<IHealth> {
    try {
      const health = await Health.findOne().sort({ createdAt: -1 });
      if (!health) {
        return this.createHealth({
          networkStatus: {
            _id: new Types.ObjectId(),
            network: 'system',
            status: 'online',
            lastChecked: new Date(),
            latency: 0,
            type: 'database',
            responseTime: 0,
            createdAt: new Date(),
            updatedAt: new Date()
          },
          lastChecked: new Date()
        });
      }
      return this.mapToIHealth(health);
    } catch (error) {
      logger.error('Error getting health status:', error);
      throw error;
    }
  }

  public async updateHealthStatus(data: Partial<IHealth>): Promise<IHealth> {
    try {
      const health = await Health.findOneAndUpdate(
        {},
        { ...data, updatedAt: new Date() },
        { new: true, upsert: true }
      );
      return this.mapToIHealth(health);
    } catch (error) {
      logger.error('Error updating health status:', error);
      throw error;
    }
  }

  public async updateHealthWithNetworkStatus(networkStatus: INetworkStatus): Promise<IHealth> {
    try {
      const health = await Health.findOneAndUpdate(
        {},
        {
          networkStatus,
          lastChecked: new Date(),
          updatedAt: new Date()
        },
        { new: true, upsert: true }
      );
      return this.mapToIHealth(health);
    } catch (error) {
      logger.error('Error updating health with network status:', error);
      throw error;
    }
  }

  private mapToIHealth(doc: IHealthDocument): IHealth {
    const networkStatus: INetworkStatus = {
      _id: doc.networkStatus._id,
      network: doc.networkStatus.network,
      status: doc.networkStatus.status,
      lastChecked: doc.networkStatus.lastChecked,
      latency: doc.networkStatus.latency,
      type: doc.networkStatus.type,
      responseTime: doc.networkStatus.responseTime,
      error: doc.networkStatus.error,
      createdAt: doc.networkStatus.createdAt,
      updatedAt: doc.networkStatus.updatedAt
    };

    return {
      _id: doc._id.toString(),
      networkStatus,
      lastChecked: doc.lastChecked,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }

  private convertNetworkStatus(status: INetworkStatus) {
    return {
      _id: status._id,
      network: status.network,
      status: status.status,
      lastChecked: status.lastChecked,
      blockHeight: status.blockHeight,
      latency: status.latency,
      type: status.type,
      responseTime: status.responseTime,
      error: status.error,
      createdAt: status.createdAt,
      updatedAt: status.updatedAt
    };
  }
}

export const healthService = HealthService.getInstance(); 