import { BaseExchangeClient } from './BaseExchangeClient';
import { IExchangeCredentials, IExchangeBalance, IExchangeOrder, IExchangePosition, IExchangeTrade, IExchangeMarketData } from '../../types/Exchange';
export declare class BinanceClient extends BaseExchangeClient {
    private baseUrl;
    constructor(credentials: IExchangeCredentials, isTestnet?: boolean);
    private request;
    getBalance(): Promise<IExchangeBalance[]>;
    getOrder(orderId: string): Promise<IExchangeOrder>;
    getOrders(symbol?: string): Promise<IExchangeOrder[]>;
    createOrder(symbol: string, type: 'market' | 'limit', side: 'buy' | 'sell', amount: number, price?: number): Promise<IExchangeOrder>;
    cancelOrder(orderId: string): Promise<void>;
    cancelOrders(symbol?: string): Promise<void>;
    getPositions(symbol?: string): Promise<IExchangePosition[]>;
    getTrades(symbol?: string, startTime?: Date, endTime?: Date): Promise<IExchangeTrade[]>;
    getMarketData(symbol: string): Promise<IExchangeMarketData>;
    getMarketDataList(symbols: string[]): Promise<IExchangeMarketData[]>;
    getKlines(symbol: string, interval: string, startTime?: Date, endTime?: Date): Promise<any[]>;
    getSymbols(): Promise<string[]>;
    getLeverage(symbol: string): Promise<number>;
    setLeverage(symbol: string, leverage: number): Promise<void>;
    getFeeRate(symbol: string): Promise<number>;
    getAccountInfo(): Promise<any>;
    private parseOrder;
    private parsePosition;
    private parseTrade;
    private parseMarketData;
}
