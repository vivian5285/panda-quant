"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const backtest_controller_1 = require("../controllers/backtest.controller");
const router = (0, express_1.Router)();
const backtestController = new backtest_controller_1.BacktestController();
router.post('/', backtestController.createBacktest.bind(backtestController));
router.get('/', backtestController.getBacktests.bind(backtestController));
router.get('/:id', backtestController.getBacktestById.bind(backtestController));
router.put('/:id', backtestController.updateBacktest.bind(backtestController));
router.delete('/:id', backtestController.deleteBacktest.bind(backtestController));
router.post('/:id/run', backtestController.runBacktest.bind(backtestController));
router.post('/:id/stop', backtestController.stopBacktest.bind(backtestController));
exports.default = router;
//# sourceMappingURL=backtest.js.map