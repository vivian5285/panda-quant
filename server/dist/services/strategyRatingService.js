"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyRatingService = void 0;
const mongoose_1 = require("mongoose");
const StrategyRating_1 = require("../models/StrategyRating");
const AppError_1 = require("../utils/AppError");
const logger_1 = require("../utils/logger");
class StrategyRatingService {
    createRating(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const ratingDoc = new StrategyRating_1.StrategyRating(Object.assign(Object.assign({}, data), { userId: new mongoose_1.Types.ObjectId(data.userId), strategyId: new mongoose_1.Types.ObjectId(data.strategyId) }));
                yield ratingDoc.save();
                return ratingDoc;
            }
            catch (error) {
                logger_1.logger.error('Error creating rating:', error);
                throw new AppError_1.AppError('Failed to create rating', 500);
            }
        });
    }
    getStrategyRatings(strategyId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield StrategyRating_1.StrategyRating.find({ strategyId: new mongoose_1.Types.ObjectId(strategyId) });
            }
            catch (error) {
                logger_1.logger.error('Error getting strategy ratings:', error);
                throw new AppError_1.AppError('Failed to get strategy ratings', 500);
            }
        });
    }
    getUserRatings(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield StrategyRating_1.StrategyRating.find({ userId: new mongoose_1.Types.ObjectId(userId) });
            }
            catch (error) {
                logger_1.logger.error('Error getting user ratings:', error);
                throw new AppError_1.AppError('Failed to get user ratings', 500);
            }
        });
    }
    getAverageRating(strategyId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield StrategyRating_1.StrategyRating.aggregate([
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
        });
    }
    updateRating(id, userId, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield StrategyRating_1.StrategyRating.findOneAndUpdate({ _id: new mongoose_1.Types.ObjectId(id), userId: new mongoose_1.Types.ObjectId(userId) }, { $set: Object.assign(Object.assign({}, data), { updatedAt: new Date() }) }, { new: true });
            }
            catch (error) {
                logger_1.logger.error('Error updating rating:', error);
                throw new AppError_1.AppError('Failed to update rating', 500);
            }
        });
    }
    deleteRating(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield StrategyRating_1.StrategyRating.deleteOne({
                    _id: new mongoose_1.Types.ObjectId(id),
                    userId: new mongoose_1.Types.ObjectId(userId)
                });
                return result.deletedCount > 0;
            }
            catch (error) {
                logger_1.logger.error('Error deleting rating:', error);
                throw new AppError_1.AppError('Failed to delete rating', 500);
            }
        });
    }
    getRatings(strategyId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const query = strategyId ? { strategyId: new mongoose_1.Types.ObjectId(strategyId) } : {};
                return yield StrategyRating_1.StrategyRating.find(query);
            }
            catch (error) {
                logger_1.logger.error('Error getting ratings:', error);
                throw new AppError_1.AppError('Failed to get ratings', 500);
            }
        });
    }
}
exports.StrategyRatingService = StrategyRatingService;
//# sourceMappingURL=StrategyRatingService.js.map