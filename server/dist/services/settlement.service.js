"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettlementService = void 0;
const mongoose_1 = require("mongoose");
const Settlement_1 = __importDefault(require("../models/Settlement"));
const logger_1 = require("../utils/logger");
const settlement_1 = require("../types/settlement");
class SettlementService {
    constructor() { }
    static getInstance() {
        if (!SettlementService.instance) {
            SettlementService.instance = new SettlementService();
        }
        return SettlementService.instance;
    }
    async createSettlement(userId, amount, type, metadata) {
        try {
            const settlement = new Settlement_1.default({
                userId: new mongoose_1.Types.ObjectId(userId),
                amount,
                type,
                status: settlement_1.SettlementStatus.PENDING,
                metadata
            });
            const savedSettlement = await settlement.save();
            return savedSettlement;
        }
        catch (error) {
            logger_1.logger.error('Error creating settlement:', error);
            throw error;
        }
    }
    async updateSettlementStatus(id, status) {
        try {
            const settlement = await Settlement_1.default.findByIdAndUpdate(id, { $set: { status } }, { new: true });
            return settlement;
        }
        catch (error) {
            logger_1.logger.error('Error updating settlement status:', error);
            throw error;
        }
    }
    async getSettlementById(id) {
        try {
            const settlement = await Settlement_1.default.findById(id);
            return settlement;
        }
        catch (error) {
            logger_1.logger.error('Error getting settlement by id:', error);
            throw error;
        }
    }
}
exports.SettlementService = SettlementService;
//# sourceMappingURL=settlement.service.js.map