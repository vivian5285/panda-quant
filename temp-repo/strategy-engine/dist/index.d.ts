import Web3 from 'web3';
export interface Strategy {
    _id: string;
    name: string;
    description: string;
    riskLevel: 'high' | 'medium' | 'low';
    active: boolean;
}
export declare class StrategyRunner {
    private web3;
    private account;
    constructor(web3: Web3, account: string);
    updateStrategy(id: string, data: Partial<Strategy>): Promise<void>;
}
export declare function getExpectedMonthlyReturn(name: string, riskLevel: string): number;
