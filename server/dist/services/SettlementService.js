"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettlementService = void 0;
const mongoose_1 = require("mongoose");
const Settlement_1 = __importDefault(require("../models/Settlement"));
const PlatformEarning_1 = require("../models/PlatformEarning");
const errors_1 = require("../utils/errors");
const Commission_1 = require("../models/Commission");
const date_fns_1 = require("date-fns");
const logger_1 = require("../utils/logger");
const Settlement_2 = require("../types/Settlement");
const settlement_model_1 = __importDefault(require("../models/settlement.model"));
const Enums_1 = require("../types/Enums");
const User_1 = __importDefault(require("../models/User"));
class SettlementService {
    constructor() {
        this.model = settlement_model_1.default;
        this.commissionModel = Commission_1.Commission;
        this.platformEarningModel = PlatformEarning_1.PlatformEarning;
        this.userModel = User_1.default;
    }
    static getInstance() {
        if (!SettlementService.instance) {
            SettlementService.instance = new SettlementService();
        }
        return SettlementService.instance;
    }
    getSettlements(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const query = {};
            if (filter.startDate) {
                query.createdAt = { $gte: filter.startDate };
            }
            if (filter.endDate) {
                query.createdAt = Object.assign(Object.assign({}, query.createdAt), { $lte: filter.endDate });
            }
            if (filter.userId) {
                query.userId = filter.userId;
            }
            if (filter.status && filter.status !== 'all') {
                query.status = filter.status;
            }
            const settlements = yield this.model.find(query)
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
                settlements,
                total: settlements.length
            };
        });
    }
    getSettlementDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const settlement = yield this.model.findById(id);
                return settlement;
            }
            catch (error) {
                logger_1.logger.error('Error getting settlement details:', error);
                throw error;
            }
        });
    }
    updateSettlementStatus(id, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedSettlement = yield settlement_model_1.default.findByIdAndUpdate(id, { status }, { new: true });
                if (!updatedSettlement) {
                    return null;
                }
                return this.convertToISettlement(updatedSettlement);
            }
            catch (error) {
                logger_1.logger.error('Error updating settlement status:', error);
                throw error;
            }
        });
    }
    exportSettlements(filter) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield this.getSettlements(filter);
            const headers = ['ID', 'User ID', 'Amount', 'Commission IDs', 'Created At', 'Status'];
            const rows = response.settlements.map(settlement => {
                var _a, _b;
                return [
                    settlement._id.toString(),
                    settlement.userId.toString(),
                    settlement.amount.toString(),
                    ((_b = (_a = settlement.metadata) === null || _a === void 0 ? void 0 : _a.commissionIds) === null || _b === void 0 ? void 0 : _b.join(',')) || '',
                    (0, date_fns_1.format)(settlement.createdAt || new Date(), 'yyyy-MM-dd HH:mm:ss'),
                    settlement.status
                ];
            });
            return [headers, ...rows].join('\n');
        });
    }
    generateSettlements() {
        return __awaiter(this, void 0, void 0, function* () {
            // 获取所有待结算的佣金记录
            const pendingCommissions = yield this.commissionModel.find({ status: 'pending' })
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
                const user = yield this.userModel.findById(userId);
                if (!user)
                    continue;
                // 计算推荐人分成
                let level1Share = 0;
                let level2Share = 0;
                if (user.referrerId) {
                    // 第一代推荐人分成（20%）
                    level1Share = totalAmount * 0.2;
                    // 获取第二代推荐人
                    const level1User = yield this.userModel.findById(user.referrerId);
                    if (level1User === null || level1User === void 0 ? void 0 : level1User.referrerId) {
                        // 第二代推荐人分成（10%）
                        level2Share = totalAmount * 0.1;
                    }
                }
                // 创建结算记录
                const settlement = new Settlement_1.default({
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
                yield settlement.save();
                // 更新佣金状态为已结算
                yield this.commissionModel.updateMany({ _id: { $in: commissions.map((c) => c._id) } }, { status: 'completed' });
            }
        });
    }
    processPayment(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const settlement = yield settlement_model_1.default.findById(id);
                if (!settlement) {
                    return null;
                }
                settlement.status = Settlement_2.SettlementStatus.COMPLETED;
                settlement.completedAt = new Date();
                settlement.updatedAt = new Date();
                const updatedSettlement = yield settlement.save();
                return this.convertToISettlement(updatedSettlement);
            }
            catch (error) {
                logger_1.logger.error('Error processing payment:', error);
                throw error;
            }
        });
    }
    createSettlement(userId, amount, type, metadata) {
        return __awaiter(this, void 0, void 0, function* () {
            const settlement = new this.model({
                userId,
                amount,
                type,
                status: Settlement_2.SettlementStatus.PENDING,
                metadata,
                createdAt: new Date(),
                updatedAt: new Date()
            });
            yield settlement.save();
            return settlement;
        });
    }
    getAllSettlements() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.find().sort({ createdAt: -1 });
        });
    }
    getSettlementById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const settlement = yield settlement_model_1.default.findById(id);
                if (!settlement) {
                    return null;
                }
                return this.convertToISettlement(settlement);
            }
            catch (error) {
                logger_1.logger.error('Error getting settlement by ID:', error);
                throw error;
            }
        });
    }
    updateSettlement(id, settlement) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedSettlement = yield Settlement_1.default.findByIdAndUpdate(id, settlement, { new: true });
                if (!updatedSettlement) {
                    return null;
                }
                return this.convertToISettlement(updatedSettlement);
            }
            catch (error) {
                logger_1.logger.error('Error updating settlement:', error);
                throw error;
            }
        });
    }
    deleteSettlement(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield Settlement_1.default.findByIdAndDelete(id);
                return !!result;
            }
            catch (error) {
                logger_1.logger.error('Error deleting settlement:', error);
                throw error;
            }
        });
    }
    createPlatformEarning(earningData) {
        return __awaiter(this, void 0, void 0, function* () {
            const earning = new PlatformEarning_1.PlatformEarning(earningData);
            return yield earning.save();
        });
    }
    getAllPlatformEarnings() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.platformEarningModel.find().sort({ createdAt: -1 });
        });
    }
    getPlatformEarningById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const earning = yield this.platformEarningModel.findById(id);
            if (!earning) {
                throw new errors_1.NotFoundError('平台收益记录不存在');
            }
            return earning;
        });
    }
    updatePlatformEarning(id, earningData) {
        return __awaiter(this, void 0, void 0, function* () {
            const earning = yield this.platformEarningModel.findByIdAndUpdate(id, earningData, { new: true });
            if (!earning) {
                throw new errors_1.NotFoundError('平台收益记录不存在');
            }
            return earning;
        });
    }
    deletePlatformEarning(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield this.platformEarningModel.findByIdAndDelete(id);
            if (!result) {
                throw new errors_1.NotFoundError('Platform earning not found');
            }
        });
    }
    calculateSettlementSummary() {
        return __awaiter(this, void 0, void 0, function* () {
            const settlements = yield this.model.find();
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
            return summary;
        });
    }
    processSettlement(settlement) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const session = yield this.model.startSession();
                session.startTransaction();
                try {
                    // 更新结算状态
                    settlement.status = Settlement_2.SettlementStatus.COMPLETED;
                    settlement.completedAt = new Date();
                    yield settlement.save({ session });
                    // 更新相关佣金记录
                    const metadata = settlement.metadata;
                    if ((_a = metadata === null || metadata === void 0 ? void 0 : metadata.commissionIds) === null || _a === void 0 ? void 0 : _a.length) {
                        yield this.commissionModel.updateMany({ _id: { $in: metadata.commissionIds } }, { status: Enums_1.CommissionStatus.COMPLETED }, { session });
                    }
                    // 创建平台收益记录
                    if (metadata === null || metadata === void 0 ? void 0 : metadata.platformShare) {
                        yield this.platformEarningModel.create([{
                                userId: settlement._id.toString(),
                                strategyId: '',
                                amount: metadata.platformShare,
                                currency: 'USD',
                                type: 'commission',
                                description: 'Platform share from settlement',
                                metadata: { settlementId: settlement._id }
                            }], { session });
                    }
                    yield session.commitTransaction();
                }
                catch (error) {
                    yield session.abortTransaction();
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
        });
    }
    getSettlementSummary(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const settlements = yield this.model.find({
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
            return summary;
        });
    }
    getSettlementByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.model.find({ userId: new mongoose_1.Types.ObjectId(userId) });
        });
    }
    getSettlementSummaryByUser(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const settlements = yield this.getSettlementByUserId(userId);
            const totalAmount = settlements.reduce((sum, s) => sum + s.amount, 0);
            return { totalAmount, settlements };
        });
    }
    processPendingCommissions() {
        return __awaiter(this, void 0, void 0, function* () {
            const pendingCommissions = yield this.commissionModel.find({ status: 'pending' });
            for (const commission of pendingCommissions) {
                const userId = commission.userId.toString();
                const amount = commission.amount;
                const metadata = {
                    commissionId: commission._id.toString(),
                    platformShare: amount * 0.1,
                    level1Share: amount * 0.2,
                    level2Share: amount * 0.1
                };
                yield this.createSettlement(new mongoose_1.Types.ObjectId(userId), amount, 'deposit', metadata);
                commission.status = Settlement_2.SettlementStatus.COMPLETED;
                yield commission.save();
            }
        });
    }
    getSettlementsByUserId(userId, page = 1, limit = 10) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const skip = (page - 1) * limit;
                const query = { userId: new mongoose_1.Types.ObjectId(userId) };
                const [settlements, total] = yield Promise.all([
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
        });
    }
    calculateTotalAmount(metadata) {
        return __awaiter(this, void 0, void 0, function* () {
            return (metadata.platformShare || 0) + (metadata.level1Share || 0) + (metadata.level2Share || 0);
        });
    }
    convertToISettlement(settlement) {
        return {
            _id: settlement._id,
            userId: settlement.userId,
            amount: settlement.amount,
            type: settlement.type,
            status: settlement.status,
            referenceId: settlement.referenceId,
            referenceType: settlement.referenceType,
            description: settlement.description,
            metadata: settlement.metadata,
            completedAt: settlement.completedAt,
            createdAt: settlement.createdAt,
            updatedAt: settlement.updatedAt
        };
    }
    completeSettlement(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const settlement = yield this.model.findByIdAndUpdate(id, {
                    $set: {
                        status: Settlement_2.SettlementStatus.COMPLETED,
                        completedAt: new Date()
                    }
                }, { new: true });
                return settlement ? this.convertToISettlement(settlement) : null;
            }
            catch (error) {
                logger_1.logger.error('Error completing settlement:', error);
                throw error;
            }
        });
    }
    failSettlement(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const settlement = yield this.model.findByIdAndUpdate(id, {
                    $set: {
                        status: Settlement_2.SettlementStatus.FAILED,
                        completedAt: new Date()
                    }
                }, { new: true });
                return settlement ? this.convertToISettlement(settlement) : null;
            }
            catch (error) {
                logger_1.logger.error('Error failing settlement:', error);
                throw error;
            }
        });
    }
}
exports.SettlementService = SettlementService;
//# sourceMappingURL=SettlementService.js.map