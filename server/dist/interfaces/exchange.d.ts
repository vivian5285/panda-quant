export interface ExchangeCredentials {
    apiKey: string;
    apiSecret: string;
    passphrase?: string;
}
export interface ExchangeAccount {
    userId: string;
    exchange: string;
    credentials: ExchangeCredentials;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface ExchangeBalance {
    currency: string;
    available: number;
    frozen: number;
    total: number;
}
export interface ExchangeOrder {
    id: string;
    symbol: string;
    type: 'market' | 'limit';
    side: 'buy' | 'sell';
    price: number;
    amount: number;
    status: 'open' | 'closed' | 'canceled';
    createdAt: Date;
    updatedAt: Date;
}
export interface ExchangePosition {
    symbol: string;
    side: 'long' | 'short';
    amount: number;
    entryPrice: number;
    leverage: number;
    liquidationPrice: number;
    margin: number;
    unrealizedPnl: number;
    realizedPnl: number;
}
export interface ExchangeTrade {
    id: string;
    symbol: string;
    side: 'buy' | 'sell';
    price: number;
    amount: number;
    fee: number;
    feeCurrency: string;
    timestamp: Date;
}
export interface ExchangeMarketData {
    symbol: string;
    bid: number;
    ask: number;
    last: number;
    volume: number;
    timestamp: Date;
}
