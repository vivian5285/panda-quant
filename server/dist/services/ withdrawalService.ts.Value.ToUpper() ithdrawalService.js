"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawalService = void 0;
const CommissionWithdrawal_1 = require("../models/CommissionWithdrawal");
class WithdrawalService {
    static getInstance() {
        if (!WithdrawalService.instance) {
            WithdrawalService.instance = new WithdrawalService();
        }
        return WithdrawalService.instance;
    }
    constructor() {
        this.model = CommissionWithdrawal_1.CommissionWithdrawal;
    }
    async createWithdrawal(data) {
        const withdrawal = new this.model(data);
        return await withdrawal.save();
    }
    async updateWithdrawal(id, data) {
        return await this.model.findByIdAndUpdate(id, data, { new: true });
    }
    async getWithdrawal(id) {
        return await this.model.findById(id);
    }
    async getAllWithdrawals() {
        return await this.model.find();
    }
    async deleteWithdrawal(id) {
        const result = await this.model.findByIdAndDelete(id);
        return !!result;
    }
    async getWithdrawals(userId) {
        return await this.model.find({ userId });
    }
    async getWithdrawalsByUser(userId) {
        return await this.model.find({ userId });
    }
    async getPendingWithdrawals() {
        return await this.model.find({ status: 'pending' });
    }
    async getCompletedWithdrawals() {
        return await this.model.find({ status: 'completed' });
    }
    async getWithdrawalStats(userId) {
        const stats = await this.model.aggregate([
            { $match: { userId } },
            {
                $group: {
                    _id: null,
                    totalAmount: { $sum: '$amount' },
                    pendingCount: {
                        $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] }
                    },
                    completedCount: {
                        $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                    },
                    rejectedCount: {
                        $sum: { $cond: [{ $eq: ['$status', 'rejected'] }, 1, 0] }
                    }
                }
            }
        ]);
        return stats[0] || {
            totalAmount: 0,
            pendingCount: 0,
            completedCount: 0,
            rejectedCount: 0
        };
    }
    async completeWithdrawal(id, transactionHash) {
        return await this.model.findByIdAndUpdate(id, {
            status: 'completed',
            transactionHash,
            updatedAt: new Date()
        }, { new: true });
    }
    async rejectWithdrawal(id) {
        return await this.model.findByIdAndUpdate(id, {
            status: 'rejected',
            updatedAt: new Date()
        }, { new: true });
    }
}
exports.WithdrawalService = WithdrawalService;
//# sourceMappingURL=%20withdrawalService.ts.Value.ToUpper()%20ithdrawalService.js.map