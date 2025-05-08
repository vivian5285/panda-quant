import express, { Router } from 'express';
import type { Request, Response } from 'express';
import { handleRequest } from '../utils/requestHandler';
import { ensureAuthenticated } from '../middleware/ensureAuthenticated';
import { adminMiddleware } from '../middleware/adminMiddleware';
import { SettlementController } from '../controllers/SettlementController';
import type { AuthenticatedRequest } from '../types/express';

const router: Router = express.Router();
const settlementController = new SettlementController();

// All settlement routes require authentication and admin privileges
router.use(ensureAuthenticated);
router.use(adminMiddleware);

// Get all settlements
router.get('/', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await settlementController.getSettlements(req, res);
}));

// Get settlement details
router.get('/:id', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await settlementController.getSettlementDetails(req, res);
}));

// Create settlement
router.post('/', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await settlementController.createSettlement(req, res);
}));

// Update settlement status
router.put('/:id/status', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await settlementController.updateSettlementStatus(req, res);
}));

// Update settlement
router.put('/:id', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await settlementController.updateSettlement(req, res);
}));

// Get settlement summary
router.get('/summary', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await settlementController.getSettlementSummary(req, res);
}));

// Export settlements
router.get('/export', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await settlementController.exportSettlements(req, res);
}));

// Generate settlements
router.post('/generate', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await settlementController.generateSettlements(req, res);
}));

// Process payment
router.post('/:id/process', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await settlementController.processPayment(req, res);
}));

export default router; 