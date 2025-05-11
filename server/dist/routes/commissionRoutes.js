"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const requestHandler_1 = require("../utils/requestHandler");
const ensureAuthenticated_1 = require("../middleware/ensureAuthenticated");
const CommissionController_1 = require("../types/../controllers/CommissionController");
const CommissionService_1 = require("../types/../services/CommissionService");
const common_1 = require("../validations/common");
const joi_1 = __importDefault(require("joi"));
const router = express_1.default.Router();
const commissionController = new CommissionController_1.CommissionController();
const commissionService = CommissionService_1.CommissionService.getInstance();
// Protected routes
router.use(ensureAuthenticated_1.ensureAuthenticated);
// Get all user commissions
router.get('/all', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await commissionController.getCommissionByUserId(req, res);
}));
// Get current user's commissions
router.get('/my', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await commissionController.getCommissionByUserId(req, res);
}));
// 定义验证 schema
const commissionListSchema = joi_1.default.object({
    page: joi_1.default.number().min(1).default(1),
    limit: joi_1.default.number().min(1).max(100).default(10),
    startDate: joi_1.default.date().iso(),
    endDate: joi_1.default.date().iso().min(joi_1.default.ref('startDate'))
});
const commissionIdSchema = joi_1.default.object({
    id: joi_1.default.string().required()
});
const commissionStatsSchema = joi_1.default.object({
    startDate: joi_1.default.date().iso(),
    endDate: joi_1.default.date().iso().min(joi_1.default.ref('startDate'))
});
// Get commission list
router.get('/', (0, common_1.validateQuery)(commissionListSchema), (0, requestHandler_1.handleRequest)(async (req, res, next) => {
    const { page = 1, limit = 10, startDate, endDate } = req.query;
    return await commissionService.getCommissionsByUserAndDateRange(req.user._id.toString(), new Date(startDate), new Date(endDate));
}));
// Get commission record
router.get('/:id', (0, common_1.validateQuery)(commissionIdSchema), (0, requestHandler_1.handleRequest)(async (req, res, next) => {
    const { id } = req.params;
    return await commissionService.getCommissionById(id);
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
// Get commission stats
router.get('/stats/summary', (0, common_1.validateQuery)(commissionStatsSchema), (0, requestHandler_1.handleRequest)(async (req, res, next) => {
    const { startDate, endDate } = req.query;
    return await commissionService.getCommissionsByUserAndDateRange(req.user._id.toString(), new Date(startDate), new Date(endDate));
}));
exports.default = router;
//# sourceMappingURL=commissionRoutes.js.map