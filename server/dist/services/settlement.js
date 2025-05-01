"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettlementService = void 0;
const Settlement_1 = require("../models/Settlement");
const PlatformEarning_1 = require("../models/PlatformEarning");
const errors_1 = require("../utils/errors");
const Commission_1 = require("../models/Commission");
const UserEarning_1 = require("../models/UserEarning");
const User_1 = require("../models/User");
const date_fns_1 = require("date-fns");
const mongoose_1 = require("mongoose");
const logger_1 = require("../utils/logger");
class SettlementService {
    static getInstance() {
        if (!SettlementService.instance) {
            SettlementService.instance = new SettlementService();
        }
        return SettlementService.instance;
    }
    constructor() {
        this.model = Settlement_1.Settlement;
        this.commissionModel = Commission_1.Commission;
        this.platformEarningModel = PlatformEarning_1.PlatformEarning;
    }
    async getSettlements(filter) {
        const query = {};
        if (filter.startDate) {
            query.createdAt = { $gte: filter.startDate };
        }
        if (filter.endDate) {
            query.createdAt = { ...query.createdAt, $lte: filter.endDate };
        }
        if (filter.userId) {
            query.userId = filter.userId;
        }
        if (filter.status && filter.status !== 'all') {
            query.status = filter.status;
        }
        const settlements = await this.model.find(query)
            .populate('userId', 'username email')
            .sort({ createdAt: -1 });
        const summary = {
            totalAmount: 0,
            totalCount: settlements.length,
            pendingCount: 0,
            completedCount: 0,
            failedCount: 0,
            platformTotal: 0,
            level1Total: 0,
            level2Total: 0
        };
        settlements.forEach(settlement => {
            summary.totalAmount += settlement.amount;
            const metadata = settlement.metadata;
            summary.platformTotal += (metadata === null || metadata === void 0 ? void 0 : metadata.platformShare) || 0;
            summary.level1Total += (metadata === null || metadata === void 0 ? void 0 : metadata.level1Share) || 0;
            summary.level2Total += (metadata === null || metadata === void 0 ? void 0 : metadata.level2Share) || 0;
            switch (settlement.status) {
                case 'pending':
                    summary.pendingCount++;
                    break;
                case 'completed':
                    summary.completedCount++;
                    break;
                case 'failed':
                    summary.failedCount++;
                    break;
            }
        });
        return {
            settlements: settlements.map(s => ({
                _id: s._id,
                userId: s.userId,
                amount: s.amount,
                metadata: s.metadata,
                createdAt: s.createdAt,
                updatedAt: s.updatedAt,
                status: s.status
            })),
            summary
        };
    }
    async getSettlementDetails(id) {
        try {
            const settlement = await Settlement_1.Settlement.findById(id);
            if (!settlement)
                return null;
            return settlement.toObject();
        }
        catch (error) {
            logger_1.logger.error('Error getting settlement details:', error);
            throw error;
        }
    }
    async updateSettlementStatus(id, status) {
        const settlement = await Settlement_1.Settlement.findById(id);
        if (!settlement) {
            throw new errors_1.NotFoundError('Settlement not found');
        }
        settlement.status = status;
        await settlement.save();
    }
    async exportSettlements(filter) {
        const response = await this.getSettlements(filter);
        const headers = ['ID', 'User ID', 'Amount', 'Commission IDs', 'Created At', 'Status'];
        const rows = response.settlements.map(settlement => {
            var _a, _b;
            return [
                settlement._id.toString(),
                settlement.userId.toString(),
                settlement.amount.toString(),
                ((_b = (_a = settlement.metadata) === null || _a === void 0 ? void 0 : _a.commissionIds) === null || _b === void 0 ? void 0 : _b.join(',')) || '',
                (0, date_fns_1.format)(settlement.createdAt, 'yyyy-MM-dd HH:mm:ss'),
                settlement.status
            ];
        });
        return [headers, ...rows].join('\n');
    }
    async generateSettlements() {
        // 获取所有待结算的佣金记录
        const pendingCommissions = await Commission_1.Commission.find({ status: 'pending' })
            .sort({ createdAt: 1 });
        // 按用户分组佣金
        const userCommissions = new Map();
        pendingCommissions.forEach(commission => {
            var _a;
            const userId = commission.userId.toString();
            if (!userCommissions.has(userId)) {
                userCommissions.set(userId, []);
            }
            (_a = userCommissions.get(userId)) === null || _a === void 0 ? void 0 : _a.push(commission);
        });
        // 为每个用户生成结算记录
        for (const [userId, commissions] of userCommissions) {
            const totalAmount = commissions.reduce((sum, commission) => sum + commission.amount, 0);
            // 计算平台分成（10%）
            const platformShare = totalAmount * 0.1;
            // 计算用户实际收益（90%）
            const userShare = totalAmount * 0.9;
            // 获取用户的推荐关系
            const user = await User_1.User.findById(userId);
            if (!user)
                continue;
            // 计算推荐人分成
            let level1Share = 0;
            let level2Share = 0;
            if (user.referrerId) {
                // 第一代推荐人分成（20%）
                level1Share = totalAmount * 0.2;
                // 获取第二代推荐人
                const level1User = await User_1.User.findById(user.referrerId);
                if (level1User === null || level1User === void 0 ? void 0 : level1User.referrerId) {
                    // 第二代推荐人分成（10%）
                    level2Share = totalAmount * 0.1;
                }
            }
            // 创建结算记录
            const settlement = new Settlement_1.Settlement({
                userId: user._id,
                amount: userShare,
                status: 'pending',
                metadata: {
                    commissionIds: commissions.map(c => c._id),
                    platformShare,
                    level1Share,
                    level2Share
                }
            });
            await settlement.save();
            // 更新佣金状态为已结算
            await Commission_1.Commission.updateMany({ _id: { $in: commissions.map(c => c._id) } }, { status: 'completed' });
        }
    }
    async processPayment(id) {
        var _a, _b, _c, _d, _e;
        const settlement = await Settlement_1.Settlement.findById(id);
        if (!settlement) {
            throw new errors_1.NotFoundError('Settlement not found');
        }
        if (settlement.status !== 'pending') {
            throw new errors_1.NotFoundError('Settlement is not in pending status');
        }
        // 开始事务
        const session = await Settlement_1.Settlement.startSession();
        session.startTransaction();
        try {
            // 更新结算状态为已完成
            settlement.status = 'completed';
            await settlement.save({ session });
            // 处理平台分成
            const platformEarning = new PlatformEarning_1.PlatformEarning({
                settlementId: settlement._id,
                amount: ((_a = settlement.metadata) === null || _a === void 0 ? void 0 : _a.platformShare) || 0
            });
            await platformEarning.save({ session });
            // 处理第一代推荐人分成
            if ((((_b = settlement.metadata) === null || _b === void 0 ? void 0 : _b.level1Share) || 0) > 0) {
                const user = await User_1.User.findById(settlement.userId);
                if (user === null || user === void 0 ? void 0 : user.referrerId) {
                    const userEarning = new UserEarning_1.UserEarning({
                        userId: user.referrerId,
                        settlementId: settlement._id,
                        amount: ((_c = settlement.metadata) === null || _c === void 0 ? void 0 : _c.level1Share) || 0,
                        level: 1
                    });
                    await userEarning.save({ session });
                }
            }
            // 处理第二代推荐人分成
            if ((((_d = settlement.metadata) === null || _d === void 0 ? void 0 : _d.level2Share) || 0) > 0) {
                const user = await User_1.User.findById(settlement.userId);
                if (user === null || user === void 0 ? void 0 : user.referrerId) {
                    const level1User = await User_1.User.findById(user.referrerId);
                    if (level1User === null || level1User === void 0 ? void 0 : level1User.referrerId) {
                        const userEarning = new UserEarning_1.UserEarning({
                            userId: level1User.referrerId,
                            settlementId: settlement._id,
                            amount: ((_e = settlement.metadata) === null || _e === void 0 ? void 0 : _e.level2Share) || 0,
                            level: 2
                        });
                        await userEarning.save({ session });
                    }
                }
            }
            await session.commitTransaction();
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        }
    }
    // 创建结算记录
    async createSettlement(data) {
        try {
            const settlement = new Settlement_1.Settlement({
                ...data,
                userId: new mongoose_1.Types.ObjectId(data.userId),
                type: data.type || 'commission',
                status: 'pending'
            });
            await settlement.save();
            return settlement;
        }
        catch (error) {
            logger_1.logger.error('Error creating settlement:', error);
            throw error;
        }
    }
    // 获取所有结算记录
    async getAllSettlements() {
        return await Settlement_1.Settlement.find().sort({ createdAt: -1 });
    }
    // 获取单个结算记录
    async getSettlementById(id) {
        const settlement = await Settlement_1.Settlement.findById(id);
        if (!settlement) {
            throw new errors_1.NotFoundError('Settlement not found');
        }
        return settlement;
    }
    // 更新结算记录
    async updateSettlement(id, settlementData) {
        const settlement = await Settlement_1.Settlement.findByIdAndUpdate(id, { ...settlementData, updatedAt: new Date() }, { new: true, runValidators: true });
        if (!settlement) {
            throw new errors_1.NotFoundError('Settlement not found');
        }
        return settlement;
    }
    // 删除结算记录
    async deleteSettlement(id) {
        const settlement = await Settlement_1.Settlement.findByIdAndDelete(id);
        if (!settlement) {
            throw new errors_1.NotFoundError('Settlement not found');
        }
    }
    // 创建平台收益记录
    async createPlatformEarning(earningData) {
        const earning = new this.platformEarningModel({
            ...earningData,
            status: 'pending',
            createdAt: new Date(),
            updatedAt: new Date()
        });
        return await earning.save();
    }
    // 获取所有平台收益记录
    async getAllPlatformEarnings() {
        return await this.platformEarningModel.find().sort({ createdAt: -1 });
    }
    // 获取单个平台收益记录
    async getPlatformEarningById(id) {
        const earning = await this.platformEarningModel.findById(id);
        if (!earning) {
            throw new errors_1.NotFoundError('Platform earning not found');
        }
        return earning;
    }
    // 更新平台收益记录
    async updatePlatformEarning(id, earningData) {
        const earning = await this.platformEarningModel.findByIdAndUpdate(id, { ...earningData, updatedAt: new Date() }, { new: true, runValidators: true });
        if (!earning) {
            throw new errors_1.NotFoundError('Platform earning not found');
        }
        return earning;
    }
    // 删除平台收益记录
    async deletePlatformEarning(id) {
        const earning = await this.platformEarningModel.findByIdAndDelete(id);
        if (!earning) {
            throw new errors_1.NotFoundError('Platform earning not found');
        }
    }
    async calculateSettlementSummary() {
        const settlements = await this.model.find();
        const summary = {
            platformTotal: 0,
            level1Total: 0,
            level2Total: 0
        };
        for (const settlement of settlements) {
            const metadata = settlement.metadata;
            if (metadata) {
                summary.platformTotal += metadata.platformShare || 0;
                summary.level1Total += metadata.level1Share || 0;
                summary.level2Total += metadata.level2Share || 0;
            }
        }
        return summary;
    }
    async processSettlement(settlement) {
        var _a, _b, _c;
        try {
            const user = await User_1.User.findById(settlement.userId);
            if (!user) {
                throw new errors_1.NotFoundError('User not found');
            }
            // Create platform commission
            await this.createCommission({
                userId: settlement.userId,
                amount: ((_a = settlement.metadata) === null || _a === void 0 ? void 0 : _a.platformShare) || 0,
                type: 'platform',
                status: 'pending'
            });
            // Create referral commissions if applicable
            if (user.referrerId) {
                const level1User = await User_1.User.findById(user.referrerId);
                if (level1User) {
                    await this.createCommission({
                        userId: level1User._id,
                        amount: ((_b = settlement.metadata) === null || _b === void 0 ? void 0 : _b.level1Share) || 0,
                        type: 'referral',
                        status: 'pending'
                    });
                    if (level1User.referrerId) {
                        const level2User = await User_1.User.findById(level1User.referrerId);
                        if (level2User) {
                            await this.createCommission({
                                userId: level2User._id,
                                amount: ((_c = settlement.metadata) === null || _c === void 0 ? void 0 : _c.level2Share) || 0,
                                type: 'referral',
                                status: 'pending'
                            });
                        }
                    }
                }
            }
            // Update settlement status
            await this.updateSettlementStatus(settlement._id.toString(), 'completed');
        }
        catch (error) {
            logger_1.logger.error('Error processing settlement:', error);
            await this.updateSettlementStatus(settlement._id.toString(), 'failed');
            throw error;
        }
    }
    async createCommission(data) {
        return await this.commissionModel.create(data);
    }
    async getSettlementSummary(startDate, endDate) {
        const settlements = await Settlement_1.Settlement.find({
            createdAt: { $gte: startDate, $lte: endDate }
        });
        const summary = {
            totalAmount: 0,
            totalCount: settlements.length,
            pendingCount: 0,
            completedCount: 0,
            failedCount: 0,
            platformTotal: 0,
            level1Total: 0,
            level2Total: 0
        };
        settlements.forEach(settlement => {
            const metadata = settlement.metadata || {};
            summary.platformTotal += metadata.platformShare || 0;
            summary.level1Total += metadata.level1Share || 0;
            summary.level2Total += metadata.level2Share || 0;
        });
        return summary;
    }
    async getSettlementByUserId(userId) {
        return Settlement_1.Settlement.find({ userId });
    }
    async getSettlementSummaryByUser(userId) {
        const settlements = await Settlement_1.Settlement.find({ userId });
        const totalAmount = settlements.reduce((sum, s) => {
            const metadata = s.metadata || {};
            return sum + (metadata['platformShare'] || 0) +
                (metadata['level1Share'] || 0) +
                (metadata['level2Share'] || 0);
        }, 0);
        return {
            totalAmount,
            settlements
        };
    }
    async processPendingCommissions() {
        try {
            const pendingCommissions = await Commission_1.Commission.find({ status: 'pending' });
            for (const commission of pendingCommissions) {
                const user = await User_1.User.findById(commission.userId);
                if (!user) {
                    continue;
                }
                if (user.referrer) {
                    const level1User = await User_1.User.findById(user.referrer);
                    if (level1User === null || level1User === void 0 ? void 0 : level1User.referrer) {
                        const level2User = await User_1.User.findById(level1User.referrer);
                        if (level2User) {
                            await this.createSettlement({
                                userId: level2User._id.toString(),
                                amount: commission.amount * 0.1,
                                type: 'referral',
                                status: 'pending'
                            });
                        }
                    }
                }
                await Commission_1.Commission.findByIdAndUpdate(commission._id, { status: 'completed' });
            }
        }
        catch (error) {
            logger_1.logger.error('Error processing pending commissions:', error);
            throw error;
        }
    }
}
exports.SettlementService = SettlementService;
//# sourceMappingURL=settlement.js.map