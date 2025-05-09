"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfitController = void 0;
const profit_model_1 = __importDefault(require("../models/profit.model"));
const logger_1 = require("../utils/logger");
class ProfitController {
    async getProfits(req, res) {
        try {
            const profits = await profit_model_1.default.find();
            res.json(profits);
        }
        catch (error) {
            logger_1.logger.error('Error in getProfits:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
    async getProfitById(req, res) {
        try {
            const profit = await profit_model_1.default.findById(req.params.id);
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
            const profit = new profit_model_1.default(req.body);
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
            const profit = await profit_model_1.default.findByIdAndUpdate(req.params.id, req.body, { new: true });
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
            const profit = await profit_model_1.default.findByIdAndDelete(req.params.id);
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