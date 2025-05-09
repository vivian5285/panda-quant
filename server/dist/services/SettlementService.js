"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettlementService = void 0;
const mongoose_1 = require("mongoose");
const settlement_model_1 = require("../models/settlement.model");
const platformEarning_model_1 = require("../models/platformEarning.model");
const errors_1 = require("../utils/errors");
const commission_model_1 = require("../models/commission.model");
const date_fns_1 = require("date-fns");
const logger_1 = require("../utils/logger");
const Settlement_1 = require("../types/Settlement");
const settlement_model_2 = __importDefault(require("../models/settlement.model"));
const Enums_1 = require("../types/Enums");
const user_model_1 = __importDefault(require("../models/user.model"));
class SettlementService {
    constructor() {
        this.model = settlement_model_2.default;
        this.commissionModel = commission_model_1.Commission;
        this.platformEarningModel = platformEarning_model_1.PlatformEarning;
        this.userModel = user_model_1.default;
    }
    static getInstance() {
        if (!SettlementService.instance) {
            SettlementService.instance = new SettlementService();
        }
        return SettlementService.instance;
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
            summary.platformTotal += metadata?.platformShare || 0;
            summary.level1Total += metadata?.level1Share || 0;
            summary.level2Total += metadata?.level2Share || 0;
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
            settlements,
            total: settlements.length
        };
    }
    async getSettlementDetails(id) {
        try {
            const settlement = await this.model.findById(id);
            return settlement;
        }
        catch (error) {
            logger_1.logger.error('Error getting settlement details:', error);
            throw error;
        }
    }
    async updateSettlementStatus(id, status) {
        try {
            const updatedSettlement = await settlement_model_2.default.findByIdAndUpdate(id, { status }, { new: true });
            if (!updatedSettlement) {
                return null;
            }
            return this.convertToISettlement(updatedSettlement);
        }
        catch (error) {
            logger_1.logger.error('Error updating settlement status:', error);
            throw error;
        }
    }
    async exportSettlements(filter) {
        const response = await this.getSettlements(filter);
        const headers = ['ID', 'User ID', 'Amount', 'Commission IDs', 'Created At', 'Status'];
        const rows = response.settlements.map(settlement => [
            settlement._id.toString(),
            settlement.userId.toString(),
            settlement.amount.toString(),
            settlement.metadata?.commissionIds?.join(',') || '',
            (0, date_fns_1.format)(settlement.createdAt || new Date(), 'yyyy-MM-dd HH:mm:ss'),
            settlement.status
        ]);
        return [headers, ...rows].join('\n');
    }
    async generateSettlements() {
        // 获取所有待结算的佣金记录
        const pendingCommissions = await this.commissionModel.find({ status: 'pending' })
            .sort({ createdAt: 1 });
        // 按用户分组佣金
        const userCommissions = new Map();
        pendingCommissions.forEach(commission => {
            const userId = commission.userId.toString();
            if (!userCommissions.has(userId)) {
                userCommissions.set(userId, []);
            }
            userCommissions.get(userId)?.push(commission);
        });
        // 为每个用户生成结算记录
        for (const [userId, commissions] of userCommissions) {
            const totalAmount = commissions.reduce((sum, commission) => sum + commission.amount, 0);
            // 计算平台分成（10%）
            const platformShare = totalAmount * 0.1;
            // 计算用户实际收益（90%）
            const userShare = totalAmount * 0.9;
            // 获取用户的推荐关系
            const user = await this.userModel.findById(userId);
            if (!user)
                continue;
            // 计算推荐人分成
            let level1Share = 0;
            let level2Share = 0;
            if (user.referrerId) {
                // 第一代推荐人分成（20%）
                level1Share = totalAmount * 0.2;
                // 获取第二代推荐人
                const level1User = await this.userModel.findById(user.referrerId);
                if (level1User?.referrerId) {
                    // 第二代推荐人分成（10%）
                    level2Share = totalAmount * 0.1;
                }
            }
            // 创建结算记录
            const settlement = new settlement_model_1.Settlement({
                userId: new mongoose_1.Types.ObjectId(userId),
                amount: userShare,
                type: 'deposit',
                status: 'pending',
                metadata: {
                    commissionIds: commissions.map((c) => c._id),
                    platformShare,
                    level1Share,
                    level2Share
                }
            });
            await settlement.save();
            // 更新佣金状态为已结算
            await this.commissionModel.updateMany({ _id: { $in: commissions.map((c) => c._id) } }, { status: 'completed' });
        }
    }
    async processPayment(id) {
        try {
            const settlement = await settlement_model_2.default.findById(id);
            if (!settlement) {
                return null;
            }
            const updatedSettlement = await settlement_model_2.default.findByIdAndUpdate(id, {
                status: Settlement_1.SettlementStatus.COMPLETED,
                completedAt: new Date(),
                updatedAt: new Date()
            }, { new: true });
            return updatedSettlement ? this.convertToISettlement(updatedSettlement) : null;
        }
        catch (error) {
            logger_1.logger.error('Error processing payment:', error);
            throw error;
        }
    }
    async createSettlement(userId, amount, type, metadata) {
        const settlement = new this.model({
            userId,
            amount,
            type,
            status: Settlement_1.SettlementStatus.PENDING,
            metadata,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        await settlement.save();
        return settlement;
    }
    async getAllSettlements() {
        return await this.model.find().sort({ createdAt: -1 });
    }
    async getSettlementById(id) {
        try {
            const settlement = await settlement_model_2.default.findById(id);
            if (!settlement) {
                return null;
            }
            return this.convertToISettlement(settlement);
        }
        catch (error) {
            logger_1.logger.error('Error getting settlement by ID:', error);
            throw error;
        }
    }
    async updateSettlement(id, settlement) {
        try {
            const updatedSettlement = await settlement_model_1.Settlement.findByIdAndUpdate(id, settlement, { new: true });
            if (!updatedSettlement) {
                return null;
            }
            return this.convertToISettlement(updatedSettlement);
        }
        catch (error) {
            logger_1.logger.error('Error updating settlement:', error);
            throw error;
        }
    }
    async deleteSettlement(id) {
        try {
            const result = await settlement_model_1.Settlement.findByIdAndDelete(id);
            return !!result;
        }
        catch (error) {
            logger_1.logger.error('Error deleting settlement:', error);
            throw error;
        }
    }
    async createPlatformEarning(earningData) {
        const earning = new platformEarning_model_1.PlatformEarning(earningData);
        return await earning.save();
    }
    async getAllPlatformEarnings() {
        return await this.platformEarningModel.find().sort({ createdAt: -1 });
    }
    async getPlatformEarningById(id) {
        const earning = await this.platformEarningModel.findById(id);
        if (!earning) {
            throw new errors_1.NotFoundError('平台收益记录不存在');
        }
        return earning;
    }
    async updatePlatformEarning(id, earningData) {
        const earning = await this.platformEarningModel.findByIdAndUpdate(id, earningData, { new: true });
        if (!earning) {
            throw new errors_1.NotFoundError('平台收益记录不存在');
        }
        return earning;
    }
    async deletePlatformEarning(id) {
        const result = await this.platformEarningModel.findByIdAndDelete(id);
        if (!result) {
            throw new errors_1.NotFoundError('Platform earning not found');
        }
    }
    async calculateSettlementSummary() {
        const settlements = await this.model.find();
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
            summary.platformTotal += metadata?.platformShare || 0;
            summary.level1Total += metadata?.level1Share || 0;
            summary.level2Total += metadata?.level2Share || 0;
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
        return summary;
    }
    async processSettlement(settlement) {
        try {
            const session = await this.model.startSession();
            session.startTransaction();
            try {
                // 更新结算状态
                settlement.status = Settlement_1.SettlementStatus.COMPLETED;
                settlement.completedAt = new Date();
                await settlement.save({ session });
                // 更新相关佣金记录
                const metadata = settlement.metadata;
                if (metadata?.commissionIds?.length) {
                    await this.commissionModel.updateMany({ _id: { $in: metadata.commissionIds } }, { status: Enums_1.CommissionStatus.COMPLETED }, { session });
                }
                // 创建平台收益记录
                if (metadata?.platformShare) {
                    await this.platformEarningModel.create([{
                            userId: settlement._id.toString(),
                            strategyId: '',
                            amount: metadata.platformShare,
                            currency: 'USD',
                            type: 'commission',
                            description: 'Platform share from settlement',
                            metadata: { settlementId: settlement._id }
                        }], { session });
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
        catch (error) {
            logger_1.logger.error('Error processing settlement:', error);
            throw error;
        }
    }
    async getSettlementSummary(startDate, endDate) {
        const settlements = await this.model.find({
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
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
            summary.totalAmount += settlement.amount;
            const metadata = settlement.metadata;
            summary.platformTotal += metadata?.platformShare || 0;
            summary.level1Total += metadata?.level1Share || 0;
            summary.level2Total += metadata?.level2Share || 0;
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
        return summary;
    }
    async getSettlementByUserId(userId) {
        return await this.model.find({ userId: new mongoose_1.Types.ObjectId(userId) });
    }
    async getSettlementSummaryByUser(userId) {
        const settlements = await this.getSettlementByUserId(userId);
        const totalAmount = settlements.reduce((sum, s) => sum + s.amount, 0);
        return { totalAmount, settlements };
    }
    async processPendingCommissions() {
        const pendingCommissions = await this.commissionModel.find({ status: 'pending' });
        for (const commission of pendingCommissions) {
            const userId = commission.userId.toString();
            const amount = commission.amount;
            const metadata = {
                commissionId: commission._id.toString(),
                platformShare: amount * 0.1,
                level1Share: amount * 0.2,
                level2Share: amount * 0.1
            };
            await this.createSettlement(new mongoose_1.Types.ObjectId(userId), amount, 'deposit', metadata);
            commission.status = Settlement_1.SettlementStatus.COMPLETED;
            await commission.save();
        }
    }
    async getSettlementsByUserId(userId, page = 1, limit = 10) {
        try {
            const skip = (page - 1) * limit;
            const query = { userId: new mongoose_1.Types.ObjectId(userId) };
            const [settlements, total] = await Promise.all([
                this.model.find(query)
                    .sort({ createdAt: -1 })
                    .skip(skip)
                    .limit(limit),
                this.model.countDocuments(query)
            ]);
            return { settlements, total };
        }
        catch (error) {
            logger_1.logger.error('Error getting settlements by user ID:', error);
            throw error;
        }
    }
    async calculateTotalAmount(metadata) {
        return (metadata.platformShare || 0) + (metadata.level1Share || 0) + (metadata.level2Share || 0);
    }
    convertToISettlement(settlement) {
        return {
            _id: settlement._id,
            userId: settlement.userId,
            amount: settlement.amount,
            type: settlement.type,
            status: settlement.status,
            referenceId: settlement._id,
            referenceType: 'settlement',
            description: settlement.description,
            metadata: settlement.metadata,
            completedAt: settlement.completedAt,
            createdAt: settlement.createdAt,
            updatedAt: settlement.updatedAt
        };
    }
    async completeSettlement(id) {
        try {
            const settlement = await this.model.findById(id);
            if (!settlement) {
                return null;
            }
            settlement.status = Settlement_1.SettlementStatus.COMPLETED;
            settlement.completedAt = new Date();
            const updatedSettlement = await settlement.save();
            return this.convertToISettlement(updatedSettlement);
        }
        catch (error) {
            logger_1.logger.error('Error completing settlement:', error);
            throw error;
        }
    }
    async failSettlement(id) {
        try {
            const settlement = await this.model.findByIdAndUpdate(id, {
                $set: {
                    status: Settlement_1.SettlementStatus.FAILED,
                    completedAt: new Date()
                }
            }, { new: true });
            return settlement ? this.convertToISettlement(settlement) : null;
        }
        catch (error) {
            logger_1.logger.error('Error failing settlement:', error);
            throw error;
        }
    }
}
exports.SettlementService = SettlementService;
//# sourceMappingURL=SettlementService.js.map