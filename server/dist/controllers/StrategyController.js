"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyController = void 0;
const StrategyService_1 = require("../services/StrategyService");
const logger_1 = require("../utils/logger");
class StrategyController {
    constructor() {
        this.strategyService = StrategyService_1.StrategyService.getInstance();
    }
    async createStrategy(req, res) {
        try {
            const strategyData = req.body;
            const strategy = await this.strategyService.createStrategy(strategyData);
            res.status(201).json(strategy);
        }
        catch (error) {
            logger_1.logger.error('Error creating strategy:', error);
            res.status(500).json({ message: 'Error creating strategy' });
        }
    }
    async getStrategy(req, res) {
        try {
            const { id } = req.params;
            const strategy = await this.strategyService.getStrategyById(id);
            if (!strategy) {
                res.status(404).json({ message: 'Strategy not found' });
                return;
            }
            res.json(strategy);
        }
        catch (error) {
            logger_1.logger.error('Error getting strategy:', error);
            res.status(500).json({ message: 'Error getting strategy' });
        }
    }
    async updateStrategy(req, res) {
        try {
            const { id } = req.params;
            const updates = req.body;
            const strategy = await this.strategyService.updateStrategy(id, updates);
            if (!strategy) {
                res.status(404).json({ message: 'Strategy not found' });
                return;
            }
            res.json(strategy);
        }
        catch (error) {
            logger_1.logger.error('Error updating strategy:', error);
            res.status(500).json({ message: 'Error updating strategy' });
        }
    }
    async deleteStrategy(req, res) {
        try {
            const { id } = req.params;
            const success = await this.strategyService.deleteStrategy(id);
            if (!success) {
                res.status(404).json({ message: 'Strategy not found' });
                return;
            }
            res.status(204).send();
        }
        catch (error) {
            logger_1.logger.error('Error deleting strategy:', error);
            res.status(500).json({ message: 'Error deleting strategy' });
        }
    }
    async getAllStrategies(req, res) {
        try {
            const strategies = await this.strategyService.getAllStrategies();
            res.json(strategies);
        }
        catch (error) {
            logger_1.logger.error('Error getting all strategies:', error);
            res.status(500).json({ message: 'Error getting all strategies' });
        }
    }
    async startStrategy(req, res) {
        try {
            const { id } = req.params;
            const strategy = await this.strategyService.getStrategyById(id);
            if (!strategy) {
                res.status(404).json({ message: 'Strategy not found' });
                return;
            }
            await this.strategyService.startStrategy(strategy);
            res.json({ message: 'Strategy started successfully' });
        }
        catch (error) {
            logger_1.logger.error('Error starting strategy:', error);
            res.status(500).json({ message: 'Error starting strategy' });
        }
    }
    async stopStrategy(req, res) {
        try {
            const { id } = req.params;
            const strategy = await this.strategyService.getStrategyById(id);
            if (!strategy) {
                res.status(404).json({ message: 'Strategy not found' });
                return;
            }
            await this.strategyService.stopStrategy(strategy);
            res.json({ message: 'Strategy stopped successfully' });
        }
        catch (error) {
            logger_1.logger.error('Error stopping strategy:', error);
            res.status(500).json({ message: 'Error stopping strategy' });
        }
    }
    async pauseStrategy(req, res) {
        try {
            const { id } = req.params;
            const strategy = await this.strategyService.getStrategyById(id);
            if (!strategy) {
                res.status(404).json({ message: 'Strategy not found' });
                return;
            }
            await this.strategyService.pauseStrategy(strategy);
            res.json({ message: 'Strategy paused successfully' });
        }
        catch (error) {
            logger_1.logger.error('Error pausing strategy:', error);
            res.status(500).json({ message: 'Error pausing strategy' });
        }
    }
    async resumeStrategy(req, res) {
        try {
            const { id } = req.params;
            const strategy = await this.strategyService.getStrategyById(id);
            if (!strategy) {
                res.status(404).json({ message: 'Strategy not found' });
                return;
            }
            await this.strategyService.resumeStrategy(strategy);
            res.json({ message: 'Strategy resumed successfully' });
        }
        catch (error) {
            logger_1.logger.error('Error resuming strategy:', error);
            res.status(500).json({ message: 'Error resuming strategy' });
        }
    }
    async getStrategiesByUser(req, res) {
        try {
            const { userId } = req.params;
            const strategies = await this.strategyService.getStrategiesByUser(userId);
            res.json(strategies);
        }
        catch (error) {
            logger_1.logger.error('Error getting strategies by user:', error);
            res.status(500).json({ message: 'Error getting strategies by user' });
        }
    }
    async getActiveStrategies(req, res) {
        try {
            const strategies = await this.strategyService.getActiveStrategies();
            res.json(strategies);
        }
        catch (error) {
            logger_1.logger.error('Error getting active strategies:', error);
            res.status(500).json({ message: 'Error getting active strategies' });
        }
    }
    async getPopularStrategies(req, res) {
        try {
            const limit = parseInt(req.query.limit) || 10;
            const strategies = await this.strategyService.getPopularStrategies(limit);
            res.json(strategies);
        }
        catch (error) {
            logger_1.logger.error('Error getting popular strategies:', error);
            res.status(500).json({ message: 'Error getting popular strategies' });
        }
    }
}
exports.StrategyController = StrategyController;
//# sourceMappingURL=StrategyController.js.map