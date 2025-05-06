import { logger } from '../../utils/logger';
import { Strategy } from '../../models/Strategy';
export class StrategyService {
    constructor() {
        this.strategyModel = Strategy;
    }
    static getInstance() {
        if (!StrategyService.instance) {
            StrategyService.instance = new StrategyService();
        }
        return StrategyService.instance;
    }
    async createStrategy(strategyData) {
        try {
            const strategy = new this.strategyModel(strategyData);
            const savedStrategy = await strategy.save();
            return savedStrategy.toObject();
        }
        catch (error) {
            logger.error('Error creating strategy:', error);
            throw error;
        }
    }
    async getStrategyById(id) {
        try {
            const strategy = await this.strategyModel.findById(id);
            return strategy ? strategy.toObject() : null;
        }
        catch (error) {
            logger.error('Error getting strategy by ID:', error);
            throw error;
        }
    }
    async updateStrategy(id, updates) {
        try {
            const strategy = await this.strategyModel.findByIdAndUpdate(id, updates, { new: true });
            return strategy ? strategy.toObject() : null;
        }
        catch (error) {
            logger.error('Error updating strategy:', error);
            throw error;
        }
    }
    async deleteStrategy(id) {
        try {
            const result = await this.strategyModel.findByIdAndDelete(id);
            return !!result;
        }
        catch (error) {
            logger.error('Error deleting strategy:', error);
            throw error;
        }
    }
    async getStrategiesByUserId(userId) {
        try {
            const strategies = await this.strategyModel.find({ userId });
            return strategies.map(strategy => strategy.toObject());
        }
        catch (error) {
            logger.error('Error getting strategies by user ID:', error);
            throw error;
        }
    }
}
//# sourceMappingURL=strategy.service.js.map