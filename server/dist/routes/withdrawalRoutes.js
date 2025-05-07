"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const requestHandler_1 = require("../utils/requestHandler");
const ensureAuthenticated_1 = require("../middleware/ensureAuthenticated");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const WithdrawalController_1 = require("../controllers/WithdrawalController");
const router = express_1.default.Router();
const withdrawalController = new WithdrawalController_1.WithdrawalController();
// Admin routes
router.get('/admin/withdrawals', ensureAuthenticated_1.ensureAuthenticated, adminMiddleware_1.adminMiddleware, (0, requestHandler_1.handleRequest)(async (req, res) => {
    await withdrawalController.getWithdrawals(req, res);
}));
router.get('/admin/withdrawals/stats', ensureAuthenticated_1.ensureAuthenticated, adminMiddleware_1.adminMiddleware, (0, requestHandler_1.handleRequest)(async (req, res) => {
    await withdrawalController.getWithdrawals(req, res);
}));
router.put('/admin/withdrawals/:id', ensureAuthenticated_1.ensureAuthenticated, adminMiddleware_1.adminMiddleware, (0, requestHandler_1.handleRequest)(async (req, res) => {
    await withdrawalController.updateWithdrawal(req, res);
}));
// User routes
router.get('/', ensureAuthenticated_1.ensureAuthenticated, (0, requestHandler_1.handleRequest)(async (req, res) => {
    await withdrawalController.getWithdrawals(req, res);
}));
router.post('/', ensureAuthenticated_1.ensureAuthenticated, (0, requestHandler_1.handleRequest)(async (req, res) => {
    await withdrawalController.createWithdrawal(req, res);
}));
router.get('/:id', ensureAuthenticated_1.ensureAuthenticated, (0, requestHandler_1.handleRequest)(async (req, res) => {
    await withdrawalController.getWithdrawalById(req, res);
}));
router.put('/:id', ensureAuthenticated_1.ensureAuthenticated, (0, requestHandler_1.handleRequest)(async (req, res) => {
    await withdrawalController.updateWithdrawal(req, res);
}));
router.delete('/:id', ensureAuthenticated_1.ensureAuthenticated, (0, requestHandler_1.handleRequest)(async (req, res) => {
    await withdrawalController.deleteWithdrawal(req, res);
}));
exports.default = router;
//# sourceMappingURL=withdrawalRoutes.js.map