"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const withdrawalController_1 = require("../controllers/withdrawalController");
const Auth_1 = require("../middleware/Auth");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
const withdrawalController = new withdrawalController_1.WithdrawalController();
// Admin routes
router.get('/admin/withdrawals', Auth_1.authenticate, Auth_1.isAdmin, async (req, res, next) => {
    try {
        await withdrawalController.getWithdrawals(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.get('/admin/withdrawals/stats', Auth_1.authenticate, Auth_1.isAdmin, async (req, res, next) => {
    try {
        await withdrawalController.getWithdrawals(req, res);
    }
    catch (error) {
        next(error);
    }
});
router.put('/admin/withdrawals/:id', Auth_1.authenticate, Auth_1.isAdmin, async (req, res, next) => {
    try {
        await withdrawalController.updateWithdrawal(req, res);
    }
    catch (error) {
        next(error);
    }
});
// User routes
router.get('/', authMiddleware_1.authMiddleware, async (req, res) => {
    await withdrawalController.getWithdrawals(req, res);
});
router.post('/', authMiddleware_1.authMiddleware, async (req, res) => {
    await withdrawalController.createWithdrawal(req, res);
});
router.get('/:id', authMiddleware_1.authMiddleware, async (req, res) => {
    await withdrawalController.getWithdrawals(req, res);
});
router.put('/:id/status', authMiddleware_1.authMiddleware, async (req, res) => {
    await withdrawalController.updateWithdrawal(req, res);
});
router.post('/:id/cancel', authMiddleware_1.authMiddleware, async (req, res) => {
    await withdrawalController.createWithdrawal(req, res);
});
exports.default = router;
//# sourceMappingURL=withdrawalRoutes.js.map