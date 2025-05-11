"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyRatingController = void 0;
const StrategyRatingService_1 = require("../types/../services/StrategyRatingService");
const logger_1 = require("../utils/logger");
class StrategyRatingController {
    constructor() {
        this.strategyRatingService = StrategyRatingService_1.StrategyRatingService.getInstance();
    }
    async createRating(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'User not authenticated' });
                return;
            }
            const rating = await this.strategyRatingService.createRating({
                ...req.body,
                userId: req.user._id
            });
            res.status(201).json(rating);
        }
        catch (error) {
            logger_1.logger.error('Error creating strategy rating:', error);
            res.status(500).json({ message: 'Error creating strategy rating' });
        }
    }
    async getRatings(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'User not authenticated' });
                return;
            }
            const ratings = await this.strategyRatingService.getRatings(req.user._id.toString());
            res.json(ratings);
        }
        catch (error) {
            logger_1.logger.error('Error getting strategy ratings:', error);
            res.status(500).json({ message: 'Error getting strategy ratings' });
        }
    }
    async updateRating(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'User not authenticated' });
                return;
            }
            const rating = await this.strategyRatingService.updateRating(req.params['id'], req.user._id.toString(), {
                rating: req.body.rating,
                comment: req.body.comment
            });
            res.json(rating);
        }
        catch (error) {
            logger_1.logger.error('Error updating strategy rating:', error);
            res.status(500).json({ message: 'Error updating strategy rating' });
        }
    }
    async deleteRating(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'User not authenticated' });
                return;
            }
            await this.strategyRatingService.deleteRating(req.params['id'], req.user._id.toString());
            res.json({ message: 'Strategy rating deleted successfully' });
        }
        catch (error) {
            logger_1.logger.error('Error deleting strategy rating:', error);
            res.status(500).json({ message: 'Error deleting strategy rating' });
        }
    }
}
exports.StrategyRatingController = StrategyRatingController;
//# sourceMappingURL=StrategyRatingController.js.map