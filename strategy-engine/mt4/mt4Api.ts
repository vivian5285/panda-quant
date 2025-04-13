import { MT4Config } from '../types';

export class MT4Api {
  private config: MT4Config;
  private socket: WebSocket;

  constructor(config: MT4Config) {
    this.config = config;
    this.socket = this.connectToMT4();
  }

  private connectToMT4(): WebSocket {
    const { server, port, login, password } = this.config;
    const ws = new WebSocket(`ws://${server}:${port}`);

    ws.onopen = () => {
      // 发送认证信息
      ws.send(JSON.stringify({
        type: 'auth',
        login,
        password,
      }));
    };

    ws.onerror = (error) => {
      console.error('MT4 connection error:', error);
    };

    return ws;
  }

  // 创建订单
  async createOrder(
    symbol: string,
    type: 'BUY' | 'SELL',
    volume: number,
    price?: number
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const orderId = Date.now().toString();
      
      this.socket.send(JSON.stringify({
        type: 'order',
        orderId,
        symbol,
        type,
        volume,
        price,
      }));

      // 设置超时
      const timeout = setTimeout(() => {
        reject(new Error('Order creation timeout'));
      }, 5000);

      // 监听订单状态
      this.socket.onmessage = (event) => {
        const response = JSON.parse(event.data);
        if (response.orderId === orderId) {
          clearTimeout(timeout);
          if (response.status === 'success') {
            resolve(response.ticket);
          } else {
            reject(new Error(response.message));
          }
        }
      };
    });
  }

  // 关闭订单
  async closeOrder(ticket: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket.send(JSON.stringify({
        type: 'close',
        ticket,
      }));

      const timeout = setTimeout(() => {
        reject(new Error('Order close timeout'));
      }, 5000);

      this.socket.onmessage = (event) => {
        const response = JSON.parse(event.data);
        if (response.ticket === ticket) {
          clearTimeout(timeout);
          if (response.status === 'success') {
            resolve();
          } else {
            reject(new Error(response.message));
          }
        }
      };
    });
  }

  // 修改订单
  async modifyOrder(
    ticket: string,
    stopLoss?: number,
    takeProfit?: number
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.socket.send(JSON.stringify({
        type: 'modify',
        ticket,
        stopLoss,
        takeProfit,
      }));

      const timeout = setTimeout(() => {
        reject(new Error('Order modification timeout'));
      }, 5000);

      this.socket.onmessage = (event) => {
        const response = JSON.parse(event.data);
        if (response.ticket === ticket) {
          clearTimeout(timeout);
          if (response.status === 'success') {
            resolve();
          } else {
            reject(new Error(response.message));
          }
        }
      };
    });
  }

  // 获取账户信息
  async getAccountInfo(): Promise<any> {
    return new Promise((resolve, reject) => {
      this.socket.send(JSON.stringify({
        type: 'account',
      }));

      const timeout = setTimeout(() => {
        reject(new Error('Account info timeout'));
      }, 5000);

      this.socket.onmessage = (event) => {
        const response = JSON.parse(event.data);
        if (response.type === 'account') {
          clearTimeout(timeout);
          if (response.status === 'success') {
            resolve(response.data);
          } else {
            reject(new Error(response.message));
          }
        }
      };
    });
  }

  // 获取订单历史
  async getOrderHistory(
    startTime: number,
    endTime: number
  ): Promise<any[]> {
    return new Promise((resolve, reject) => {
      this.socket.send(JSON.stringify({
        type: 'history',
        startTime,
        endTime,
      }));

      const timeout = setTimeout(() => {
        reject(new Error('Order history timeout'));
      }, 5000);

      this.socket.onmessage = (event) => {
        const response = JSON.parse(event.data);
        if (response.type === 'history') {
          clearTimeout(timeout);
          if (response.status === 'success') {
            resolve(response.data);
          } else {
            reject(new Error(response.message));
          }
        }
      };
    });
  }

  // 获取当前价格
  async getCurrentPrice(symbol: string): Promise<number> {
    return new Promise((resolve, reject) => {
      this.socket.send(JSON.stringify({
        type: 'price',
        symbol,
      }));

      const timeout = setTimeout(() => {
        reject(new Error('Price fetch timeout'));
      }, 5000);

      this.socket.onmessage = (event) => {
        const response = JSON.parse(event.data);
        if (response.type === 'price' && response.symbol === symbol) {
          clearTimeout(timeout);
          if (response.status === 'success') {
            resolve(response.price);
          } else {
            reject(new Error(response.message));
          }
        }
      };
    });
  }
} 