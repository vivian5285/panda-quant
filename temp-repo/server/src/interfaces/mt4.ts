export interface MT4Account {
  userId: string;
  accountId: string;
  server: string;
  login: string;
  password: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface MT4Position {
  ticket: number;
  symbol: string;
  type: 'buy' | 'sell';
  lots: number;
  openPrice: number;
  openTime: Date;
  closePrice?: number;
  closeTime?: Date;
  profit: number;
  swap: number;
  commission: number;
  stopLoss: number;
  takeProfit: number;
}

export interface MT4Order {
  ticket: number;
  symbol: string;
  type: 'buy' | 'sell';
  lots: number;
  price: number;
  stopLoss: number;
  takeProfit: number;
  comment: string;
  expiration: Date;
}

export interface MT4Balance {
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
  currency: string;
}

export interface MT4MarketData {
  symbol: string;
  bid: number;
  ask: number;
  last: number;
  volume: number;
  time: Date;
  digits: number;
  point: number;
  spread: number;
} 