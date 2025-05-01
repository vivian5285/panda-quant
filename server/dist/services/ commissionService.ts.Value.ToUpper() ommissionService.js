"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionService = void 0;
const mongoose_1 = require("mongoose");
const Commission_1 = require("../models/Commission");
const User_1 = require("../models/User");
const logger_1 = require("../utils/logger");
const AppError_1 = require("../utils/AppError");
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
        try {
            const commission = new this.commissionModel({
                ...data,
                userId: new mongoose_1.Types.ObjectId(data.userId),
                type: data.type || 'trading'
            });
            return await commission.save();
        }
        catch (error) {
            logger_1.logger.error('Error creating commission:', error);
            throw error;
        }
    }
    async getCommissionById(id) {
        try {
            return await this.commissionModel.findById(id).exec();
        }
        catch (error) {
            logger_1.logger.error('Error getting commission:', error);
            throw error;
        }
    }
    async updateCommission(id, updateData) {
        try {
            return await this.commissionModel.findByIdAndUpdate(id, { ...updateData, updatedAt: new Date() }, { new: true }).exec();
        }
        catch (error) {
            logger_1.logger.error('Error updating commission:', error);
            throw error;
        }
    }
    async deleteCommission(id) {
        try {
            const result = await this.commissionModel.findByIdAndDelete(id).exec();
            return result !== null;
        }
        catch (error) {
            logger_1.logger.error('Error deleting commission:', error);
            throw error;
        }
    }
    async getUserCommissions(userId, options = {}) {
        const { page = 1, limit = 10, startDate, endDate, status } = options;
        const skip = (page - 1) * limit;
        const query = { userId: new mongoose_1.Types.ObjectId(userId) };
        if (startDate || endDate) {
            query.createdAt = {};
            if (startDate)
                query.createdAt.$gte = startDate;
            if (endDate)
                query.createdAt.$lte = endDate;
        }
        if (status) {
            query.status = status;
        }
        const [commissions, total] = await Promise.all([
            this.commissionModel
                .find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.commissionModel.countDocuments(query)
        ]);
        return {
            commissions: commissions.map(commission => commission.toObject()),
            total,
            page,
            limit,
            totalPages: Math.ceil(total / limit)
        };
    }
    async getTeamInfo(userId) {
        const user = await this.userModel.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        const teamMembers = await this.userModel.find({
            referrerId: userId
        });
        return {
            totalMembers: teamMembers.length,
            members: teamMembers.map(member => ({
                id: member._id,
                username: member.username,
                joinDate: member.createdAt
            }))
        };
    }
    async getCommissionTrendByType(userId, type, days) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const commissions = await this.commissionModel.aggregate([
            {
                $match: {
                    userId: new mongoose_1.Types.ObjectId(userId),
                    type,
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    amount: { $sum: '$amount' }
                }
            },
            {
                $sort: { _id: 1 }
            }
        ]);
        return commissions.map(commission => ({
            date: new Date(commission._id),
            amount: commission.amount
        }));
    }
    async getUserCommissionStats(userId) {
        var _a, _b, _c;
        try {
            const [total, pending, paid] = await Promise.all([
                this.commissionModel.aggregate([
                    { $match: { userId: new mongoose_1.Types.ObjectId(userId) } },
                    { $group: { _id: null, total: { $sum: '$amount' } } }
                ]),
                this.commissionModel.aggregate([
                    { $match: { userId: new mongoose_1.Types.ObjectId(userId), status: 'pending' } },
                    { $group: { _id: null, total: { $sum: '$amount' } } }
                ]),
                this.commissionModel.aggregate([
                    { $match: { userId: new mongoose_1.Types.ObjectId(userId), status: 'paid' } },
                    { $group: { _id: null, total: { $sum: '$amount' } } }
                ])
            ]);
            return {
                totalCommission: ((_a = total[0]) === null || _a === void 0 ? void 0 : _a.total) || 0,
                pendingCommission: ((_b = pending[0]) === null || _b === void 0 ? void 0 : _b.total) || 0,
                paidCommission: ((_c = paid[0]) === null || _c === void 0 ? void 0 : _c.total) || 0,
                cancelledCommission: 0
            };
        }
        catch (error) {
            logger_1.logger.error('Error getting commission stats:', error);
            throw error;
        }
    }
    async calculateAndDistributeCommission(performance) {
        try {
            // 计算佣金金额（这里使用简单的 10% 作为示例）
            const commissionAmount = performance.profit * 0.1;
            // 创建佣金记录
            const commissionData = {
                userId: performance.userId,
                amount: commissionAmount,
                type: 'trade',
                status: 'pending',
                createdAt: new Date(),
                updatedAt: new Date()
            };
            return this.createCommission(commissionData);
        }
        catch (error) {
            logger_1.logger.error('Error calculating and distributing commission:', error);
            throw new AppError_1.AppError('Failed to calculate and distribute commission', 500);
        }
    }
}
exports.CommissionService = CommissionService;
//# sourceMappingURL=%20commissionService.ts.Value.ToUpper()%20ommissionService.js.map