"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfitController = void 0;
const Profit_1 = require("../models/Profit");
const logger_1 = require("../utils/logger");
class ProfitController {
    async getProfits(req, res) {
        try {
            const profits = await Profit_1.Profit.find();
            res.json(profits);
        }
        catch (error) {
            logger_1.logger.error('Error in getProfits:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    async getProfitById(req, res) {
        try {
            const profit = await Profit_1.Profit.findById(req.params.id);
            if (!profit) {
                res.status(404).json({ error: 'Profit not found' });
                return;
            }
            res.json(profit);
        }
        catch (error) {
            logger_1.logger.error('Error in getProfitById:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    async createProfit(req, res) {
        try {
            const profit = new Profit_1.Profit(req.body);
            await profit.save();
            res.status(201).json(profit);
        }
        catch (error) {
            logger_1.logger.error('Error in createProfit:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    async updateProfit(req, res) {
        try {
            const profit = await Profit_1.Profit.findByIdAndUpdate(req.params.id, req.body, { new: true });
            if (!profit) {
                res.status(404).json({ error: 'Profit not found' });
                return;
            }
            res.json(profit);
        }
        catch (error) {
            logger_1.logger.error('Error in updateProfit:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    async deleteProfit(req, res) {
        try {
            const profit = await Profit_1.Profit.findByIdAndDelete(req.params.id);
            if (!profit) {
                res.status(404).json({ error: 'Profit not found' });
                return;
            }
            res.json({ message: 'Profit deleted successfully' });
        }
        catch (error) {
            logger_1.logger.error('Error in deleteProfit:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
}
exports.ProfitController = ProfitController;
//# sourceMappingURL=ProfitController.js.map