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
exports.StrategyRatingController = void 0;
const StrategyRatingService_1 = require("../services/StrategyRatingService");
const logger_1 = require("../utils/logger");
class StrategyRatingController {
    constructor() {
        this.strategyRatingService = new StrategyRatingService_1.StrategyRatingService();
    }
    createRating(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'User not authenticated' });
                    return;
                }
                const rating = yield this.strategyRatingService.createRating(Object.assign(Object.assign({}, req.body), { userId: req.user._id }));
                res.status(201).json(rating);
            }
            catch (error) {
                logger_1.logger.error('Error creating strategy rating:', error);
                res.status(500).json({ message: 'Error creating strategy rating' });
            }
        });
    }
    getRatings(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'User not authenticated' });
                    return;
                }
                const ratings = yield this.strategyRatingService.getRatings(req.user._id.toString());
                res.json(ratings);
            }
            catch (error) {
                logger_1.logger.error('Error getting strategy ratings:', error);
                res.status(500).json({ message: 'Error getting strategy ratings' });
            }
        });
    }
    updateRating(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'User not authenticated' });
                    return;
                }
                const rating = yield this.strategyRatingService.updateRating(req.params['id'], req.user._id.toString(), {
                    rating: req.body.rating,
                    comment: req.body.comment
                });
                res.json(rating);
            }
            catch (error) {
                logger_1.logger.error('Error updating strategy rating:', error);
                res.status(500).json({ message: 'Error updating strategy rating' });
            }
        });
    }
    deleteRating(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'User not authenticated' });
                    return;
                }
                yield this.strategyRatingService.deleteRating(req.params['id'], req.user._id.toString());
                res.json({ message: 'Strategy rating deleted successfully' });
            }
            catch (error) {
                logger_1.logger.error('Error deleting strategy rating:', error);
                res.status(500).json({ message: 'Error deleting strategy rating' });
            }
        });
    }
}
exports.StrategyRatingController = StrategyRatingController;
//# sourceMappingURL=strategyRatingController.js.map