"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MonitoringService = void 0;
const AlertService_1 = require("./AlertService");
const Monitoring_1 = require("../models/Monitoring");
class MonitoringService {
    static getInstance() {
        if (!MonitoringService.instance) {
            MonitoringService.instance = new MonitoringService();
        }
        return MonitoringService.instance;
    }
    constructor() {
        this.model = Monitoring_1.Monitoring;
        this.alertService = AlertService_1.AlertService.getInstance();
    }
    async monitorStrategyPerformance(performance) {
        const { userId, strategyId, profit } = performance;
        // 监控策略表现
        if (profit < 0) {
            await this.alertService.createAlert({
                userId: userId.toString(),
                type: 'strategy_loss',
                message: `策略 ${strategyId} 出现亏损`,
                condition: 'profit < 0',
                value: profit,
                status: 'active',
                data: {
                    strategyId,
                    profit
                }
            });
        }
    }
    async createMonitoring(data) {
        return this.model.create(data);
    }
    async updateMonitoring(id, data) {
        return this.model.findOneAndUpdate({ _id: id }, data, { new: true });
    }
    async getMonitoring(id) {
        return this.model.findById(id);
    }
    async getAllMonitoring() {
        return this.model.find();
    }
    async deleteMonitoring(id) {
        const result = await this.model.deleteOne({ _id: id });
        return result.deletedCount === 1;
    }
    async getMonitoringByUser(userId) {
        return this.model.find({ userId });
    }
    async getActiveMonitoring() {
        return this.model.find({ status: 'active' });
    }
    async getInactiveMonitoring() {
        return this.model.find({ status: 'inactive' });
    }
    async getMonitoringStats(userId) {
        var _a;
        const [total, active, inactive, alerts] = await Promise.all([
            this.model.countDocuments({ userId }),
            this.model.countDocuments({ userId, status: 'active' }),
            this.model.countDocuments({ userId, status: 'inactive' }),
            this.model.aggregate([
                { $match: { userId } },
                { $group: { _id: null, total: { $sum: '$alertCount' } } }
            ])
        ]);
        return {
            total,
            active,
            inactive,
            alerts: ((_a = alerts[0]) === null || _a === void 0 ? void 0 : _a.total) || 0
        };
    }
    async startMonitoring(id) {
        return this.model.findOneAndUpdate({ _id: id }, { status: 'active', startedAt: new Date() }, { new: true });
    }
    async stopMonitoring(id) {
        return this.model.findOneAndUpdate({ _id: id }, { status: 'inactive', stoppedAt: new Date() }, { new: true });
    }
}
exports.MonitoringService = MonitoringService;
//# sourceMappingURL=%20MonitoringService.ts.Value.ToUpper()%20onitoringService.js.map