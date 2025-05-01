"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const strategy_controller_1 = require("../controllers/strategy.controller");
const router = (0, express_1.Router)();
const strategyController = new strategy_controller_1.StrategyController();
router.post('/', strategyController.createStrategy.bind(strategyController));
router.get('/', strategyController.getStrategies.bind(strategyController));
router.get('/:id', strategyController.getStrategyById.bind(strategyController));
router.put('/:id', strategyController.updateStrategy.bind(strategyController));
router.delete('/:id', strategyController.deleteStrategy.bind(strategyController));
router.post('/:id/run', strategyController.runStrategy.bind(strategyController));
router.post('/:id/stop', strategyController.stopStrategy.bind(strategyController));
exports.default = router;
//# sourceMappingURL=strategy.js.map