export interface IExchangeCredentials {
    apiKey: string;
    apiSecret: string;
    passphrase?: string;
}
export interface ExchangeAccount {
    userId: string;
    exchange: string;
    credentials: IExchangeCredentials;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export interface IExchangeBalance {
    asset: string;
    free: number;
    locked: number;
    total: number;
}
export interface IExchangeOrder {
    id: string;
    symbol: string;
    type: 'limit' | 'market' | 'stop' | 'stop_limit';
    side: 'buy' | 'sell';
    price?: number;
    amount: number;
    status: 'open' | 'closed' | 'canceled';
    filled: number;
    remaining: number;
    cost: number;
    timestamp: Date;
    createdAt: Date;
    updatedAt: Date;
}
export interface IExchangePosition {
    symbol: string;
    size: number;
    side: 'long' | 'short';
    entryPrice: number;
    markPrice: number;
    unrealizedPnl: number;
    liquidationPrice: number;
    leverage: number;
    marginType: 'isolated' | 'cross';
    timestamp: Date;
    amount: number;
    margin: number;
    realizedPnl: number;
}
export interface IExchangeTrade {
    id: string;
    symbol: string;
    orderId: string;
    price: number;
    amount: number;
    cost: number;
    fee: {
        cost: number;
        currency: string;
    };
    side: 'buy' | 'sell';
    timestamp: Date;
    feeCurrency: string;
}
export interface IExchangeMarketData {
    symbol: string;
    timestamp: Date;
    open: number;
    high: number;
    low: number;
    close: number;
    volume: number;
    quoteVolume: number;
    trades: number;
    bid: number;
    ask: number;
    last: number;
}
//# sourceMappingURL=Exchange.d.ts.map