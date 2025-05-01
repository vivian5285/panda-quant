/// <reference types="node" />
import { IMT4Account, IMT4Position, IMT4Order, IMT4Balance, IMT4MarketData } from '../../types/mt4';
import { EventEmitter } from 'events';
export declare class MT4Connector extends EventEmitter {
    private socket;
    private account;
    private reconnectAttempts;
    private maxReconnectAttempts;
    private reconnectInterval;
    private logger;
    constructor(account: IMT4Account);
    private setupSocket;
    private handleReconnect;
    connect(): Promise<void>;
    disconnect(): void;
    private sendLogin;
    private onData;
    private onError;
    private handleLoginResponse;
    private handlePosition;
    private handleOrder;
    private handleBalance;
    private handleMarketData;
    getPositions(): Promise<IMT4Position[]>;
    getOrders(): Promise<IMT4Order[]>;
    getBalance(): Promise<IMT4Balance>;
    getMarketData(symbol: string): Promise<IMT4MarketData>;
    createOrder(order: Omit<IMT4Order, 'ticket'>): Promise<IMT4Order>;
    closePosition(ticket: number): Promise<void>;
    modifyOrder(ticket: number, changes: Partial<IMT4Order>): Promise<void>;
}
