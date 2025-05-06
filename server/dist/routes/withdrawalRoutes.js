"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const withdrawalController_1 = require("../controllers/withdrawalController");
const Auth_1 = require("../middleware/Auth");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
const withdrawalController = new withdrawalController_1.WithdrawalController();
// Admin routes
router.get('/admin/withdrawals', Auth_1.authenticate, Auth_1.isAdmin, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield withdrawalController.getWithdrawals(req, res);
    }
    catch (error) {
        next(error);
    }
}));
router.get('/admin/withdrawals/stats', Auth_1.authenticate, Auth_1.isAdmin, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield withdrawalController.getWithdrawals(req, res);
    }
    catch (error) {
        next(error);
    }
}));
router.put('/admin/withdrawals/:id', Auth_1.authenticate, Auth_1.isAdmin, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield withdrawalController.updateWithdrawal(req, res);
    }
    catch (error) {
        next(error);
    }
}));
// User routes
router.get('/', authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield withdrawalController.getWithdrawals(req, res);
}));
router.post('/', authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield withdrawalController.createWithdrawal(req, res);
}));
router.get('/:id', authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield withdrawalController.getWithdrawals(req, res);
}));
router.put('/:id/status', authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield withdrawalController.updateWithdrawal(req, res);
}));
router.post('/:id/cancel', authMiddleware_1.authMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield withdrawalController.createWithdrawal(req, res);
}));
exports.default = router;
//# sourceMappingURL=withdrawalRoutes.js.map