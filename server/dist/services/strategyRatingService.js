"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyRatingService = void 0;
const mongoose_1 = require("mongoose");
const strategy_rating_model_1 = __importDefault(require("../models/strategy-rating.model"));
const AppError_1 = require("../utils/AppError");
const logger_1 = require("../utils/logger");
class StrategyRatingService {
    constructor() { }
    static getInstance() {
        if (!StrategyRatingService.instance) {
            StrategyRatingService.instance = new StrategyRatingService();
        }
        return StrategyRatingService.instance;
    }
    convertToIStrategyRating(rating) {
        const ratingObject = rating.toObject();
        return {
            ...ratingObject,
            _id: ratingObject._id.toString(),
            userId: ratingObject.userId.toString(),
            strategyId: ratingObject.strategyId.toString()
        };
    }
    async createRating(data) {
        try {
            const ratingDoc = new strategy_rating_model_1.default({
                ...data,
                userId: new mongoose_1.Types.ObjectId(data.userId),
                strategyId: new mongoose_1.Types.ObjectId(data.strategyId)
            });
            await ratingDoc.save();
            return this.convertToIStrategyRating(ratingDoc);
        }
        catch (error) {
            logger_1.logger.error('Error creating rating:', error);
            throw new AppError_1.AppError('Failed to create rating', 500);
        }
    }
    async getStrategyRatings(strategyId) {
        try {
            const ratings = await strategy_rating_model_1.default.find({ strategyId: new mongoose_1.Types.ObjectId(strategyId) });
            return ratings.map(this.convertToIStrategyRating);
        }
        catch (error) {
            logger_1.logger.error('Error getting strategy ratings:', error);
            throw new AppError_1.AppError('Failed to get strategy ratings', 500);
        }
    }
    async getUserRatings(userId) {
        try {
            const ratings = await strategy_rating_model_1.default.find({ userId: new mongoose_1.Types.ObjectId(userId) });
            return ratings.map(this.convertToIStrategyRating);
        }
        catch (error) {
            logger_1.logger.error('Error getting user ratings:', error);
            throw new AppError_1.AppError('Failed to get user ratings', 500);
        }
    }
    async getAverageRating(strategyId) {
        try {
            const result = await strategy_rating_model_1.default.aggregate([
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
            const updatedRating = await strategy_rating_model_1.default.findOneAndUpdate({ _id: new mongoose_1.Types.ObjectId(id), userId: new mongoose_1.Types.ObjectId(userId) }, { $set: { ...data, updatedAt: new Date() } }, { new: true });
            return updatedRating ? this.convertToIStrategyRating(updatedRating) : null;
        }
        catch (error) {
            logger_1.logger.error('Error updating rating:', error);
            throw new AppError_1.AppError('Failed to update rating', 500);
        }
    }
    async deleteRating(id, userId) {
        try {
            const result = await strategy_rating_model_1.default.deleteOne({
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
            const ratings = await strategy_rating_model_1.default.find(query);
            return ratings.map(this.convertToIStrategyRating);
        }
        catch (error) {
            logger_1.logger.error('Error getting ratings:', error);
            throw new AppError_1.AppError('Failed to get ratings', 500);
        }
    }
}
exports.StrategyRatingService = StrategyRatingService;
//# sourceMappingURL=StrategyRatingService.js.map