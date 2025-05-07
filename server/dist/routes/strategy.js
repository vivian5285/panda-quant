"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const requestHandler_1 = require("../utils/requestHandler");
const auth_1 = require("../middleware/auth");
const StrategyController_1 = require("../controllers/StrategyController");
const router = express_1.default.Router();
const strategyController = new StrategyController_1.StrategyController();
// Protected routes
router.use(auth_1.ensureAuthenticated);
// Get all strategies
router.get('/', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await strategyController.getAllStrategies(req, res);
}));
// Get single strategy
router.get('/:id', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await strategyController.getStrategyById(req, res);
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
exports.default = router;
//# sourceMappingURL=Strategy.js.map