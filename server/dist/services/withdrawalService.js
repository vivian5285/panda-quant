"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawalService = void 0;
const Withdrawal_1 = require("../models/Withdrawal");
const logger_1 = require("../utils/logger");
class WithdrawalService {
    async createWithdrawal(data) {
        try {
            const withdrawal = new Withdrawal_1.Withdrawal({
                ...data,
                status: data.status || 'pending',
                metadata: data.metadata || {}
            });
            return await withdrawal.save();
        }
        catch (error) {
            logger_1.logger.error('Error creating withdrawal:', error);
            throw error;
        }
    }
    async getWithdrawals(userId) {
        try {
            return await Withdrawal_1.Withdrawal.find({ userId });
        }
        catch (error) {
            logger_1.logger.error('Error getting withdrawals:', error);
            throw error;
        }
    }
    async getWithdrawalById(id) {
        try {
            return await Withdrawal_1.Withdrawal.findById(id);
        }
        catch (error) {
            logger_1.logger.error('Error getting withdrawal:', error);
            throw error;
        }
    }
    async updateWithdrawal(id, data) {
        try {
            return await Withdrawal_1.Withdrawal.findByIdAndUpdate(id, data, { new: true });
        }
        catch (error) {
            logger_1.logger.error('Error updating withdrawal:', error);
            throw error;
        }
    }
    async deleteWithdrawal(id) {
        try {
            const result = await Withdrawal_1.Withdrawal.findByIdAndDelete(id);
            return result !== null;
        }
        catch (error) {
            logger_1.logger.error('Error deleting withdrawal:', error);
            throw error;
        }
    }
}
exports.WithdrawalService = WithdrawalService;
//# sourceMappingURL=WithdrawalService.js.map