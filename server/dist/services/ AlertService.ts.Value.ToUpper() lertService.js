"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertService = void 0;
const Alert_1 = require("../models/Alert");
class AlertService {
    static getInstance() {
        if (!AlertService.instance) {
            AlertService.instance = new AlertService();
        }
        return AlertService.instance;
    }
    constructor() {
        this.model = Alert_1.Alert;
    }
    async createAlert(data) {
        return this.model.create(data);
    }
    async updateAlert(id, data) {
        return this.model.findOneAndUpdate({ _id: id }, data, { new: true });
    }
    async getAlert(id) {
        return this.model.findById(id);
    }
    async getAllAlerts() {
        return this.model.find();
    }
    async deleteAlert(id) {
        const result = await this.model.deleteOne({ _id: id });
        return result.deletedCount === 1;
    }
    async getAlertsByUser(userId) {
        return this.model.find({ userId });
    }
    async getActiveAlerts() {
        return this.model.find({ status: 'active' });
    }
    async getTriggeredAlerts() {
        return this.model.find({ status: 'triggered' });
    }
    async getDisabledAlerts() {
        return this.model.find({ status: 'disabled' });
    }
    async disableAlert(id) {
        return this.model.findOneAndUpdate({ _id: id }, { status: 'disabled' }, { new: true });
    }
    async enableAlert(id) {
        return this.model.findOneAndUpdate({ _id: id }, { status: 'active' }, { new: true });
    }
    async getAlertStats(userId) {
        const [total, active, triggered, disabled] = await Promise.all([
            this.model.countDocuments({ userId }),
            this.model.countDocuments({ userId, status: 'active' }),
            this.model.countDocuments({ userId, status: 'triggered' }),
            this.model.countDocuments({ userId, status: 'disabled' })
        ]);
        return {
            total,
            active,
            triggered,
            disabled
        };
    }
}
exports.AlertService = AlertService;
//# sourceMappingURL=%20AlertService.ts.Value.ToUpper()%20lertService.js.map