import { Router } from 'express';
import { authenticate, isAdmin } from '../middleware/Auth';
import { SettlementController } from '../controllers/settlement.controller';
import { authenticateToken } from '../middleware/auth.middleware';
const router = Router();
const settlementController = new SettlementController();
// Admin routes
router.get('/admin/settlements', authenticate, isAdmin, async (req, res, next) => {
    try {
        await settlementController.getSettlements(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
router.post('/admin/settlements', authenticate, isAdmin, async (req, res, next) => {
    try {
        await settlementController.createSettlement(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
router.put('/admin/settlements/:id/status', authenticate, isAdmin, async (req, res, next) => {
    try {
        await settlementController.updateSettlementStatus(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
router.get('/admin/settlements/:id', authenticate, isAdmin, async (req, res, next) => {
    try {
        await settlementController.getSettlements(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
router.get('/admin/settlements/export', authenticate, isAdmin, async (req, res, next) => {
    try {
        await settlementController.exportSettlements(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
router.post('/admin/settlements/generate', authenticate, isAdmin, async (req, res, next) => {
    try {
        await settlementController.generateSettlements(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
router.post('/admin/settlements/:id/process', authenticate, isAdmin, async (req, res, next) => {
    try {
        await settlementController.updateSettlementStatus(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
// User routes
router.get('/', authenticateToken, async (req, res, next) => {
    try {
        await settlementController.getSettlements(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
router.get('/:id', authenticateToken, async (req, res, next) => {
    try {
        await settlementController.getSettlements(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
router.post('/', authenticateToken, async (req, res, next) => {
    try {
        await settlementController.createSettlement(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
router.put('/:id/status', authenticateToken, async (req, res, next) => {
    try {
        await settlementController.updateSettlementStatus(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
router.delete('/:id', authenticateToken, async (req, res, next) => {
    try {
        await settlementController.processPayment(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
router.get('/export', authenticateToken, async (req, res, next) => {
    try {
        await settlementController.exportSettlements(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
router.post('/generate', authenticateToken, async (req, res, next) => {
    try {
        await settlementController.generateSettlements(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
router.post('/:id/process', authenticateToken, async (req, res, next) => {
    try {
        await settlementController.processPayment(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
export default router;
//# sourceMappingURL=Settlement.js.map