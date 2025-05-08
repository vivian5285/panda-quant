import express, { Router } from 'express';
import type { Request, Response } from 'express';
import { handleRequest } from '../utils/requestHandler';
import { ensureAuthenticated } from '../middleware/ensureAuthenticated';
import { StrategyController } from '../controllers/StrategyController';
import type { AuthenticatedRequest } from '../types/express';

const router: Router = express.Router();
const strategyController = new StrategyController();

// All strategy routes require authentication
router.use(ensureAuthenticated);

// Get all strategies
router.get('/', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await strategyController.getAllStrategies(req, res);
}));

// Get strategy by ID
router.get('/:id', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await strategyController.getStrategy(req, res);
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

// Start strategy
router.post('/:id/start', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await strategyController.startStrategy(req, res);
}));

// Stop strategy
router.post('/:id/stop', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await strategyController.stopStrategy(req, res);
}));

// Pause strategy
router.post('/:id/pause', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await strategyController.pauseStrategy(req, res);
}));

// Resume strategy
router.post('/:id/resume', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await strategyController.resumeStrategy(req, res);
}));

export default router; 