"use strict";
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
        this.getSettlements = async (req, res) => {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'Unauthorized' });
                    return;
                }
                const settlements = await Settlement_1.default.find({ userId: new mongoose_1.Types.ObjectId(req.user['id']) });
                res.json(settlements);
            }
            catch (error) {
                logger_1.logger.error('Error getting settlements:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        };
        this.getSettlementDetails = async (req, res) => {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'Unauthorized' });
                    return;
                }
                const settlement = await this.settlementService.getSettlementById(req.params['id']);
                if (!settlement) {
                    res.status(404).json({ message: 'Settlement not found' });
                    return;
                }
                res.json(settlement);
            }
            catch (error) {
                res.status(500).json({ message: 'Error getting settlement details', error });
            }
        };
        this.createSettlement = async (req, res) => {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'Unauthorized' });
                    return;
                }
                const settlement = new Settlement_1.default({
                    ...req.body,
                    userId: new mongoose_1.Types.ObjectId(req.user['id'])
                });
                await settlement.save();
                res.status(201).json(settlement);
            }
            catch (error) {
                logger_1.logger.error('Error creating settlement:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        };
        this.updateSettlementStatus = async (req, res) => {
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
                const settlement = await Settlement_1.default.findByIdAndUpdate(new mongoose_1.Types.ObjectId(id), { status }, { new: true });
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
        };
        this.getSettlementSummary = async (req, res) => {
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
                const summary = await this.settlementService.getSettlementSummary(new Date(startDate), new Date(endDate));
                res.json(summary);
            }
            catch (error) {
                res.status(500).json({ message: 'Error getting settlement summary', error });
            }
        };
        this.exportSettlements = async (req, res) => {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'Unauthorized' });
                    return;
                }
                const settlements = await Settlement_1.default.find({ userId: new mongoose_1.Types.ObjectId(req.user['id']) });
                res.json(settlements);
            }
            catch (error) {
                logger_1.logger.error('Error exporting settlements:', error);
                res.status(500).json({ message: 'Internal server error' });
            }
        };
        this.generateSettlements = async (req, res) => {
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
        };
        this.processPayment = async (req, res) => {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'Unauthorized' });
                    return;
                }
                const { id } = req.params;
                const settlement = await Settlement_1.default.findById(new mongoose_1.Types.ObjectId(id));
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
        };
        this.updateSettlement = async (req, res) => {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'Unauthorized' });
                    return;
                }
                const { id } = req.params;
                const settlement = await Settlement_1.default.findByIdAndUpdate(new mongoose_1.Types.ObjectId(id), req.body, { new: true });
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
        };
        this.settlementService = SettlementService_1.SettlementService.getInstance();
    }
}
exports.SettlementController = SettlementController;
//# sourceMappingURL=SettlementController.js.map