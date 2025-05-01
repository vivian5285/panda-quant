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
exports.PlatformStatsService = void 0;
const CommissionService_1 = require("./CommissionService");
const logger_1 = require("../utils/logger");
class PlatformStatsService {
    constructor() {
        this.commissionService = CommissionService_1.CommissionService.getInstance();
        this.dailyStats = new Map();
    }
    static getInstance() {
        if (!PlatformStatsService.instance) {
            PlatformStatsService.instance = new PlatformStatsService();
        }
        return PlatformStatsService.instance;
    }
    calculateDailyStats() {
        return __awaiter(this, arguments, void 0, function* (date = new Date()) {
            const dateStr = this.formatDate(date);
            const records = this.commissionService.getCommissionRecords();
            const dailyRecords = records.filter(record => this.formatDate(record.createdAt) === dateStr);
            const stats = {
                date: dateStr,
                totalPlatformFee: 0,
                totalTeamCommission: 0,
                totalWithdrawals: 0,
                activeUsers: new Set(dailyRecords.map(r => r.userId)).size,
                totalTrades: new Set(dailyRecords
                    .filter(r => r.tradeId)
                    .map(r => r.tradeId)).size,
                totalProfit: 0
            };
            for (const record of dailyRecords) {
                switch (record.type) {
                    case 'platform':
                        stats.totalPlatformFee += record.amount;
                        break;
                    case 'team':
                        stats.totalTeamCommission += record.amount;
                        if (record.amount > 0) {
                            stats.totalProfit += record.amount;
                        }
                        break;
                    case 'withdrawal':
                        stats.totalWithdrawals += Math.abs(record.amount);
                        break;
                }
            }
            this.dailyStats.set(dateStr, stats);
            logger_1.logger.info(`Calculated daily stats for ${dateStr}`);
            return stats;
        });
    }
    getDailyStats(date) {
        return this.dailyStats.get(date);
    }
    getStatsRange(startDate, endDate) {
        const stats = [];
        let currentDate = new Date(startDate);
        const end = new Date(endDate);
        while (currentDate <= end) {
            const dateStr = this.formatDate(currentDate);
            const stat = this.dailyStats.get(dateStr);
            if (stat) {
                stats.push(stat);
            }
            currentDate.setDate(currentDate.getDate() + 1);
        }
        return stats;
    }
    getPlatformTotalStats() {
        const stats = {
            totalPlatformFee: 0,
            totalTeamCommission: 0,
            totalWithdrawals: 0,
            totalUsers: new Set(),
            totalTrades: new Set()
        };
        for (const dailyStat of this.dailyStats.values()) {
            stats.totalPlatformFee += dailyStat.totalPlatformFee;
            stats.totalTeamCommission += dailyStat.totalTeamCommission;
            stats.totalWithdrawals += dailyStat.totalWithdrawals;
            stats.totalUsers.add(dailyStat.date);
            stats.totalTrades.add(dailyStat.date);
        }
        return Object.assign(Object.assign({}, stats), { totalUsers: stats.totalUsers.size, totalTrades: stats.totalTrades.size });
    }
    formatDate(date) {
        return date.toISOString().split('T')[0];
    }
}
exports.PlatformStatsService = PlatformStatsService;
