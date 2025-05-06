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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettlementController = void 0;
const SettlementService_1 = require("../services/SettlementService");
const Enums_1 = require("../types/Enums");
const Settlement_1 = __importDefault(require("../models/Settlement"));
const logger_1 = require("../utils/logger");
const mongoose_1 = require("mongoose");
class SettlementController {
    constructor() {
        this.getSettlements = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'Unauthorized' });
                    return;
                }
                const settlements = yield Settlement_1.default.find({ userId: new mongoose_1.Types.ObjectId(req.user['id']) });
                res.json(settlements);
            }
            catch (error) {
                logger_1.logger.error('Error getting settlements:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
        this.getSettlementDetails = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'Unauthorized' });
                    return;
                }
                const settlement = yield this.settlementService.getSettlementById(req.params['id']);
                if (!settlement) {
                    res.status(404).json({ message: 'Settlement not found' });
                    return;
                }
                res.json(settlement);
            }
            catch (error) {
                res.status(500).json({ message: 'Error getting settlement details', error });
            }
        });
        this.createSettlement = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'Unauthorized' });
                    return;
                }
                const settlement = new Settlement_1.default(Object.assign(Object.assign({}, req.body), { userId: new mongoose_1.Types.ObjectId(req.user['id']) }));
                yield settlement.save();
                res.status(201).json(settlement);
            }
            catch (error) {
                logger_1.logger.error('Error creating settlement:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
        this.updateSettlementStatus = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'Unauthorized' });
                    return;
                }
                const { id } = req.params;
                const { status } = req.body;
                if (!Object.values(Enums_1.SettlementStatus).includes(status)) {
                    res.status(400).json({ error: 'Invalid status' });
                    return;
                }
                const settlement = yield Settlement_1.default.findByIdAndUpdate(new mongoose_1.Types.ObjectId(id), { status }, { new: true });
                if (!settlement) {
                    res.status(404).json({ error: 'Settlement not found' });
                    return;
                }
                res.json(settlement);
            }
            catch (error) {
                logger_1.logger.error('Error updating settlement status:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
        this.getSettlementSummary = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'Unauthorized' });
                    return;
                }
                const { startDate, endDate } = req.query;
                if (!startDate || !endDate) {
                    res.status(400).json({ message: 'Start date and end date are required' });
                    return;
                }
                const summary = yield this.settlementService.getSettlementSummary(new Date(startDate), new Date(endDate));
                res.json(summary);
            }
            catch (error) {
                res.status(500).json({ message: 'Error getting settlement summary', error });
            }
        });
        this.exportSettlements = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'Unauthorized' });
                    return;
                }
                const settlements = yield Settlement_1.default.find({ userId: new mongoose_1.Types.ObjectId(req.user['id']) });
                res.json(settlements);
            }
            catch (error) {
                logger_1.logger.error('Error exporting settlements:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
        this.generateSettlements = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'Unauthorized' });
                    return;
                }
                // 实现生成结算的逻辑
                res.json({ message: 'Settlements generated successfully' });
            }
            catch (error) {
                logger_1.logger.error('Error generating settlements:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
        this.processPayment = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'Unauthorized' });
                    return;
                }
                const { id } = req.params;
                const settlement = yield Settlement_1.default.findById(new mongoose_1.Types.ObjectId(id));
                if (!settlement) {
                    res.status(404).json({ message: 'Settlement not found' });
                    return;
                }
                // 实现处理支付的逻辑
                res.json({ message: 'Payment processed successfully' });
            }
            catch (error) {
                logger_1.logger.error('Error processing payment:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
        this.updateSettlement = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'Unauthorized' });
                    return;
                }
                const { id } = req.params;
                const settlement = yield Settlement_1.default.findByIdAndUpdate(new mongoose_1.Types.ObjectId(id), req.body, { new: true });
                if (!settlement) {
                    res.status(404).json({ message: 'Settlement not found' });
                    return;
                }
                res.json(settlement);
            }
            catch (error) {
                logger_1.logger.error('Error updating settlement:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        });
        this.settlementService = SettlementService_1.SettlementService.getInstance();
    }
}
exports.SettlementController = SettlementController;
//# sourceMappingURL=settlementController.js.map