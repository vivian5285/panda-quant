import { MT4Account, MT4Position, MT4Order, MT4Balance, MT4MarketData } from '../../interfaces/mt4';
import net from 'net';
import { EventEmitter } from 'events';

export class MT4Connector extends EventEmitter {
  private socket: net.Socket;
  private account: MT4Account;
  private connected: boolean = false;
  private reconnectAttempts: number = 0;
  private maxReconnectAttempts: number = 5;
  private reconnectInterval: number = 5000;

  constructor(account: MT4Account) {
    super();
    this.account = account;
    this.socket = new net.Socket();
    this.setupSocket();
  }

  private setupSocket() {
    this.socket.on('connect', () => {
      console.log(`Connected to MT4 server ${this.account.server}`);
      this.connected = true;
      this.reconnectAttempts = 0;
      this.emit('connected');
    });

    this.socket.on('data', (data) => {
      this.handleData(data);
    });

    this.socket.on('error', (error) => {
      console.error('MT4 connection error:', error);
      this.emit('error', error);
    });

    this.socket.on('close', () => {
      console.log('MT4 connection closed');
      this.connected = false;
      this.emit('disconnected');
      this.handleReconnect();
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts})...`);
      setTimeout(() => this.connect(), this.reconnectInterval);
    } else {
      console.error('Max reconnection attempts reached');
      this.emit('error', new Error('Max reconnection attempts reached'));
    }
  }

  connect(): Promise<void> {
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

  private handleData(data: Buffer) {
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
      console.error('Error parsing MT4 message:', error);
    }
  }

  private handleLoginResponse(response: any) {
    if (response.success) {
      console.log('Successfully logged in to MT4');
      this.emit('login_success');
    } else {
      console.error('MT4 login failed:', response.error);
      this.emit('login_failed', response.error);
    }
  }

  private handlePosition(data: any): MT4Position {
    const position: MT4Position = {
      ticket: data.ticket,
      symbol: data.symbol,
      type: data.type,
      lots: data.lots,
      openPrice: data.openPrice,
      openTime: new Date(data.openTime),
      closePrice: data.closePrice,
      closeTime: data.closeTime ? new Date(data.closeTime) : undefined,
      profit: data.profit,
      swap: data.swap,
      commission: data.commission,
      stopLoss: data.stopLoss,
      takeProfit: data.takeProfit,
    };
    this.emit('position', position);
    return position;
  }

  private handleOrder(data: any): MT4Order {
    const order: MT4Order = {
      ticket: data.ticket,
      symbol: data.symbol,
      type: data.type,
      lots: data.lots,
      price: data.price,
      stopLoss: data.stopLoss,
      takeProfit: data.takeProfit,
      comment: data.comment,
      expiration: new Date(data.expiration),
    };
    this.emit('order', order);
    return order;
  }

  private handleBalance(data: any): MT4Balance {
    const balance: MT4Balance = {
      balance: data.balance,
      equity: data.equity,
      margin: data.margin,
      freeMargin: data.freeMargin,
      marginLevel: data.marginLevel,
      currency: data.currency,
    };
    this.emit('balance', balance);
    return balance;
  }

  private handleMarketData(data: any): MT4MarketData {
    const marketData: MT4MarketData = {
      symbol: data.symbol,
      bid: data.bid,
      ask: data.ask,
      last: data.last,
      volume: data.volume,
      time: new Date(data.time),
      digits: data.digits,
      point: data.point,
      spread: data.spread,
    };
    this.emit('market_data', marketData);
    return marketData;
  }

  // 公共方法
  async getPositions(): Promise<MT4Position[]> {
    return new Promise((resolve) => {
      const positions: MT4Position[] = [];
      const handler = (position: MT4Position) => {
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

  async getOrders(): Promise<MT4Order[]> {
    return new Promise((resolve) => {
      const orders: MT4Order[] = [];
      const handler = (order: MT4Order) => {
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

  async getBalance(): Promise<MT4Balance> {
    return new Promise((resolve) => {
      const handler = (balance: MT4Balance) => {
        this.removeListener('balance', handler);
        resolve(balance);
      };
      this.on('balance', handler);
      this.socket.write(JSON.stringify({ type: 'get_balance' }) + '\n');
    });
  }

  async getMarketData(symbol: string): Promise<MT4MarketData> {
    return new Promise((resolve) => {
      const handler = (marketData: MT4MarketData) => {
        if (marketData.symbol === symbol) {
          this.removeListener('market_data', handler);
          resolve(marketData);
        }
      };
      this.on('market_data', handler);
      this.socket.write(JSON.stringify({ type: 'get_market_data', symbol }) + '\n');
    });
  }

  async createOrder(order: Omit<MT4Order, 'ticket'>): Promise<MT4Order> {
    return new Promise((resolve) => {
      const handler = (newOrder: MT4Order) => {
        if (newOrder.symbol === order.symbol && newOrder.type === order.type) {
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

  async modifyOrder(ticket: number, changes: Partial<MT4Order>): Promise<void> {
    this.socket.write(JSON.stringify({ type: 'modify_order', ticket, ...changes }) + '\n');
  }
} 