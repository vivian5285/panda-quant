import WebSocket from 'ws';
import { Redis } from 'ioredis';
import { logger } from '../utils/logger';
import { config } from '../config';

interface MarketData {
  symbol: string;
  price: number;
  volume: number;
  timestamp: number;
}

export class RealTimeDataService {
  private static instance: RealTimeDataService;
  private ws: WebSocket | null = null;
  private redis: Redis;
  private subscribers: Map<string, Set<(data: MarketData) => void>> = new Map();
  private reconnectAttempts: number = 0;
  private readonly MAX_RECONNECT_ATTEMPTS = 5;
  private readonly RECONNECT_DELAY = 5000;
  private readonly CACHE_TTL = 60; // 1 minute cache TTL

  private constructor() {
    this.redis = new Redis(config.redis);
    this.connect();
  }

  public static getInstance(): RealTimeDataService {
    if (!RealTimeDataService.instance) {
      RealTimeDataService.instance = new RealTimeDataService();
    }
    return RealTimeDataService.instance;
  }

  private connect(): void {
    try {
      this.ws = new WebSocket(config.wsUrl);
      this.setupWebSocketHandlers();
    } catch (error) {
      logger.error('WebSocket connection failed:', error);
      this.handleReconnect();
    }
  }

  private setupWebSocketHandlers(): void {
    if (!this.ws) return;

    this.ws.on('open', () => {
      logger.info('WebSocket connected');
      this.reconnectAttempts = 0;
      this.subscribeToSymbols();
    });

    this.ws.on('message', async (data: string) => {
      try {
        const marketData: MarketData = JSON.parse(data);
        await this.processMarketData(marketData);
      } catch (error) {
        logger.error('Error processing market data:', error);
      }
    });

    this.ws.on('close', () => {
      logger.warn('WebSocket connection closed');
      this.handleReconnect();
    });

    this.ws.on('error', (error) => {
      logger.error('WebSocket error:', error);
      this.handleReconnect();
    });
  }

  private async processMarketData(data: MarketData): Promise<void> {
    // Cache the data
    await this.redis.setex(
      `market:${data.symbol}`,
      this.CACHE_TTL,
      JSON.stringify(data)
    );

    // Notify subscribers
    const symbolSubscribers = this.subscribers.get(data.symbol);
    if (symbolSubscribers) {
      symbolSubscribers.forEach(callback => {
        try {
          callback(data);
        } catch (error) {
          logger.error('Error in subscriber callback:', error);
        }
      });
    }
  }

  private handleReconnect(): void {
    if (this.reconnectAttempts >= this.MAX_RECONNECT_ATTEMPTS) {
      logger.error('Max reconnection attempts reached');
      return;
    }

    this.reconnectAttempts++;
    const delay = this.RECONNECT_DELAY * this.reconnectAttempts;

    logger.info(`Attempting to reconnect in ${delay}ms (attempt ${this.reconnectAttempts})`);
    setTimeout(() => this.connect(), delay);
  }

  private subscribeToSymbols(): void {
    if (!this.ws) return;

    const symbols = Array.from(this.subscribers.keys());
    if (symbols.length > 0) {
      this.ws.send(JSON.stringify({
        type: 'subscribe',
        symbols
      }));
    }
  }

  public async getMarketData(symbol: string): Promise<MarketData | null> {
    // Try to get from cache first
    const cachedData = await this.redis.get(`market:${symbol}`);
    if (cachedData) {
      return JSON.parse(cachedData);
    }

    // If not in cache, fetch from WebSocket
    return new Promise((resolve) => {
      const timeout = setTimeout(() => resolve(null), 5000);
      
      const callback = (data: MarketData) => {
        clearTimeout(timeout);
        resolve(data);
        this.unsubscribe(symbol, callback);
      };

      this.subscribe(symbol, callback);
    });
  }

  public subscribe(symbol: string, callback: (data: MarketData) => void): void {
    if (!this.subscribers.has(symbol)) {
      this.subscribers.set(symbol, new Set());
    }
    this.subscribers.get(symbol)?.add(callback);

    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify({
        type: 'subscribe',
        symbols: [symbol]
      }));
    }
  }

  public unsubscribe(symbol: string, callback: (data: MarketData) => void): void {
    const symbolSubscribers = this.subscribers.get(symbol);
    if (symbolSubscribers) {
      symbolSubscribers.delete(callback);
      if (symbolSubscribers.size === 0) {
        this.subscribers.delete(symbol);
        if (this.ws?.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify({
            type: 'unsubscribe',
            symbols: [symbol]
          }));
        }
      }
    }
  }

  public async cleanup(): Promise<void> {
    if (this.ws) {
      this.ws.close();
    }
    await this.redis.quit();
  }
} 