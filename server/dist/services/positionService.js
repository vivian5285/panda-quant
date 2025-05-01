"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PositionService = void 0;
const Position_1 = require("../models/Position");
class PositionService {
    static getInstance() {
        if (!PositionService.instance) {
            PositionService.instance = new PositionService();
        }
        return PositionService.instance;
    }
    constructor() {
        this.model = Position_1.Position;
    }
    async createPosition(data) {
        return this.model.create(data);
    }
    async updatePosition(id, data) {
        return this.model.findOneAndUpdate({ _id: id }, data, { new: true });
    }
    async getPosition(id) {
        return this.model.findById(id);
    }
    async getAllPositions() {
        return this.model.find();
    }
    async deletePosition(id) {
        const result = await this.model.deleteOne({ _id: id });
        return result.deletedCount === 1;
    }
    async getPositionsByUser(userId) {
        return this.model.find({ userId });
    }
    async getOpenPositions(userId) {
        return this.model.find({ userId, status: 'open' });
    }
    async getClosedPositions(userId) {
        return this.model.find({ userId, status: 'closed' });
    }
    async getPositionStats(userId) {
        var _a;
        const [total, open, closed, profitLoss] = await Promise.all([
            this.model.countDocuments({ userId }),
            this.model.countDocuments({ userId, status: 'open' }),
            this.model.countDocuments({ userId, status: 'closed' }),
            this.model.aggregate([
                { $match: { userId } },
                { $group: { _id: null, total: { $sum: '$profitLoss' } } }
            ])
        ]);
        return {
            total,
            open,
            closed,
            totalProfitLoss: ((_a = profitLoss[0]) === null || _a === void 0 ? void 0 : _a.total) || 0
        };
    }
    async closePosition(id, currentPrice) {
        const position = await this.model.findById(id);
        if (!position) {
            return null;
        }
        const profitLoss = (currentPrice - position.entryPrice) * position.quantity;
        return this.model.findOneAndUpdate({ _id: id }, {
            status: 'closed',
            currentPrice,
            profitLoss,
            closedAt: new Date()
        }, { new: true });
    }
}
exports.PositionService = PositionService;
//# sourceMappingURL=positionService.js.map