"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const requestHandler_1 = require("../utils/requestHandler");
const ensureAuthenticated_1 = require("../middleware/ensureAuthenticated");
const CommissionController_1 = require("../controllers/CommissionController");
const router = express_1.default.Router();
const commissionController = new CommissionController_1.CommissionController();
// Protected routes
router.use(ensureAuthenticated_1.ensureAuthenticated);
// Get all user commissions
router.get('/all', (0, requestHandler_1.handleRequest)((req, res) => commissionController.getCommissionByUserId(req, res)));
// Get current user's commissions
router.get('/my', (0, requestHandler_1.handleRequest)((req, res) => commissionController.getCommissionByUserId(req, res)));
// Get commission list
router.get('/', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await commissionController.getCommissionById(req, res);
}));
// Get commission record
router.get('/:id', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await commissionController.getCommissionById(req, res);
}));
// Create commission record
router.post('/', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await commissionController.createCommission(req, res);
}));
// Update commission record
router.put('/:id', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await commissionController.updateCommission(req, res);
}));
// Delete commission record
router.delete('/:id', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await commissionController.deleteCommission(req, res);
}));
// Get commission rules
router.get('/rules', (0, requestHandler_1.handleRequest)((req, res) => commissionController.getCommissionRules(req, res)));
// Create commission rule
router.post('/rules', (0, requestHandler_1.handleRequest)((req, res) => commissionController.createCommissionRule(req, res)));
// Update commission rule
router.put('/rules/:id', (0, requestHandler_1.handleRequest)((req, res) => commissionController.updateCommissionRule(req, res)));
// Delete commission rule
router.delete('/rules/:id', (0, requestHandler_1.handleRequest)((req, res) => commissionController.deleteCommissionRule(req, res)));
// Get commissions by type
router.get('/type/:type', (0, requestHandler_1.handleRequest)((req, res) => commissionController.getCommissionsByType(req, res)));
// Get commissions by status, type and amount
router.get('/filter/status-type-amount', (0, requestHandler_1.handleRequest)((req, res) => commissionController.getCommissionsByStatusAndTypeAndAmount(req, res)));
// Get commissions by status, type, amount and currency
router.get('/filter/status-type-amount-currency', (0, requestHandler_1.handleRequest)((req, res) => commissionController.getCommissionsByStatusAndTypeAndAmountAndCurrency(req, res)));
// Get commissions by user, status, type, amount and currency
router.get('/filter/user-status-type-amount-currency', (0, requestHandler_1.handleRequest)((req, res) => commissionController.getCommissionsByUserAndStatusAndTypeAndAmountAndCurrency(req, res)));
// Get commissions by status, type, amount, currency and description
router.get('/filter/status-type-amount-currency-description', (0, requestHandler_1.handleRequest)((req, res) => commissionController.getCommissionsByStatusAndTypeAndAmountAndCurrencyAndDescription(req, res)));
exports.default = router;
//# sourceMappingURL=commissionRoutes.js.map