export interface IStrategy {
    id: string;
    name: string;
    description: string;
    type: string;
    status: 'active' | 'inactive';
    profit: number;
    risk: number;
    expectedReturn: number;
    monthlyReturn: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface IStrategyInput {
    name: string;
    description: string;
    type: string;
    status?: 'active' | 'inactive';
    profit?: number;
    risk?: number;
} 