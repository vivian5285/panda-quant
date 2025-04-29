import axios from 'axios';

export interface StrategyExecutionRequest {
    strategyId: string;
    parameters: Record<string, any>;
}

export interface StrategyExecutionResponse {
    executionId: string;
    status: string;
    result?: any;
}

export interface IStrategy {
    id: string;
    name: string;
    description: string;
    parameters: Record<string, any>;
    createdAt: Date;
    updatedAt: Date;
}

const serverClient = axios.create({
    baseURL: process.env.SERVER_URL,
    timeout: 5000
});

export const getAllStrategies = async (): Promise<StrategyExecutionResponse[]> => {
    try {
        const response = await serverClient.get('/strategies');
        return response.data;
    } catch (error) {
        console.error('Error getting all strategies:', error);
        throw error;
    }
};

export const getStrategyDetails = async (executionId: string): Promise<StrategyExecutionResponse> => {
    try {
        const response = await serverClient.get(`/strategies/${executionId}`);
        return response.data;
    } catch (error) {
        console.error('Error getting strategy details:', error);
        throw error;
    }
};

export const updateStrategyStatus = async (executionId: string, status: string, result?: any): Promise<void> => {
    try {
        await serverClient.post('/strategies/status', {
            executionId,
            status,
            result
        });
    } catch (error) {
        console.error('Error updating strategy status:', error);
        throw error;
    }
};

export class StrategyService {
    private static instance: StrategyService;
    private constructor() {}

    public static getInstance(): StrategyService {
        if (!StrategyService.instance) {
            StrategyService.instance = new StrategyService();
        }
        return StrategyService.instance;
    }

    public async createStrategy(_strategy: IStrategy): Promise<void> {
        // Implementation
    }
} 