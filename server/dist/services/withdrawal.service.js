"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawalService = void 0;
const withdrawal_model_1 = require("../models/withdrawal.model");
const logger_1 = require("../utils/logger");
class WithdrawalService {
    constructor() { }
    static getInstance() {
        if (!WithdrawalService.instance) {
            WithdrawalService.instance = new WithdrawalService();
        }
        return WithdrawalService.instance;
    }
    convertToIWithdrawal(withdrawal) {
        const withdrawalObject = withdrawal.toObject();
        return {
            ...withdrawalObject,
            _id: withdrawalObject._id.toString(),
            userId: withdrawalObject.userId.toString(),
            status: withdrawalObject.status
        };
    }
    async createWithdrawal(withdrawalData) {
        try {
            const withdrawal = new withdrawal_model_1.Withdrawal(withdrawalData);
            const savedWithdrawal = await withdrawal.save();
            return this.convertToIWithdrawal(savedWithdrawal);
        }
        catch (error) {
            logger_1.logger.error('Error creating withdrawal:', error);
            throw error;
        }
    }
    async getWithdrawalById(id) {
        try {
            const withdrawal = await withdrawal_model_1.Withdrawal.findById(id);
            return withdrawal ? this.convertToIWithdrawal(withdrawal) : null;
        }
        catch (error) {
            logger_1.logger.error('Error getting withdrawal:', error);
            throw error;
        }
    }
    async getWithdrawalByUserId(userId) {
        try {
            const withdrawal = await withdrawal_model_1.Withdrawal.findOne({ userId });
            return withdrawal ? this.convertToIWithdrawal(withdrawal) : null;
        }
        catch (error) {
            logger_1.logger.error('Error getting withdrawal by user id:', error);
            throw error;
        }
    }
    async getWithdrawalsByUserId(userId) {
        try {
            const withdrawals = await withdrawal_model_1.Withdrawal.find({ userId });
            return withdrawals.map(withdrawal => this.convertToIWithdrawal(withdrawal));
        }
        catch (error) {
            logger_1.logger.error('Error getting withdrawals by user id:', error);
            throw error;
        }
    }
    async updateWithdrawal(id, data) {
        try {
            const withdrawal = await withdrawal_model_1.Withdrawal.findByIdAndUpdate(id, data, { new: true });
            return withdrawal ? this.convertToIWithdrawal(withdrawal) : null;
        }
        catch (error) {
            logger_1.logger.error('Error updating withdrawal:', error);
            throw error;
        }
    }
    async deleteWithdrawal(id) {
        try {
            const result = await withdrawal_model_1.Withdrawal.findByIdAndDelete(id);
            return result !== null;
        }
        catch (error) {
            logger_1.logger.error('Error deleting withdrawal:', error);
            throw error;
        }
    }
}
exports.WithdrawalService = WithdrawalService;
//# sourceMappingURL=withdrawal.service.js.map