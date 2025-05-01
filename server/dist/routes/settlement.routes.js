"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const settlement_controller_1 = require("../controllers/settlement.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
const settlementController = new settlement_controller_1.SettlementController();
// Admin routes
router.get('/admin/settlements', auth_1.authenticate, auth_1.isAdmin, async (req, res, next) => {
    try {
        await settlementController.getSettlements(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
router.post('/admin/settlements', auth_1.authenticate, auth_1.isAdmin, async (req, res, next) => {
    try {
        await settlementController.createSettlement(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
router.put('/admin/settlements/:id/status', auth_1.authenticate, auth_1.isAdmin, async (req, res, next) => {
    try {
        await settlementController.updateSettlementStatus(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
router.get('/admin/settlements/:id', auth_1.authenticate, auth_1.isAdmin, async (req, res, next) => {
    try {
        await settlementController.getSettlements(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
router.get('/admin/settlements/export', auth_1.authenticate, auth_1.isAdmin, async (req, res, next) => {
    try {
        await settlementController.exportSettlements(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
router.post('/admin/settlements/generate', auth_1.authenticate, auth_1.isAdmin, async (req, res, next) => {
    try {
        await settlementController.generateSettlements(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
router.post('/admin/settlements/:id/process', auth_1.authenticate, auth_1.isAdmin, async (req, res, next) => {
    try {
        await settlementController.updateSettlementStatus(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
// User routes
router.get('/', auth_middleware_1.authenticateToken, async (req, res, next) => {
    try {
        await settlementController.getSettlements(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
router.get('/:id', auth_middleware_1.authenticateToken, async (req, res, next) => {
    try {
        await settlementController.getSettlements(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
router.post('/', auth_middleware_1.authenticateToken, async (req, res, next) => {
    try {
        await settlementController.createSettlement(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
router.put('/:id/status', auth_middleware_1.authenticateToken, async (req, res, next) => {
    try {
        await settlementController.updateSettlementStatus(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
router.delete('/:id', auth_middleware_1.authenticateToken, async (req, res, next) => {
    try {
        await settlementController.processPayment(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
router.get('/export', auth_middleware_1.authenticateToken, async (req, res, next) => {
    try {
        await settlementController.exportSettlements(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
router.post('/generate', auth_middleware_1.authenticateToken, async (req, res, next) => {
    try {
        await settlementController.generateSettlements(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
router.post('/:id/process', auth_middleware_1.authenticateToken, async (req, res, next) => {
    try {
        await settlementController.processPayment(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=settlement.routes.js.map