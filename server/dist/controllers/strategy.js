"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyController = void 0;
const logger_1 = require("../utils/logger");
const StrategyService_1 = require("../services/StrategyService");
class StrategyController {
    constructor() {
        this.getStrategies = async (req, res) => {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'User not authenticated' });
                    return;
                }
                const strategies = await this.strategyService.getStrategies(req.user._id.toString());
                res.json(strategies);
            }
            catch (error) {
                logger_1.logger.error('Error getting strategies:', error);
                res.status(500).json({ message: 'Error getting strategies', error: error.message });
            }
        };
        this.getStrategy = async (req, res) => {
            try {
                const strategy = await this.strategyService.getStrategy(req.params['id']);
                if (!strategy) {
                    res.status(404).json({ message: 'Strategy not found' });
                    return;
                }
                res.json(strategy);
            }
            catch (error) {
                logger_1.logger.error('Error getting strategy:', error);
                res.status(500).json({ message: 'Error getting strategy', error: error.message });
            }
        };
        this.createStrategy = async (req, res) => {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'User not authenticated' });
                    return;
                }
                const strategy = await this.strategyService.createStrategy({
                    ...req.body,
                    userId: req.user._id.toString()
                });
                res.status(201).json({ message: 'Strategy created successfully', strategy });
            }
            catch (error) {
                logger_1.logger.error('Error creating strategy:', error);
                res.status(500).json({ message: 'Error creating strategy', error });
            }
        };
        this.updateStrategy = async (req, res) => {
            try {
                const strategy = await this.strategyService.updateStrategy(req.params['id'], req.body);
                if (!strategy) {
                    res.status(404).json({ message: 'Strategy not found' });
                    return;
                }
                res.json({ message: 'Strategy updated successfully', strategy });
            }
            catch (error) {
                logger_1.logger.error('Error updating strategy:', error);
                res.status(500).json({ message: 'Error updating strategy', error });
            }
        };
        this.deleteStrategy = async (req, res) => {
            try {
                const result = await this.strategyService.deleteStrategy(req.params['id']);
                if (result === null) {
                    res.status(404).json({ message: 'Strategy not found' });
                    return;
                }
                res.json({ message: 'Strategy deleted successfully' });
            }
            catch (error) {
                logger_1.logger.error('Error deleting strategy:', error);
                res.status(500).json({ message: 'Error deleting strategy', error });
            }
        };
        this.strategyService = StrategyService_1.StrategyService.getInstance();
    }
}
exports.StrategyController = StrategyController;
const strategyController = new StrategyController();
exports.default = strategyController;
//# sourceMappingURL=Strategy.js.map