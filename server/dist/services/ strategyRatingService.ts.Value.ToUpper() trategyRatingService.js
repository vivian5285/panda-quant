"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyRatingService = void 0;
const StrategyRating_1 = require("../models/StrategyRating");
const logger_1 = require("../utils/logger");
class StrategyRatingService {
    constructor() { }
    static getInstance() {
        if (!StrategyRatingService.instance) {
            StrategyRatingService.instance = new StrategyRatingService();
        }
        return StrategyRatingService.instance;
    }
    async createRating(data) {
        try {
            const rating = new StrategyRating_1.StrategyRating(data);
            await rating.save();
            return rating;
        }
        catch (error) {
            logger_1.logger.error('Error creating strategy rating:', error);
            throw error;
        }
    }
    async getRatings(strategyId) {
        try {
            const ratings = await StrategyRating_1.StrategyRating.find({ strategyId }).sort({ createdAt: -1 });
            return ratings;
        }
        catch (error) {
            logger_1.logger.error('Error getting strategy ratings:', error);
            throw error;
        }
    }
    async getUserRatings(userId) {
        try {
            const ratings = await StrategyRating_1.StrategyRating.find({ userId });
            return ratings.map(rating => rating.toObject());
        }
        catch (error) {
            logger_1.logger.error('Error getting user ratings:', error);
            throw error;
        }
    }
    async getAverageRating(strategyId) {
        try {
            const ratings = await StrategyRating_1.StrategyRating.find({ strategyId });
            const average = ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length;
            return {
                average: isNaN(average) ? 0 : average,
                count: ratings.length
            };
        }
        catch (error) {
            logger_1.logger.error('Error getting average rating:', error);
            throw error;
        }
    }
    async updateRating(id, data) {
        try {
            const rating = await StrategyRating_1.StrategyRating.findOneAndUpdate({ _id: id, userId: data.userId }, { $set: data }, { new: true });
            if (!rating) {
                throw new Error('Rating not found or unauthorized');
            }
            return rating.toObject();
        }
        catch (error) {
            logger_1.logger.error('Error updating rating:', error);
            throw error;
        }
    }
    async deleteRating(id, userId) {
        try {
            const result = await StrategyRating_1.StrategyRating.findOneAndDelete({ _id: id, userId });
            if (!result) {
                throw new Error('Rating not found or unauthorized');
            }
        }
        catch (error) {
            logger_1.logger.error('Error deleting rating:', error);
            throw error;
        }
    }
    async getRating(id) {
        try {
            const rating = await StrategyRating_1.StrategyRating.findById(id);
            return rating ? rating.toObject() : null;
        }
        catch (error) {
            logger_1.logger.error('Error getting rating:', error);
            throw error;
        }
    }
}
exports.StrategyRatingService = StrategyRatingService;
//# sourceMappingURL=%20strategyRatingService.ts.Value.ToUpper()%20trategyRatingService.js.map