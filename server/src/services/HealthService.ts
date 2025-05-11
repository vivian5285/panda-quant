import mongoose from 'mongoose';
import { createClient } from 'redis';
import axios from 'axios';
import { config } from '../Config';
import { INetworkStatus, NetworkStatusCreateInput } from '../types/Network';
import NetworkStatusModel from '../models/NetworkStatus.model';
import { logger } from '../utils/Logger';
import { EventEmitter } from 'events';
import { Health, IHealth, IHealthDocument } from '../models/Health.model';
import { Types } from 'mongoose';
import { AppError } from '../utils/AppError';
import { NetworkStatus as NetworkStatusEnum, NetworkType as NetworkTypeEnum } from '../types/Enums';

interface HealthCheckResult {
  status: NetworkStatusEnum;
  latency?: number;
  responseTime?: number;
  error?: string;
}

type NetworkComponent = 'database' | 'api' | 'redis' | 'websocket' | 'userApi' | 'adminApi' | 'strategyEngine';
type NetworkComponentType = 'database' | 'api' | 'redis' | 'websocket';

export class HealthService extends EventEmitter {
  private networkStatusModel = NetworkStatusModel;
  private static instance: HealthService;
  private status: Map<string, boolean> = new Map();
  private redisClient: ReturnType<typeof createClient>;

  private constructor() {
    super();
    this.initializeStatus();
    this.redisClient = createClient({
      url: process.env.REDIS_URL || 'redis://localhost:6379'
    });
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
    status: NetworkStatusEnum;
    components: Record<NetworkComponent, HealthCheckResult>;
  }> {
    const components: Record<NetworkComponent, HealthCheckResult> = {
      database: await this.checkDatabase(),
      api: await this.checkApi(),
      redis: await this.checkRedis(),
      websocket: await this.checkWebSocket(),
      userApi: { status: NetworkStatusEnum.ONLINE },
      adminApi: { status: NetworkStatusEnum.ONLINE },
      strategyEngine: { status: NetworkStatusEnum.ONLINE }
    };

    const status = this.determineOverallStatus(components);
    return { status, components };
  }

  private async checkDatabase(): Promise<HealthCheckResult> {
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
      await this.updateNetworkComponentStatus('database', NetworkStatusEnum.ONLINE, undefined, responseTime);
      return {
        status: NetworkStatusEnum.ONLINE,
        responseTime
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await this.updateNetworkComponentStatus('database', NetworkStatusEnum.ERROR, errorMessage);
      return {
        status: NetworkStatusEnum.ERROR,
        error: errorMessage
      };
    }
  }

  private async checkApi(): Promise<HealthCheckResult> {
    try {
      const startTime = Date.now();
      await axios.get(`${config.server.port}/health`);
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      await this.updateNetworkComponentStatus('api', NetworkStatusEnum.ONLINE, undefined, responseTime);
      return {
        status: NetworkStatusEnum.ONLINE,
        responseTime
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await this.updateNetworkComponentStatus('api', NetworkStatusEnum.ERROR, errorMessage);
      return {
        status: NetworkStatusEnum.ERROR,
        error: errorMessage
      };
    }
  }

  private async checkRedis(): Promise<HealthCheckResult> {
    try {
      const startTime = Date.now();
      await this.redisClient.ping();
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      await this.updateNetworkComponentStatus('redis', NetworkStatusEnum.ONLINE, undefined, responseTime);
      return {
        status: NetworkStatusEnum.ONLINE,
        responseTime
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await this.updateNetworkComponentStatus('redis', NetworkStatusEnum.ERROR, errorMessage);
      return {
        status: NetworkStatusEnum.ERROR,
        error: errorMessage
      };
    }
  }

  private async checkWebSocket(): Promise<HealthCheckResult> {
    try {
      const startTime = Date.now();
      // Add WebSocket health check logic here
      const endTime = Date.now();
      const responseTime = endTime - startTime;
      await this.updateNetworkComponentStatus('websocket', NetworkStatusEnum.ONLINE, undefined, responseTime);
      return {
        status: NetworkStatusEnum.ONLINE,
        responseTime
      };
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      await this.updateNetworkComponentStatus('websocket', NetworkStatusEnum.ERROR, errorMessage);
      return {
        status: NetworkStatusEnum.ERROR,
        error: errorMessage
      };
    }
  }

  private determineOverallStatus(components: Record<NetworkComponent, HealthCheckResult>): NetworkStatusEnum {
    const onlineCount = Object.values(components).filter(c => c.status === NetworkStatusEnum.ONLINE).length;
    const totalCount = Object.keys(components).length;
    if (onlineCount === totalCount) return NetworkStatusEnum.ONLINE;
    if (onlineCount >= totalCount / 2) return NetworkStatusEnum.CHECKING;
    return NetworkStatusEnum.ERROR;
  }

  async updateNetworkComponentStatus(type: NetworkComponent, status: NetworkStatusEnum, error?: string, responseTime?: number): Promise<void> {
    try {
      const networkStatusData: NetworkStatusCreateInput = {
        network: type,
        status,
        lastCheck: new Date(),
        latency: responseTime || 0,
        type: NetworkTypeEnum.MAINNET,
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
      const statuses = await this.networkStatusModel.find().sort({ lastCheck: -1 });
      return statuses.map(status => ({
        _id: status._id as Types.ObjectId,
        network: status.network,
        status: status.status,
        lastCheck: status.lastCheck,
        latency: status.latency,
        type: NetworkTypeEnum.MAINNET,
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

  async createHealthCheck(healthData: Omit<IHealth, '_id'>): Promise<IHealthDocument> {
    try {
      const health = new Health(healthData);
      await health.save();
      return health;
    } catch (error) {
      logger.error('Error creating health check:', error);
      throw new AppError('Failed to create health check', 500);
    }
  }

  async getHealthCheckById(id: string): Promise<IHealthDocument | null> {
    try {
      return await Health.findById(id);
    } catch (error) {
      logger.error('Error getting health check:', error);
      throw new AppError('Failed to get health check', 500);
    }
  }

  async getHealthChecksByUser(userId: string): Promise<IHealthDocument[]> {
    try {
      return await Health.find({ userId: new Types.ObjectId(userId) });
    } catch (error) {
      logger.error('Error getting user health checks:', error);
      throw new AppError('Failed to get user health checks', 500);
    }
  }

  async updateHealthStatus(id: string, status: NetworkStatusEnum): Promise<IHealthDocument | null> {
    try {
      return await Health.findByIdAndUpdate(
        id,
        { 
          status,
          updatedAt: new Date()
        },
        { new: true }
      );
    } catch (error) {
      logger.error('Error updating health status:', error);
      throw new AppError('Failed to update health status', 500);
    }
  }

  async getSystemHealth(): Promise<{
    status: NetworkStatusEnum;
    components: {
      database: boolean;
      redis: boolean;
      api: boolean;
    };
    lastCheck: Date;
  }> {
    try {
      // TODO: Implement actual system health checks
      return {
        status: NetworkStatusEnum.ONLINE,
        components: {
          database: true,
          redis: true,
          api: true
        },
        lastCheck: new Date()
      };
    } catch (error) {
      logger.error('Error getting system health:', error);
      throw new AppError('Failed to get system health', 500);
    }
  }

  async getHealthMetrics(): Promise<{
    cpu: number;
    memory: number;
    disk: number;
    uptime: number;
  }> {
    try {
      // TODO: Implement actual metrics collection
      return {
        cpu: 0,
        memory: 0,
        disk: 0,
        uptime: 0
      };
    } catch (error) {
      logger.error('Error getting health metrics:', error);
      throw new AppError('Failed to get health metrics', 500);
    }
  }
}

export const healthService = HealthService.getInstance(); 