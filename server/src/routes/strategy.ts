import express from 'express';
import type { Router } from 'express';
import type { Response } from 'express';
import { handleRequest } from '../utils/requestHandler';
import { ensureAuthenticated } from '../middleware/auth';
import type { AuthenticatedRequest } from '../types/express';
import { StrategyController } from '../controllers/StrategyController';

const router: Router = express.Router();
const strategyController = new StrategyController();

// Protected routes
router.use(ensureAuthenticated);

// Get all strategies
router.get('/', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await strategyController.getAllStrategies(req, res);
}));

// Get single strategy
router.get('/:id', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await strategyController.getStrategyById(req, res);
}));

// Create strategy
router.post('/', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await strategyController.createStrategy(req, res);
}));

// Update strategy
router.put('/:id', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await strategyController.updateStrategy(req, res);
}));

// Delete strategy
router.delete('/:id', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await strategyController.deleteStrategy(req, res);
}));

export default router; 