import Web3 from 'web3';

export interface Strategy {
  _id: string;
  name: string;
  description: string;
  riskLevel: 'high' | 'medium' | 'low';
  active: boolean;
}

export class StrategyRunner {
  private web3: Web3;
  private account: string;

  constructor(web3: Web3, account: string) {
    this.web3 = web3;
    this.account = account;
  }

  async updateStrategy(id: string, data: Partial<Strategy>): Promise<void> {
    // TODO: Implement strategy update logic
    console.log('Updating strategy:', id, data);
  }
}

export function getExpectedMonthlyReturn(name: string, riskLevel: string): number {
  // TODO: Implement expected return calculation
  const baseReturns: Record<string, number> = {
    high: 15,
    medium: 8,
    low: 3
  };
  return baseReturns[riskLevel] || 0;
} 