import { Server } from 'socket.io';
import { Types } from 'mongoose';
import { User } from '../models/User';
import { WebSocket } from 'ws';
import { NetworkConfig, NetworkStatus } from '../types/network';
import { logger } from '../utils/logger';
import { EventEmitter } from 'events';

export class NetworkStatusService {
  private static instance: NetworkStatusService;
  private statusMap: Map<string, NetworkStatus> = new Map();
  private wsConnections: Map<string, WebSocket> = new Map();
  private monitoringInterval: NodeJS.Timeout | null = null;
  private wsServer: WebSocket.Server;
  private clients: Map<string, WebSocket>;
  private io: Server;

  public static getInstance(): NetworkStatusService {
    if (!NetworkStatusService.instance) {
      NetworkStatusService.instance = new NetworkStatusService();
    }
    return NetworkStatusService.instance;
  }

  constructor() {
    this.wsServer = new WebSocket.Server({ port: 8082 });
    this.clients = new Map();
    this.setupWebSocketServer(this.wsServer);
    this.initializeNetworks();
    this.startMonitoring();
    this.io = new Server();
  }

  private initializeNetworks() {
    const networks = ['OP', 'MATIC', 'TRC20', 'BEP20', 'ARB'];
    networks.forEach(network => {
      this.statusMap.set(network, {
        network,
        status: 'checking',
        lastChecked: new Date(),
        blockHeight: 0,
        latency: 0
      });
    });
  }

  private startMonitoring() {
    this.monitoringInterval = setInterval(async () => {
      try {
        await this.checkAllNetworks();
      } catch (error) {
        logger.error('Network monitoring error:', error);
      }
    }, 30000);
  }

  private async checkNetwork(network: string): Promise<NetworkStatus> {
    // 实现网络检查逻辑
    return {
      network,
      status: 'online',
      lastChecked: new Date(),
      blockHeight: 0,
      latency: 0
    };
  }

  private async checkAllNetworks() {
    for (const [network, status] of this.statusMap) {
      try {
        const newStatus = await this.checkNetwork(network);
        if (JSON.stringify(newStatus) !== JSON.stringify(status)) {
          this.statusMap.set(network, newStatus);
          this.emit('statusChange', { network, status: newStatus });
        }
      } catch (error: any) {
        logger.error(`Network check failed for ${network}:`, error);
        this.statusMap.set(network, {
          ...status,
          status: 'error',
          error: error.message
        });
      }
    }
  }

  public getStatus(network: string): NetworkStatus | undefined {
    return this.statusMap.get(network);
  }

  public getAllStatus(): NetworkStatus[] {
    return Array.from(this.statusMap.values());
  }

  public stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
    }
  }

  setupWebSocketServer(server: any) {
    this.wsServer = new WebSocket.Server(server);
  }

  async notifyNetworkStatus(userId: Types.ObjectId, status: 'online' | 'offline') {
    this.io.to(userId.toString()).emit('network_status', {
      userId,
      status
    });
  }
} 