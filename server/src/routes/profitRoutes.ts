import express from 'express';
import type { Router } from 'express';
import type { Response } from 'express';
import { handleRequest } from '../utils/requestHandler';
import { ensureAuthenticated } from '../middleware/auth';
import type { AuthenticatedRequest } from '../types/express';
import { ProfitController } from '../controllers/ProfitController';

const router: Router = express.Router();
const profitController = new ProfitController();

// Protected routes
router.use(ensureAuthenticated);

// Get all profits
router.get('/', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await profitController.getProfits(req, res);
}));

// Get single profit
router.get('/:id', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await profitController.getProfitById(req, res);
}));

// Create profit
router.post('/', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await profitController.createProfit(req, res);
}));

// Update profit
router.put('/:id', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await profitController.updateProfit(req, res);
}));

// Delete profit
router.delete('/:id', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await profitController.deleteProfit(req, res);
}));

export default router; 