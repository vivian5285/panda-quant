"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawalService = void 0;
const Withdrawal_1 = require("../models/Withdrawal");
const logger_1 = require("../utils/logger");
class WithdrawalService {
    constructor() { }
    static getInstance() {
        if (!WithdrawalService.instance) {
            WithdrawalService.instance = new WithdrawalService();
        }
        return WithdrawalService.instance;
    }
    async createWithdrawal(data) {
        try {
            const withdrawal = new Withdrawal_1.Withdrawal(data);
            const savedWithdrawal = await withdrawal.save();
            return savedWithdrawal.toObject();
        }
        catch (error) {
            logger_1.logger.error('Error creating withdrawal:', error);
            throw error;
        }
    }
    async getWithdrawalById(id) {
        try {
            const withdrawal = await Withdrawal_1.Withdrawal.findById(id);
            return withdrawal ? withdrawal.toObject() : null;
        }
        catch (error) {
            logger_1.logger.error('Error getting withdrawal:', error);
            throw error;
        }
    }
    async updateWithdrawal(id, data) {
        try {
            const withdrawal = await Withdrawal_1.Withdrawal.findByIdAndUpdate(id, data, { new: true });
            return withdrawal ? withdrawal.toObject() : null;
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
    async getWithdrawalsByUserId(userId) {
        try {
            const withdrawals = await Withdrawal_1.Withdrawal.find({ userId });
            return withdrawals.map(withdrawal => withdrawal.toObject());
        }
        catch (error) {
            logger_1.logger.error('Error getting withdrawals by user:', error);
            throw error;
        }
    }
}
exports.WithdrawalService = WithdrawalService;
//# sourceMappingURL=WithdrawalService.js.map