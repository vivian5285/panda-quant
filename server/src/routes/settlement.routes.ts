import { Router, Request, Response, NextFunction } from 'express';
import { authenticate, isAdmin } from '../middleware/auth';
import { SettlementController } from '../controllers/settlement.controller';
import { AuthenticatedRequest } from '../types/auth';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();
const settlementController = new SettlementController();

// Admin routes
router.get('/admin/settlements', authenticate, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await settlementController.getSettlements(req as AuthenticatedRequest, res, next);
  } catch (error) {
    next(error);
  }
});

router.post('/admin/settlements', authenticate, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await settlementController.createSettlement(req as AuthenticatedRequest, res, next);
  } catch (error) {
    next(error);
  }
});

router.put('/admin/settlements/:id/status', authenticate, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await settlementController.updateSettlementStatus(req as AuthenticatedRequest, res, next);
  } catch (error) {
    next(error);
  }
});

router.get('/admin/settlements/:id', authenticate, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await settlementController.getSettlements(req as AuthenticatedRequest, res, next);
  } catch (error) {
    next(error);
  }
});

router.get('/admin/settlements/export', authenticate, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await settlementController.exportSettlements(req as AuthenticatedRequest, res, next);
  } catch (error) {
    next(error);
  }
});

router.post('/admin/settlements/generate', authenticate, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await settlementController.generateSettlements(req as AuthenticatedRequest, res, next);
  } catch (error) {
    next(error);
  }
});

router.post('/admin/settlements/:id/process', authenticate, isAdmin, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await settlementController.updateSettlementStatus(req as AuthenticatedRequest, res, next);
  } catch (error) {
    next(error);
  }
});

// User routes
router.get('/', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await settlementController.getSettlements(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.get('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await settlementController.getSettlements(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post('/', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await settlementController.createSettlement(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.put('/:id/status', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await settlementController.updateSettlementStatus(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await settlementController.processPayment(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.get('/export', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await settlementController.exportSettlements(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post('/generate', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await settlementController.generateSettlements(req, res, next);
  } catch (error) {
    next(error);
  }
});

router.post('/:id/process', authenticateToken, async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    await settlementController.processPayment(req, res, next);
  } catch (error) {
    next(error);
  }
});

export default router; 