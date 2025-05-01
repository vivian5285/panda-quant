import { IMT4Account, IMT4Position, IMT4Order, IMT4Balance, IMT4MarketData } from '../../types/mt4';
import net from 'net';
import { EventEmitter } from 'events';
import { createLogger } from '../../utils/logger';

export class MT4Connector extends EventEmitter {
  private socket: net.Socket;
  private account: IMT4Account;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectInterval: number = 5000;
  private logger = createLogger('MT4Connector');

  constructor(account: IMT4Account) {
    super();
    this.account = account;
    this.socket = new net.Socket();
    this.setupSocket();
  }

  private setupSocket() {
    this.socket.on('connect', () => {
      this.logger.info(`Connected to MT4 server ${this.account.server}`);
      this.reconnectAttempts = 0;
      this.emit('connected');
    });

    this.socket.on('data', (data) => {
      this.onData(data);
    });

    this.socket.on('error', (error) => {
      this.onError(error);
    });

    this.socket.on('close', () => {
      this.logger.info('MT4 connection closed');
      this.emit('disconnected');
      this.handleReconnect();
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      this.logger.info(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => this.connect(), this.reconnectInterval);
    } else {
      this.logger.error('Max reconnection attempts reached');
      this.emit('error', new Error('Max reconnection attempts reached'));
    }
  }

  connect(): Promise<void> {
    this.logger.info('Connecting to MT4...');
    return new Promise((resolve, reject) => {
      const [host, port] = this.account.server.split(':');
      
      this.socket.connect(parseInt(port), host, () => {
        // 发送登录信息
        this.sendLogin();
        resolve();
      });

      this.socket.once('error', reject);
    });
  }

  disconnect(): void {
    this.logger.info('Disconnecting from MT4...');
    this.socket.destroy();
  }

  private sendLogin() {
    const loginData = {
      type: 'login',
      login: this.account.login,
      password: this.account.password,
    };
    this.socket.write(JSON.stringify(loginData) + '\n');
  }

  private onData(data: Buffer) {
    this.logger.debug('Received data from MT4:', data);
    try {
      const message = JSON.parse(data.toString());
      this.emit('message', message);

      switch (message.type) {
        case 'login_response':
          this.handleLoginResponse(message);
          break;
        case 'position':
          this.handlePosition(message);
          break;
        case 'order':
          this.handleOrder(message);
          break;
        case 'balance':
          this.handleBalance(message);
          break;
        case 'market_data':
          this.handleMarketData(message);
          break;
      }
    } catch (error) {
      this.logger.error('Error parsing MT4 message:', error);
    }
  }

  private onError(error: Error) {
    this.logger.error('MT4 connection error:', error);
    this.emit('error', error);
  }

  private handleLoginResponse(response: any) {
    if (response.success) {
      this.logger.info('Successfully logged in to MT4');
      this.emit('login_success');
    } else {
      this.logger.error('MT4 login failed:', response.error);
      this.emit('login_failed', response.error);
    }
  }

  private handlePosition(data: any): IMT4Position {
    const position: IMT4Position = {
      ticket: data.ticket,
      symbol: data.symbol,
      type: data.type,
      volume: data.lots,
      openPrice: data.openPrice,
      currentPrice: data.currentPrice,
      stopLoss: data.stopLoss,
      takeProfit: data.takeProfit,
      swap: data.swap,
      profit: data.profit,
      openTime: new Date(data.openTime),
      closeTime: data.closeTime ? new Date(data.closeTime) : undefined
    };
    this.emit('position', position);
    return position;
  }

  private handleOrder(data: any): IMT4Order {
    const order: IMT4Order = {
      ticket: data.ticket,
      symbol: data.symbol,
      type: data.type,
      volume: data.lots,
      price: data.price,
      stopLoss: data.stopLoss,
      takeProfit: data.takeProfit,
      openTime: new Date(data.openTime),
      closeTime: data.closeTime ? new Date(data.closeTime) : undefined,
      status: data.status
    };
    this.emit('order', order);
    return order;
  }

  private handleBalance(data: any): IMT4Balance {
    const balance: IMT4Balance = {
      balance: data.balance,
      equity: data.equity,
      margin: data.margin,
      freeMargin: data.freeMargin,
      marginLevel: data.marginLevel,
      timestamp: new Date()
    };
    this.emit('balance', balance);
    return balance;
  }

  private handleMarketData(data: any): IMT4MarketData {
    const marketData: IMT4MarketData = {
      symbol: data.symbol,
      bid: data.bid,
      ask: data.ask,
      high: data.high,
      low: data.low,
      time: new Date(data.time),
      volume: data.volume,
      spread: data.ask - data.bid
    };
    this.emit('market_data', marketData);
    return marketData;
  }

  // 公共方法
  async getPositions(): Promise<IMT4Position[]> {
    return new Promise((resolve) => {
      const positions: IMT4Position[] = [];
      const handler = (position: IMT4Position) => {
        positions.push(position);
      };
      this.on('position', handler);
      this.socket.write(JSON.stringify({ type: 'get_positions' }) + '\n');
      setTimeout(() => {
        this.removeListener('position', handler);
        resolve(positions);
      }, 1000);
    });
  }

  async getOrders(): Promise<IMT4Order[]> {
    return new Promise((resolve) => {
      const orders: IMT4Order[] = [];
      const handler = (order: IMT4Order) => {
        orders.push(order);
      };
      this.on('order', handler);
      this.socket.write(JSON.stringify({ type: 'get_orders' }) + '\n');
      setTimeout(() => {
        this.removeListener('order', handler);
        resolve(orders);
      }, 1000);
    });
  }

  async getBalance(): Promise<IMT4Balance> {
    return new Promise((resolve) => {
      const handler = (balance: IMT4Balance) => {
        this.removeListener('balance', handler);
        resolve(balance);
      };
      this.on('balance', handler);
      this.socket.write(JSON.stringify({ type: 'get_balance' }) + '\n');
    });
  }

  async getMarketData(symbol: string): Promise<IMT4MarketData> {
    return new Promise((resolve) => {
      const handler = (marketData: IMT4MarketData) => {
        if (marketData.symbol === symbol) {
          this.removeListener('market_data', handler);
          resolve(marketData);
        }
      };
      this.on('market_data', handler);
      this.socket.write(JSON.stringify({ type: 'get_market_data', symbol }) + '\n');
    });
  }

  async createOrder(order: Omit<IMT4Order, 'ticket'>): Promise<IMT4Order> {
    return new Promise((resolve) => {
      const handler = (newOrder: IMT4Order) => {
        if (newOrder['symbol'] === order['symbol'] && newOrder['type'] === order['type']) {
          this.removeListener('order', handler);
          resolve(newOrder);
        }
      };
      this.on('order', handler);
      this.socket.write(JSON.stringify({ 
        messageType: 'create_order',
        ...order 
      }) + '\n');
    });
  }

  async closePosition(ticket: number): Promise<void> {
    this.socket.write(JSON.stringify({ type: 'close_position', ticket }) + '\n');
  }

  async modifyOrder(ticket: number, changes: Partial<IMT4Order>): Promise<void> {
    this.socket.write(JSON.stringify({ type: 'modify_order', ticket, ...changes }) + '\n');
  }
} 