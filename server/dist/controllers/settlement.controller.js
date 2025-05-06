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
exports.SettlementController = void 0;
const SettlementService_1 = require("../services/SettlementService");
const Enums_1 = require("../types/Enums");
const logger_1 = require("../utils/logger");
const mongoose_1 = require("mongoose");
class SettlementController {
    constructor() {
        this.getSettlements = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const { startDate, endDate, status } = req.query;
                const userId = ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) ? new mongoose_1.Types.ObjectId(req.user.id) : undefined;
                const filter = {
                    startDate: startDate ? new Date(startDate) : undefined,
                    endDate: endDate ? new Date(endDate) : undefined,
                    userId,
                    status: status
                };
                const result = yield this.settlementService.getSettlements(filter);
                res.json(result);
            }
            catch (error) {
                logger_1.logger.error('Error getting settlements:', error);
                next(error);
            }
        });
        this.getSettlementById = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const settlement = yield this.settlementService.getSettlementById(id);
                if (!settlement) {
                    res.status(404).json({ message: 'Settlement not found' });
                    return;
                }
                res.json(settlement);
            }
            catch (error) {
                logger_1.logger.error('Error getting settlement by id:', error);
                next(error);
            }
        });
        this.createSettlement = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, amount, type, metadata } = req.body;
                if (!userId || !amount || !type) {
                    res.status(400).json({ message: 'Missing required fields: userId, amount, type' });
                    return;
                }
                const settlement = yield this.settlementService.createSettlement(userId, amount, type, metadata);
                res.status(201).json(settlement);
            }
            catch (error) {
                logger_1.logger.error('Error creating settlement:', error);
                next(error);
            }
        });
        this.updateSettlementStatus = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const { status } = req.body;
                const settlement = yield this.settlementService.updateSettlementStatus(id, status);
                if (!settlement) {
                    res.status(404).json({ message: 'Settlement not found' });
                    return;
                }
                res.json(settlement);
            }
            catch (error) {
                logger_1.logger.error('Error updating settlement status:', error);
                next(error);
            }
        });
        this.getSettlementSummary = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { startDate, endDate } = req.query;
                if (!startDate || !endDate) {
                    res.status(400).json({ message: 'Start date and end date are required' });
                    return;
                }
                const summary = yield this.settlementService.getSettlementSummary(new Date(startDate), new Date(endDate));
                res.json(summary);
            }
            catch (error) {
                logger_1.logger.error('Error getting settlement summary:', error);
                next(error);
            }
        });
        this.getPendingSettlements = (_req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const settlements = yield this.settlementService.getSettlements({ status: Enums_1.SettlementStatus.PENDING });
                res.json(settlements);
            }
            catch (error) {
                logger_1.logger.error('Error getting pending settlements:', error);
                next(error);
            }
        });
        this.getSettlementsByType = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { type } = req.params;
                const settlements = yield this.settlementService.getSettlements({
                    status: Enums_1.SettlementStatus.PENDING,
                    startDate: new Date(0),
                    endDate: new Date()
                });
                const filteredSettlements = settlements.settlements.filter(settlement => settlement.type === type);
                res.json({
                    settlements: filteredSettlements,
                    total: filteredSettlements.length
                });
            }
            catch (error) {
                logger_1.logger.error('Error getting settlements by type:', error);
                next(error);
            }
        });
        this.exportSettlements = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            var _b;
            try {
                const { startDate, endDate, status } = req.query;
                const userId = ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id) ? new mongoose_1.Types.ObjectId(req.user.id) : undefined;
                const filter = {
                    startDate: startDate ? new Date(startDate) : undefined,
                    endDate: endDate ? new Date(endDate) : undefined,
                    userId,
                    status: status
                };
                const csv = yield this.settlementService.exportSettlements(filter);
                res.setHeader('Content-Type', 'text/csv');
                res.setHeader('Content-Disposition', 'attachment; filename=settlements.csv');
                res.send(csv);
            }
            catch (error) {
                logger_1.logger.error('Error exporting settlements:', error);
                next(error);
            }
        });
        this.generateSettlements = (_req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                yield this.settlementService.processPendingCommissions();
                res.status(201).json({ message: 'Settlements generated successfully' });
            }
            catch (error) {
                logger_1.logger.error('Error generating settlements:', error);
                next(error);
            }
        });
        this.processPayment = (req, res, next) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const settlement = yield this.settlementService.processPayment(id);
                if (!settlement) {
                    res.status(404).json({ message: 'Settlement not found' });
                    return;
                }
                res.json(settlement);
            }
            catch (error) {
                logger_1.logger.error('Error processing payment:', error);
                next(error);
            }
        });
        this.settlementService = SettlementService_1.SettlementService.getInstance();
    }
}
exports.SettlementController = SettlementController;
//# sourceMappingURL=settlement.controller.js.map