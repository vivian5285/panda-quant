"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.strategyController = void 0;
const Strategy_1 = require("../models/Strategy");
const logger_1 = require("../utils/logger");
exports.strategyController = {
    async getAllStrategies(_req, res) {
        try {
            const strategies = await Strategy_1.Strategy.find();
            res.json(strategies);
        }
        catch (error) {
            logger_1.logger.error('Error getting strategies:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    async getStrategyById(req, res) {
        try {
            const { id } = req.params;
            const strategy = await Strategy_1.Strategy.findById(id);
            if (!strategy) {
                res.status(404).json({ error: 'Strategy not found' });
                return;
            }
            res.json(strategy);
        }
        catch (error) {
            logger_1.logger.error('Error getting strategy:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    async createStrategy(req, res) {
        try {
            const strategy = new Strategy_1.Strategy(req.body);
            await strategy.save();
            res.status(201).json(strategy);
        }
        catch (error) {
            logger_1.logger.error('Error creating strategy:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    async updateStrategy(req, res) {
        try {
            const { id } = req.params;
            const strategy = await Strategy_1.Strategy.findByIdAndUpdate(id, req.body, { new: true });
            if (!strategy) {
                res.status(404).json({ error: 'Strategy not found' });
                return;
            }
            res.json(strategy);
        }
        catch (error) {
            logger_1.logger.error('Error updating strategy:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    async deleteStrategy(req, res) {
        try {
            const { id } = req.params;
            const strategy = await Strategy_1.Strategy.findByIdAndDelete(id);
            if (!strategy) {
                res.status(404).json({ error: 'Strategy not found' });
                return;
            }
            res.status(204).send();
        }
        catch (error) {
            logger_1.logger.error('Error deleting strategy:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};
//# sourceMappingURL=StrategyController.js.map