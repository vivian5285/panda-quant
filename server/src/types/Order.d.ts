export interface Order {
    _id: string;
    userId: string;
    strategyId: string;
    amount: number;
    status: string;
    createdAt: Date;
    updatedAt: Date;
} 