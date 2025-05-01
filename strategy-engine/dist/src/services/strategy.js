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
const StrategyEngine_1 = require("../engine/StrategyEngine");
const uuid_1 = require("uuid");
const executeStrategy = (request) => __awaiter(void 0, void 0, void 0, function* () {
    const executionId = (0, uuid_1.v4)();
    try {
        const engine = new StrategyEngine_1.StrategyEngine();
        const strategyParams = {
            userId: request.userId,
            symbol: request.parameters.symbol,
            amount: request.parameters.amount,
            leverage: request.parameters.leverage,
            maxDrawdown: request.parameters.maxDrawdown
        };
        const result = yield engine.executeStrategy(request.strategyId, strategyParams);
        return {
            executionId,
            status: 'completed',
            result
        };
    }
    catch (error) {
        console.error('Strategy execution failed:', error);
        return {
            executionId,
            status: 'failed',
            error: error instanceof Error ? error.message : '未知错误'
        };
    }
});
exports.executeStrategy = executeStrategy;
