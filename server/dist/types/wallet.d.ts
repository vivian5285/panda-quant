import { ITransaction } from './Transaction';
export interface Wallet {
    userId: string;
    currency: string;
    balance: number;
    frozen: number;
    available: number;
    createdAt: Date;
    updatedAt: Date;
}
export interface Deposit {
    id: string;
    userId: string;
    currency: string;
    amount: number;
    txHash: string;
    status: 'pending' | 'completed' | 'failed';
    createdAt: Date;
    updatedAt: Date;
}
export interface Withdrawal {
    id: string;
    userId: string;
    currency: string;
    amount: number;
    address: string;
    txHash?: string;
    status: 'pending' | 'processing' | 'completed' | 'failed';
    createdAt: Date;
    updatedAt: Date;
}
export interface Transfer {
    id: string;
    fromUserId: string;
    toUserId: string;
    currency: string;
    amount: number;
    fee: number;
    status: 'pending' | 'completed' | 'failed';
    createdAt: Date;
    updatedAt: Date;
}
export { ITransaction };
