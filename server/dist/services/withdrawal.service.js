"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawalService = void 0;
const mongoose_1 = require("mongoose");
const Withdrawal_1 = require("../models/Withdrawal");
const enums_1 = require("../types/enums");
const logger_1 = require("../utils/logger");
class WithdrawalService {
    constructor() {
        this.withdrawalModel = Withdrawal_1.Withdrawal;
    }
    async createWithdrawal(data) {
        try {
            const withdrawal = new this.withdrawalModel({
                ...data,
                status: data.status || enums_1.WithdrawalStatus.PENDING,
                userId: new mongoose_1.Types.ObjectId(data.userId)
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
            return await this.withdrawalModel.find({ userId: new mongoose_1.Types.ObjectId(userId) });
        }
        catch (error) {
            logger_1.logger.error('Error getting withdrawals:', error);
            throw error;
        }
    }
    async getWithdrawal(id, userId) {
        try {
            return await this.withdrawalModel.findOne({
                _id: new mongoose_1.Types.ObjectId(id),
                userId: new mongoose_1.Types.ObjectId(userId)
            });
        }
        catch (error) {
            logger_1.logger.error('Error getting withdrawal:', error);
            throw error;
        }
    }
    async updateWithdrawal(id, userId, data) {
        try {
            return await this.withdrawalModel.findOneAndUpdate({ _id: new mongoose_1.Types.ObjectId(id), userId: new mongoose_1.Types.ObjectId(userId) }, { $set: data }, { new: true });
        }
        catch (error) {
            logger_1.logger.error('Error updating withdrawal:', error);
            throw error;
        }
    }
    async deleteWithdrawal(id, userId) {
        try {
            return await this.withdrawalModel.findOneAndDelete({
                _id: new mongoose_1.Types.ObjectId(id),
                userId: new mongoose_1.Types.ObjectId(userId)
            });
        }
        catch (error) {
            logger_1.logger.error('Error deleting withdrawal:', error);
            throw error;
        }
    }
    async getWithdrawalsByStatus(userId, status) {
        try {
            return await this.withdrawalModel.find({
                userId: new mongoose_1.Types.ObjectId(userId),
                status
            });
        }
        catch (error) {
            logger_1.logger.error('Error getting withdrawals by status:', error);
            throw error;
        }
    }
    async getWithdrawalsByPaymentMethod(userId, paymentMethod) {
        try {
            return await this.withdrawalModel.find({
                userId: new mongoose_1.Types.ObjectId(userId),
                paymentMethod
            });
        }
        catch (error) {
            logger_1.logger.error('Error getting withdrawals by payment method:', error);
            throw error;
        }
    }
    async getWithdrawalStats(userId) {
        try {
            const stats = await this.withdrawalModel.aggregate([
                { $match: { userId: new mongoose_1.Types.ObjectId(userId) } },
                {
                    $group: {
                        _id: null,
                        totalWithdrawals: { $sum: 1 },
                        totalAmount: { $sum: '$amount' },
                        pendingWithdrawals: {
                            $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
                        }
                    }
                }
            ]);
            return stats[0] || {
                totalWithdrawals: 0,
                totalAmount: 0,
                pendingWithdrawals: 0
            };
        }
        catch (error) {
            logger_1.logger.error('Error getting withdrawal stats:', error);
            throw error;
        }
    }
    async cancelWithdrawal(data) {
        try {
            return await this.withdrawalModel.findByIdAndUpdate(data._id, { status: data.status }, { new: true });
        }
        catch (error) {
            logger_1.logger.error('Error cancelling withdrawal:', error);
            throw error;
        }
    }
}
exports.WithdrawalService = WithdrawalService;
//# sourceMappingURL=withdrawal.service.js.map