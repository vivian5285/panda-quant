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
exports.strategyController = void 0;
const Strategy_1 = require("../models/Strategy");
const logger_1 = require("../utils/logger");
exports.strategyController = {
    getAllStrategies(_req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const strategies = yield Strategy_1.Strategy.find();
                res.json(strategies);
            }
            catch (error) {
                logger_1.logger.error('Error getting strategies:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    },
    getStrategyById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const strategy = yield Strategy_1.Strategy.findById(id);
                if (!strategy) {
                    res.status(404).json({ error: 'Strategy not found' });
                    return;
                }
                res.json(strategy);
            }
            catch (error) {
                logger_1.logger.error('Error getting strategy:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    },
    createStrategy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const strategy = new Strategy_1.Strategy(req.body);
                yield strategy.save();
                res.status(201).json(strategy);
            }
            catch (error) {
                logger_1.logger.error('Error creating strategy:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    },
    updateStrategy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const strategy = yield Strategy_1.Strategy.findByIdAndUpdate(id, req.body, { new: true });
                if (!strategy) {
                    res.status(404).json({ error: 'Strategy not found' });
                    return;
                }
                res.json(strategy);
            }
            catch (error) {
                logger_1.logger.error('Error updating strategy:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    },
    deleteStrategy(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const strategy = yield Strategy_1.Strategy.findByIdAndDelete(id);
                if (!strategy) {
                    res.status(404).json({ error: 'Strategy not found' });
                    return;
                }
                res.status(204).send();
            }
            catch (error) {
                logger_1.logger.error('Error deleting strategy:', error);
                res.status(500).json({ error: 'Internal server error' });
            }
        });
    }
};
//# sourceMappingURL=StrategyController.js.map