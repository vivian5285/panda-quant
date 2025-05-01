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
exports.executeStrategy = void 0;
const strategy_1 = require("../services/strategy");
const status_1 = require("../services/status");
const executeStrategy = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const request = req.body;
        const result = yield (0, strategy_1.executeStrategy)(request);
        // 异步更新策略状态
        (0, status_1.updateStrategyStatus)(result.executionId, result.status, result.result)
            .catch(error => console.error('Failed to update strategy status:', error));
        res.json(result);
    }
    catch (error) {
        console.error('Strategy execution failed:', error);
        res.status(500).json({
            executionId: req.body.strategyId,
            status: 'failed',
            error: '策略执行失败'
        });
    }
});
exports.executeStrategy = executeStrategy;
