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
exports.RiskManagementService = void 0;
const logger_1 = require("../utils/logger");
class RiskManagementService {
    constructor() {
        this.riskLimits = new Map();
        this.initializeRiskLimits();
    }
    static getInstance() {
        if (!RiskManagementService.instance) {
            RiskManagementService.instance = new RiskManagementService();
        }
        return RiskManagementService.instance;
    }
    initializeRiskLimits() {
        // 设置默认风险限制
        this.riskLimits.set('maxLeverage', 20);
        this.riskLimits.set('maxPositionSize', 0.1); // 10% of capital
        this.riskLimits.set('maxDrawdown', 0.1); // 10%
        this.riskLimits.set('maxDailyLoss', 0.05); // 5%
    }
    checkStrategyRisk(strategyId, params) {
        try {
            const maxLeverage = this.riskLimits.get('maxLeverage');
            const maxPositionSize = this.riskLimits.get('maxPositionSize');
            const maxDrawdown = this.riskLimits.get('maxDrawdown');
            const maxDailyLoss = this.riskLimits.get('maxDailyLoss');
            // 检查杠杆
            if (maxLeverage !== undefined && params.leverage > maxLeverage) {
                logger_1.logger.warn(`Strategy ${strategyId} exceeds max leverage limit`);
                return false;
            }
            // 检查仓位大小
            if (maxPositionSize !== undefined && params.positionSize > maxPositionSize) {
                logger_1.logger.warn(`Strategy ${strategyId} exceeds max position size limit`);
                return false;
            }
            // 检查回撤
            if (maxDrawdown !== undefined && params.maxDrawdown > maxDrawdown) {
                logger_1.logger.warn(`Strategy ${strategyId} exceeds max drawdown limit`);
                return false;
            }
            // 检查每日损失
            if (maxDailyLoss !== undefined && params.dailyLoss > maxDailyLoss) {
                logger_1.logger.warn(`Strategy ${strategyId} exceeds max daily loss limit`);
                return false;
            }
            return true;
        }
        catch (error) {
            logger_1.logger.error(`Error checking strategy risk: ${error}`);
            return false;
        }
    }
    updateRiskLimits(limits) {
        this.riskLimits = limits;
        logger_1.logger.info('Risk limits updated');
    }
    getRiskLimits() {
        return this.riskLimits;
    }
    checkRisk(userId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: Implement risk check logic
            return true;
        });
    }
}
exports.RiskManagementService = RiskManagementService;
