"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const requestHandler_1 = require("../utils/requestHandler");
const ensureAuthenticated_1 = require("../middleware/ensureAuthenticated");
const StrategyController_1 = require("../controllers/StrategyController");
const router = express_1.default.Router();
const strategyController = new StrategyController_1.StrategyController();
// All strategy routes require authentication
router.use(ensureAuthenticated_1.ensureAuthenticated);
// Get all strategies
router.get('/', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await strategyController.getAllStrategies(req, res);
}));
// Get strategy by ID
router.get('/:id', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await strategyController.getStrategy(req, res);
}));
// Create strategy
router.post('/', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await strategyController.createStrategy(req, res);
}));
// Update strategy
router.put('/:id', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await strategyController.updateStrategy(req, res);
}));
// Delete strategy
router.delete('/:id', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await strategyController.deleteStrategy(req, res);
}));
// Start strategy
router.post('/:id/start', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await strategyController.startStrategy(req, res);
}));
// Stop strategy
router.post('/:id/stop', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await strategyController.stopStrategy(req, res);
}));
// Pause strategy
router.post('/:id/pause', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await strategyController.pauseStrategy(req, res);
}));
// Resume strategy
router.post('/:id/resume', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await strategyController.resumeStrategy(req, res);
}));
exports.default = router;
//# sourceMappingURL=Strategy.js.map