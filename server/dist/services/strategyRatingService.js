"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyRatingService = void 0;
const mongoose_1 = require("mongoose");
const StrategyRating_1 = require("../models/StrategyRating");
const AppError_1 = require("../utils/AppError");
const logger_1 = require("../utils/logger");
class StrategyRatingService {
    async createRating(data) {
        try {
            const ratingDoc = new StrategyRating_1.StrategyRating({
                ...data,
                userId: new mongoose_1.Types.ObjectId(data.userId),
                strategyId: new mongoose_1.Types.ObjectId(data.strategyId)
            });
            await ratingDoc.save();
            return ratingDoc;
        }
        catch (error) {
            logger_1.logger.error('Error creating rating:', error);
            throw new AppError_1.AppError('Failed to create rating', 500);
        }
    }
    async getStrategyRatings(strategyId) {
        try {
            return await StrategyRating_1.StrategyRating.find({ strategyId: new mongoose_1.Types.ObjectId(strategyId) });
        }
        catch (error) {
            logger_1.logger.error('Error getting strategy ratings:', error);
            throw new AppError_1.AppError('Failed to get strategy ratings', 500);
        }
    }
    async getUserRatings(userId) {
        try {
            return await StrategyRating_1.StrategyRating.find({ userId: new mongoose_1.Types.ObjectId(userId) });
        }
        catch (error) {
            logger_1.logger.error('Error getting user ratings:', error);
            throw new AppError_1.AppError('Failed to get user ratings', 500);
        }
    }
    async getAverageRating(strategyId) {
        try {
            const result = await StrategyRating_1.StrategyRating.aggregate([
                { $match: { strategyId: new mongoose_1.Types.ObjectId(strategyId) } },
                {
                    $group: {
                        _id: null,
                        average: { $avg: '$rating' },
                        count: { $sum: 1 }
                    }
                }
            ]);
            return result[0] || { average: 0, count: 0 };
        }
        catch (error) {
            logger_1.logger.error('Error getting average rating:', error);
            throw new AppError_1.AppError('Failed to get average rating', 500);
        }
    }
    async updateRating(id, userId, data) {
        try {
            return await StrategyRating_1.StrategyRating.findOneAndUpdate({ _id: new mongoose_1.Types.ObjectId(id), userId: new mongoose_1.Types.ObjectId(userId) }, { $set: { ...data, updatedAt: new Date() } }, { new: true });
        }
        catch (error) {
            logger_1.logger.error('Error updating rating:', error);
            throw new AppError_1.AppError('Failed to update rating', 500);
        }
    }
    async deleteRating(id, userId) {
        try {
            const result = await StrategyRating_1.StrategyRating.deleteOne({
                _id: new mongoose_1.Types.ObjectId(id),
                userId: new mongoose_1.Types.ObjectId(userId)
            });
            return result.deletedCount > 0;
        }
        catch (error) {
            logger_1.logger.error('Error deleting rating:', error);
            throw new AppError_1.AppError('Failed to delete rating', 500);
        }
    }
    async getRatings(strategyId) {
        try {
            const query = strategyId ? { strategyId: new mongoose_1.Types.ObjectId(strategyId) } : {};
            return await StrategyRating_1.StrategyRating.find(query);
        }
        catch (error) {
            logger_1.logger.error('Error getting ratings:', error);
            throw new AppError_1.AppError('Failed to get ratings', 500);
        }
    }
}
exports.StrategyRatingService = StrategyRatingService;
//# sourceMappingURL=StrategyRatingService.js.map