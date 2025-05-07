export interface IMT4Account {
    id: string;
    login: number;
    password: string;
    server: string;
    balance: number;
    equity: number;
    margin: number;
    freeMargin: number;
    marginLevel: number;
    leverage: number;
    currency: string;
    timestamp: Date;
}
export interface IMT4Position {
    ticket: number;
    symbol: string;
    type: 'buy' | 'sell';
    volume: number;
    openPrice: number;
    currentPrice: number;
    stopLoss: number;
    takeProfit: number;
    swap: number;
    profit: number;
    openTime: Date;
    closeTime?: Date;
}
export interface IMT4Order {
    ticket: number;
    symbol: string;
    type: 'buy' | 'sell' | 'buy_limit' | 'sell_limit' | 'buy_stop' | 'sell_stop';
    volume: number;
    price: number;
    stopLoss: number;
    takeProfit: number;
    openTime: Date;
    closeTime?: Date;
    status: 'open' | 'closed' | 'canceled';
}
export interface IMT4Balance {
    balance: number;
    equity: number;
    margin: number;
    freeMargin: number;
    marginLevel: number;
    timestamp: Date;
}
export interface IMT4MarketData {
    symbol: string;
    bid: number;
    ask: number;
    high: number;
    low: number;
    time: Date;
    volume: number;
    spread: number;
}
//# sourceMappingURL=Mt4.d.ts.map