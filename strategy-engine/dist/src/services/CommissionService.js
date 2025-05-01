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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionService = void 0;
const logger_1 = require("../utils/logger");
class CommissionService {
    constructor() {
        this.PLATFORM_FEE_RATE = 0.1; // 平台托管费 10%
        this.FIRST_GEN_RATE = 0.2; // 第一代团队返佣 20%
        this.SECOND_GEN_RATE = 0.1; // 第二代团队返佣 10%
        this.commissionRecords = new Map();
        this.wallets = new Map();
    }
    static getInstance() {
        if (!CommissionService.instance) {
            CommissionService.instance = new CommissionService();
        }
        return CommissionService.instance;
    }
    processTradeProfit(userId, strategyId, tradeId, profit) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                // 计算平台托管费
                const platformFee = profit * this.PLATFORM_FEE_RATE;
                const userProfit = profit - platformFee;
                // 记录平台托管费
                this.addCommissionRecord({
                    id: this.generateId(),
                    userId: 'platform',
                    type: 'platform',
                    amount: platformFee,
                    sourceUserId: userId,
                    strategyId,
                    tradeId,
                    status: 'completed',
                    createdAt: new Date(),
                    completedAt: new Date()
                });
                // 记录用户收益
                this.addCommissionRecord({
                    id: this.generateId(),
                    userId,
                    type: 'team',
                    amount: userProfit,
                    strategyId,
                    tradeId,
                    status: 'completed',
                    createdAt: new Date(),
                    completedAt: new Date()
                });
                // 更新用户钱包
                this.updateWallet(userId, userProfit);
                // 处理团队返佣
                yield this.processTeamCommission(userId, profit, strategyId, tradeId);
                logger_1.logger.info(`Processed trade profit for user ${userId}, profit: ${profit}`);
            }
            catch (error) {
                logger_1.logger.error(`Error processing trade profit: ${error}`);
                throw error;
            }
        });
    }
    processTeamCommission(userId, profit, strategyId, tradeId) {
        return __awaiter(this, void 0, void 0, function* () {
            // TODO: 从数据库获取用户的邀请关系
            const firstGenUsers = yield this.getFirstGenerationUsers(userId);
            const secondGenUsers = yield this.getSecondGenerationUsers(userId);
            // 处理第一代返佣
            for (const firstGenUser of firstGenUsers) {
                const commission = profit * this.FIRST_GEN_RATE;
                this.addCommissionRecord({
                    id: this.generateId(),
                    userId: firstGenUser,
                    type: 'team',
                    amount: commission,
                    sourceUserId: userId,
                    generation: 1,
                    strategyId,
                    tradeId,
                    status: 'completed',
                    createdAt: new Date(),
                    completedAt: new Date()
                });
                this.updateWallet(firstGenUser, commission);
            }
            // 处理第二代返佣
            for (const secondGenUser of secondGenUsers) {
                const commission = profit * this.SECOND_GEN_RATE;
                this.addCommissionRecord({
                    id: this.generateId(),
                    userId: secondGenUser,
                    type: 'team',
                    amount: commission,
                    sourceUserId: userId,
                    generation: 2,
                    strategyId,
                    tradeId,
                    status: 'completed',
                    createdAt: new Date(),
                    completedAt: new Date()
                });
                this.updateWallet(secondGenUser, commission);
            }
        });
    }
    requestWithdrawal(userId, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            const wallet = this.getWallet(userId);
            if (!wallet || wallet.balance < amount) {
                throw new Error('Insufficient balance');
            }
            const record = {
                id: this.generateId(),
                userId,
                type: 'withdrawal',
                amount: -amount,
                status: 'pending',
                createdAt: new Date()
            };
            this.addCommissionRecord(record);
            this.updateWallet(userId, -amount, true); // true 表示冻结金额
            return record;
        });
    }
    completeWithdrawal(recordId) {
        return __awaiter(this, void 0, void 0, function* () {
            const record = this.commissionRecords.get(recordId);
            if (!record || record.type !== 'withdrawal') {
                throw new Error('Invalid withdrawal record');
            }
            record.status = 'completed';
            record.completedAt = new Date();
            this.updateWallet(record.userId, 0, false, true); // 解冻金额
            logger_1.logger.info(`Completed withdrawal for user ${record.userId}, amount: ${record.amount}`);
        });
    }
    getCommissionRecords(userId, type) {
        let records = Array.from(this.commissionRecords.values());
        if (userId) {
            records = records.filter(record => record.userId === userId);
        }
        if (type) {
            records = records.filter(record => record.type === type);
        }
        return records;
    }
    getWallet(userId) {
        return this.wallets.get(userId);
    }
    addCommissionRecord(record) {
        this.commissionRecords.set(record.id, record);
    }
    updateWallet(userId, amount, isFrozen = false, isWithdrawal = false) {
        let wallet = this.wallets.get(userId);
        if (!wallet) {
            wallet = {
                userId,
                balance: 0,
                frozenAmount: 0,
                totalCommission: 0,
                totalWithdrawal: 0
            };
        }
        if (isFrozen) {
            wallet.frozenAmount += amount;
        }
        else {
            wallet.balance += amount;
        }
        if (amount > 0 && !isFrozen) {
            wallet.totalCommission += amount;
        }
        if (isWithdrawal) {
            wallet.totalWithdrawal += Math.abs(amount);
        }
        this.wallets.set(userId, wallet);
    }
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    // TODO: 实现从数据库获取用户邀请关系的方法
    getFirstGenerationUsers(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return []; // 从数据库获取
        });
    }
    getSecondGenerationUsers(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            return []; // 从数据库获取
        });
    }
}
exports.CommissionService = CommissionService;
