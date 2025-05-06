import { Strategy } from '../models/Strategy';
import { logger } from '../utils/logger';
export const strategyController = {
    async getAllStrategies(_req, res) {
        try {
            const strategies = await Strategy.find();
            res.json(strategies);
        }
        catch (error) {
            logger.error('Error getting strategies:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    async getStrategyById(req, res) {
        try {
            const { id } = req.params;
            const strategy = await Strategy.findById(id);
            if (!strategy) {
                res.status(404).json({ error: 'Strategy not found' });
                return;
            }
            res.json(strategy);
        }
        catch (error) {
            logger.error('Error getting strategy:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    async createStrategy(req, res) {
        try {
            const strategy = new Strategy(req.body);
            await strategy.save();
            res.status(201).json(strategy);
        }
        catch (error) {
            logger.error('Error creating strategy:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    async updateStrategy(req, res) {
        try {
            const { id } = req.params;
            const strategy = await Strategy.findByIdAndUpdate(id, req.body, { new: true });
            if (!strategy) {
                res.status(404).json({ error: 'Strategy not found' });
                return;
            }
            res.json(strategy);
        }
        catch (error) {
            logger.error('Error updating strategy:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    async deleteStrategy(req, res) {
        try {
            const { id } = req.params;
            const strategy = await Strategy.findByIdAndDelete(id);
            if (!strategy) {
                res.status(404).json({ error: 'Strategy not found' });
                return;
            }
            res.status(204).send();
        }
        catch (error) {
            logger.error('Error deleting strategy:', error);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};
//# sourceMappingURL=StrategyController.js.map