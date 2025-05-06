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
exports.StrategyController = void 0;
const logger_1 = require("../utils/logger");
const StrategyService_1 = require("../services/StrategyService");
class StrategyController {
    constructor() {
        this.getStrategies = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'User not authenticated' });
                    return;
                }
                const strategies = yield this.strategyService.getStrategies(req.user._id.toString());
                res.json(strategies);
            }
            catch (error) {
                logger_1.logger.error('Error getting strategies:', error);
                res.status(500).json({ message: 'Error getting strategies', error: error.message });
            }
        });
        this.getStrategy = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const strategy = yield this.strategyService.getStrategy(req.params['id']);
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
        });
        this.createStrategy = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'User not authenticated' });
                    return;
                }
                const strategy = yield this.strategyService.createStrategy(Object.assign(Object.assign({}, req.body), { userId: req.user._id.toString() }));
                res.status(201).json({ message: 'Strategy created successfully', strategy });
            }
            catch (error) {
                logger_1.logger.error('Error creating strategy:', error);
                res.status(500).json({ message: 'Error creating strategy', error });
            }
        });
        this.updateStrategy = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const strategy = yield this.strategyService.updateStrategy(req.params['id'], req.body);
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
        });
        this.deleteStrategy = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.strategyService.deleteStrategy(req.params['id']);
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
        });
        this.strategyService = StrategyService_1.StrategyService.getInstance();
    }
}
exports.StrategyController = StrategyController;
const strategyController = new StrategyController();
exports.default = strategyController;
//# sourceMappingURL=Strategy.js.map