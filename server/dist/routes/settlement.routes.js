"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const requestHandler_1 = require("../utils/requestHandler");
const ensureAuthenticated_1 = require("../middleware/ensureAuthenticated");
const SettlementController_1 = require("../controllers/SettlementController");
const router = express_1.default.Router();
const settlementController = new SettlementController_1.SettlementController();
// Protected routes
router.use(ensureAuthenticated_1.ensureAuthenticated);
// Get all settlements
router.get('/', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await settlementController.getSettlements(req, res);
}));
// Get single settlement
router.get('/:id', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await settlementController.getSettlementDetails(req, res);
}));
// Create settlement
router.post('/', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await settlementController.createSettlement(req, res);
}));
// Update settlement status
router.put('/:id/status', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await settlementController.updateSettlementStatus(req, res);
}));
// Delete settlement
router.delete('/:id', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await settlementController.updateSettlement(req, res);
}));
// Export settlements
router.get('/export', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await settlementController.exportSettlements(req, res);
}));
// Generate settlements
router.post('/generate', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await settlementController.generateSettlements(req, res);
}));
// Process payment
router.post('/:id/process', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await settlementController.processPayment(req, res);
}));
exports.default = router;
//# sourceMappingURL=settlement.routes.js.map