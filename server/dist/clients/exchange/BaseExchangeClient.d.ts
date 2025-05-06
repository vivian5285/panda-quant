import { IExchangeCredentials, IExchangeBalance, IExchangeOrder, IExchangePosition, IExchangeTrade, IExchangeMarketData } from '../../types/Exchange';
export declare abstract class BaseExchangeClient {
    protected credentials: IExchangeCredentials;
    protected exchange: string;
    constructor(exchange: string, credentials: IExchangeCredentials);
    abstract getBalance(): Promise<IExchangeBalance[]>;
    abstract getOrder(orderId: string): Promise<IExchangeOrder>;
    abstract getOrders(symbol?: string): Promise<IExchangeOrder[]>;
    abstract createOrder(symbol: string, type: 'market' | 'limit', side: 'buy' | 'sell', amount: number, price?: number): Promise<IExchangeOrder>;
    abstract cancelOrder(orderId: string): Promise<void>;
    abstract cancelOrders(symbol?: string): Promise<void>;
    abstract getPositions(symbol?: string): Promise<IExchangePosition[]>;
    abstract getTrades(symbol?: string, startTime?: Date, endTime?: Date): Promise<IExchangeTrade[]>;
    abstract getMarketData(symbol: string): Promise<IExchangeMarketData>;
    abstract getMarketDataList(symbols: string[]): Promise<IExchangeMarketData[]>;
    abstract getKlines(symbol: string, interval: string, startTime?: Date, endTime?: Date): Promise<any[]>;
    abstract getSymbols(): Promise<string[]>;
    abstract getLeverage(symbol: string): Promise<number>;
    abstract setLeverage(symbol: string, leverage: number): Promise<void>;
    abstract getFeeRate(symbol: string): Promise<number>;
}
