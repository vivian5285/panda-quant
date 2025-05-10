import express from 'express';
import type { Router } from 'express';
import type { Response } from 'express';
import { handleRequest } from '../utils/requestHandler';
import { ensureAuthenticated } from '../middleware/ensureAuthenticated';
import type { AuthenticatedRequest } from '../types/express';
import { CommissionController } from '../controllers/CommissionController';
import { AuthRequest } from '../middleware/authMiddleware';
import { CommissionService } from '../services/CommissionService';
import { validateRequest, validateQuery } from '../validations/common';
import { ICommission } from '../types/Commission';
import Joi from 'joi';

const router: Router = express.Router();
const commissionController = new CommissionController();
const commissionService = CommissionService.getInstance();

// Protected routes
router.use(ensureAuthenticated);

// Get all user commissions
router.get('/all', handleRequest(async (req: AuthRequest, res: Response) => {
  await commissionController.getCommissionByUserId(req, res);
}));

// Get current user's commissions
router.get('/my', handleRequest(async (req: AuthRequest, res: Response) => {
  await commissionController.getCommissionByUserId(req, res);
}));

// 定义验证 schema
const commissionListSchema = Joi.object({
  page: Joi.number().min(1).default(1),
  limit: Joi.number().min(1).max(100).default(10),
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso().min(Joi.ref('startDate'))
});

const commissionIdSchema = Joi.object({
  id: Joi.string().required()
});

const commissionStatsSchema = Joi.object({
  startDate: Joi.date().iso(),
  endDate: Joi.date().iso().min(Joi.ref('startDate'))
});

// Get commission list
router.get('/', validateQuery(commissionListSchema), handleRequest<ICommission[]>(async (req: AuthenticatedRequest, res, next) => {
  const { page = 1, limit = 10, startDate, endDate } = req.query;
  return await commissionService.getCommissionsByUserAndDateRange(
    req.user._id.toString(),
    new Date(startDate as string),
    new Date(endDate as string)
  );
}));

// Get commission record
router.get('/:id', validateQuery(commissionIdSchema), handleRequest<ICommission | null>(async (req: AuthenticatedRequest, res, next) => {
  const { id } = req.params;
  return await commissionService.getCommissionById(id);
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

// Get commission stats
router.get('/stats/summary', validateQuery(commissionStatsSchema), handleRequest<ICommission[]>(async (req: AuthenticatedRequest, res, next) => {
  const { startDate, endDate } = req.query;
  return await commissionService.getCommissionsByUserAndDateRange(
    req.user._id.toString(),
    new Date(startDate as string),
    new Date(endDate as string)
  );
}));

export default router; 