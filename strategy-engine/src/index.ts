import Web3 from 'web3';
import express from 'express';
import dotenv from 'dotenv';
import { StrategyRunner, Strategy } from './strategy';

// Load environment variables
dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Initialize Web3
const web3 = new Web3(`https://mainnet.infura.io/v3/${process.env.INFURA_KEY}`);
const account = process.env.ACCOUNT || '0x0000000000000000000000000000000000000000';

// Initialize Strategy Runner
const strategyRunner = new StrategyRunner(web3, account);

// Middleware
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Start server
app.listen(port, () => {
  console.log(`Strategy Engine running on port ${port}`);
});

export function getExpectedMonthlyReturn(name: string, riskLevel: string): number {
  // TODO: Implement expected return calculation
  const baseReturns: Record<string, number> = {
    high: 15,
    medium: 8,
    low: 3
  };
  return baseReturns[riskLevel] || 0;
} 