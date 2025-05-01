"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionService = void 0;
const mongoose_1 = require("mongoose");
const Commission_1 = require("../models/Commission");
const User_1 = require("../models/User");
class CommissionService {
    constructor() {
        this.commissionModel = Commission_1.Commission;
        this.userModel = User_1.User;
    }
    static getInstance() {
        if (!CommissionService.instance) {
            CommissionService.instance = new CommissionService();
        }
        return CommissionService.instance;
    }
    async createCommission(data) {
        const commission = new this.commissionModel(data);
        return await commission.save();
    }
    async getCommissionById(id) {
        return await this.commissionModel.findById(id);
    }
    async updateCommission(id, data) {
        return await this.commissionModel.findByIdAndUpdate(id, data, { new: true });
    }
    async deleteCommission(id) {
        const result = await this.commissionModel.findByIdAndDelete(id);
        return !!result;
    }
    async getCommissionsByUserId(userId) {
        return await this.commissionModel.find({ userId });
    }
    async getCommissionStats(userId) {
        const stats = await this.commissionModel.aggregate([
            { $match: { userId: new mongoose_1.Types.ObjectId(userId) } },
            {
                $group: {
                    _id: null,
                    totalMembers: { $sum: 1 },
                    totalCommission: { $sum: '$amount' },
                    pendingCommission: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, '$amount', 0] } }
                }
            }
        ]);
        return stats[0] || { totalMembers: 0, totalCommission: 0, pendingCommission: 0 };
    }
    async getAllUserCommissions(page, limit) {
        const skip = (page - 1) * limit;
        const commissions = await this.commissionModel
            .find()
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        const total = await this.commissionModel.countDocuments();
        return { commissions, total };
    }
    async calculateCommission(userId, amount) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const commission = amount * 0.1; // 10% commission
        return commission;
    }
    async getTeamInfo(userId) {
        const teamMembers = await this.getTeamMembers(new mongoose_1.Types.ObjectId(userId));
        const stats = await this.getTeamStats(new mongoose_1.Types.ObjectId(userId));
        return {
            members: teamMembers,
            stats: {
                totalMembers: teamMembers.length,
                directMembers: teamMembers.filter(m => m.level === 1).length,
                totalCommission: stats.totalCommission,
                pendingCommission: stats.pendingCommission
            }
        };
    }
    async getCommissionRecords(userId, page, limit, status) {
        const skip = (page - 1) * limit;
        const query = { userId };
        if (status) {
            query.status = status;
        }
        const records = await this.commissionModel
            .find(query)
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });
        const total = await this.commissionModel.countDocuments(query);
        return { records, total };
    }
    async getCommissionTrend(userId, startDate, endDate) {
        const query = { userId };
        if (startDate && endDate) {
            query.createdAt = {
                $gte: new Date(startDate),
                $lte: new Date(endDate)
            };
        }
        return await this.commissionModel.aggregate([
            { $match: query },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    totalCommission: { $sum: '$amount' }
                }
            },
            { $sort: { _id: 1 } }
        ]);
    }
    async getTeamMembers(userId) {
        return await this.userModel.find({ referrer: userId });
    }
    async getTeamStats(userId) {
        const stats = await this.commissionModel.aggregate([
            { $match: { userId } },
            {
                $group: {
                    _id: null,
                    totalCommission: { $sum: '$amount' },
                    pendingCommission: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, '$amount', 0] } }
                }
            }
        ]);
        return stats[0] || { totalCommission: 0, pendingCommission: 0 };
    }
    async getUserCommissionRecords(userId) {
        return await this.commissionModel.find({ userId });
    }
    async getUserCommissionRecordsCount(userId) {
        return await this.commissionModel.countDocuments({ userId });
    }
    async getUsersWithCommission() {
        return await this.userModel.find({ hasCommission: true });
    }
    async getUsersWithCommissionCount() {
        return await this.userModel.countDocuments({ hasCommission: true });
    }
}
exports.CommissionService = CommissionService;
//# sourceMappingURL=commission.js.map