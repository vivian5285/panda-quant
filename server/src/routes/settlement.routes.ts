import express from 'express';
import type { Router } from 'express';
import type { Response } from 'express';
import { handleRequest } from '../utils/requestHandler';
import { ensureAuthenticated } from '../middleware/ensureAuthenticated';
import type { AuthenticatedRequest } from '../types/Auth';
import { SettlementController } from '../types/../controllers/SettlementController';

const router: Router = express.Router();
const settlementController = new SettlementController();

// Protected routes
router.use(ensureAuthenticated);

// Get all settlements
router.get('/', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await settlementController.getSettlements(req, res);
}));

// Get single settlement
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

// Delete settlement
router.delete('/:id', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await settlementController.updateSettlement(req, res);
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