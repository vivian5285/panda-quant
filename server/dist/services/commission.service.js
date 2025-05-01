"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionService = void 0;
const commission_1 = require("../models/commission");
const enums_1 = require("../types/enums");
class CommissionService {
    async createCommission(performance) {
        const commission = new commission_1.Commission({
            userId: performance.userId,
            strategyId: performance.strategyId,
            amount: performance.commissionAmount,
            status: enums_1.CommissionStatus.PENDING,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return await commission.save();
    }
    async getCommissions(userId) {
        return await commission_1.Commission.find({ userId });
    }
    async getCommission(id) {
        return await commission_1.Commission.findById(id);
    }
    async updateCommission(id, data) {
        return await commission_1.Commission.findByIdAndUpdate(id, { ...data, updatedAt: new Date() }, { new: true });
    }
    async deleteCommission(id) {
        const result = await commission_1.Commission.findByIdAndDelete(id);
        return result !== null;
    }
    async calculateCommission(userId, profit) {
        const commissionAmount = profit * 0.1; // 10% commission
        const commission = new commission_1.Commission({
            userId,
            amount: commissionAmount,
            status: enums_1.CommissionStatus.PENDING,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return await commission.save();
    }
}
exports.CommissionService = CommissionService;
//# sourceMappingURL=commission.service.js.map