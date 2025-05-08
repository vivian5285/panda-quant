import express from 'express';
import type { Router } from 'express';
import type { Response } from 'express';
import { handleRequest } from '../utils/requestHandler';
import { ensureAuthenticated } from '../middleware/ensureAuthenticated';
import type { AuthenticatedRequest } from '../types/Auth';
import { CommissionController } from '../controllers/CommissionController';

const router: Router = express.Router();
const commissionController = new CommissionController();

// Protected routes
router.use(ensureAuthenticated);

// Get all user commissions
router.get('/all', handleRequest((req: AuthenticatedRequest, res: Response) => 
  commissionController.getCommissionByUserId(req, res)
));

// Get current user's commissions
router.get('/my', handleRequest((req: AuthenticatedRequest, res: Response) => 
  commissionController.getCommissionByUserId(req, res)
));

// Get commission list
router.get('/', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await commissionController.getCommissionById(req, res);
}));

// Get commission record
router.get('/:id', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await commissionController.getCommissionById(req, res);
}));

// Create commission record
router.post('/', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await commissionController.createCommission(req, res);
}));

// Update commission record
router.put('/:id', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await commissionController.updateCommission(req, res);
}));

// Delete commission record
router.delete('/:id', handleRequest(async (req: AuthenticatedRequest, res: Response) => {
  await commissionController.deleteCommission(req, res);
}));

// Get commission rules
router.get('/rules', handleRequest((req: AuthenticatedRequest, res: Response) => 
  commissionController.getCommissionRules(req, res)
));

// Create commission rule
router.post('/rules', handleRequest((req: AuthenticatedRequest, res: Response) => 
  commissionController.createCommissionRule(req, res)
));

// Update commission rule
router.put('/rules/:id', handleRequest((req: AuthenticatedRequest, res: Response) => 
  commissionController.updateCommissionRule(req, res)
));

// Delete commission rule
router.delete('/rules/:id', handleRequest((req: AuthenticatedRequest, res: Response) => 
  commissionController.deleteCommissionRule(req, res)
));

// Get commissions by type
router.get('/type/:type', handleRequest((req: AuthenticatedRequest, res: Response) => 
  commissionController.getCommissionsByType(req, res)
));

// Get commissions by status, type and amount
router.get('/filter/status-type-amount', handleRequest((req: AuthenticatedRequest, res: Response) => 
  commissionController.getCommissionsByStatusAndTypeAndAmount(req, res)
));

// Get commissions by status, type, amount and currency
router.get('/filter/status-type-amount-currency', handleRequest((req: AuthenticatedRequest, res: Response) => 
  commissionController.getCommissionsByStatusAndTypeAndAmountAndCurrency(req, res)
));

// Get commissions by user, status, type, amount and currency
router.get('/filter/user-status-type-amount-currency', handleRequest((req: AuthenticatedRequest, res: Response) => 
  commissionController.getCommissionsByUserAndStatusAndTypeAndAmountAndCurrency(req, res)
));

// Get commissions by status, type, amount, currency and description
router.get('/filter/status-type-amount-currency-description', handleRequest((req: AuthenticatedRequest, res: Response) => 
  commissionController.getCommissionsByStatusAndTypeAndAmountAndCurrencyAndDescription(req, res)
));

export default router; 