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
exports.CommissionController = void 0;
const CommissionService_1 = require("../services/CommissionService");
const logger_1 = require("../utils/logger");
const mongoose_1 = require("mongoose");
class CommissionController {
    constructor() {
        this.getCommissionById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const commission = yield this.commissionService.getCommissionById(id.toString());
                if (!commission) {
                    res.status(404).json({ message: 'Commission not found' });
                    return;
                }
                res.json(commission);
            }
            catch (error) {
                logger_1.logger.error('Error getting commission details:', error);
                res.status(500).json({ message: 'Error getting commission details', error });
            }
        });
        this.getCommissionByUserId = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId } = req.params;
                const commission = yield this.commissionService.getCommissionByUserId(userId.toString());
                if (!commission) {
                    res.status(404).json({ message: 'Commission not found' });
                    return;
                }
                res.json(commission);
            }
            catch (error) {
                logger_1.logger.error('Error getting commission by user id:', error);
                res.status(500).json({ message: 'Error getting commission by user id', error });
            }
        });
        this.createCommission = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, amount, type, metadata } = req.body;
                const commission = yield this.commissionService.createCommission({
                    userId: userId.toString(),
                    amount,
                    type,
                    metadata
                });
                res.status(201).json(commission);
            }
            catch (error) {
                logger_1.logger.error('Error creating commission:', error);
                res.status(500).json({ message: 'Error creating commission', error });
            }
        });
        this.updateCommission = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const commission = yield this.commissionService.updateCommission(id.toString(), req.body);
                if (!commission) {
                    res.status(404).json({ message: 'Commission not found' });
                    return;
                }
                res.json(commission);
            }
            catch (error) {
                logger_1.logger.error('Error updating commission:', error);
                res.status(500).json({ message: 'Error updating commission', error });
            }
        });
        this.deleteCommission = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const success = yield this.commissionService.deleteCommission(id.toString());
                if (!success) {
                    res.status(404).json({ message: 'Commission not found' });
                    return;
                }
                res.json({ message: 'Commission deleted successfully' });
            }
            catch (error) {
                logger_1.logger.error('Error deleting commission:', error);
                res.status(500).json({ message: 'Error deleting commission', error });
            }
        });
        this.getCommissionRules = (_req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const rules = yield this.commissionService.getCommissionRules();
                res.json(rules);
            }
            catch (error) {
                logger_1.logger.error('Error getting commission rules:', error);
                res.status(500).json({ message: 'Error getting commission rules', error });
            }
        });
        this.createCommissionRule = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const rule = yield this.commissionService.createCommissionRule(req.body);
                res.status(201).json(rule);
            }
            catch (error) {
                logger_1.logger.error('Error creating commission rule:', error);
                res.status(500).json({ message: 'Error creating commission rule', error });
            }
        });
        this.updateCommissionRule = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const rule = yield this.commissionService.updateCommissionRule(Object.assign({ _id: new mongoose_1.Types.ObjectId(id) }, req.body));
                if (!rule) {
                    res.status(404).json({ message: 'Commission rule not found' });
                    return;
                }
                res.json(rule);
            }
            catch (error) {
                logger_1.logger.error('Error updating commission rule:', error);
                res.status(500).json({ message: 'Error updating commission rule', error });
            }
        });
        this.deleteCommissionRule = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const success = yield this.commissionService.deleteCommissionRule(new mongoose_1.Types.ObjectId(id));
                if (!success) {
                    res.status(404).json({ message: 'Commission rule not found' });
                    return;
                }
                res.json({ message: 'Commission rule deleted successfully' });
            }
            catch (error) {
                logger_1.logger.error('Error deleting commission rule:', error);
                res.status(500).json({ message: 'Error deleting commission rule', error });
            }
        });
        this.getCommissionsByType = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { type } = req.params;
                const commissions = yield this.commissionService.getCommissionsByType(type);
                res.json(commissions);
            }
            catch (error) {
                logger_1.logger.error('Error getting commissions by type:', error);
                res.status(500).json({ message: 'Error getting commissions by type', error });
            }
        });
        this.getCommissionsByStatusAndTypeAndAmount = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { status, type, amount } = req.query;
                const commissions = yield this.commissionService.getCommissionsByStatusAndTypeAndAmount(status, type, Number(amount));
                res.json(commissions);
            }
            catch (error) {
                logger_1.logger.error('Error getting commissions by status, type and amount:', error);
                res.status(500).json({ message: 'Error getting commissions by status, type and amount', error });
            }
        });
        this.getCommissionsByStatusAndTypeAndAmountAndCurrency = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { status, type, amount, currency } = req.query;
                const commissions = yield this.commissionService.getCommissionsByStatusAndTypeAndAmountAndCurrency(status, type, Number(amount), currency);
                res.json(commissions);
            }
            catch (error) {
                logger_1.logger.error('Error getting commissions by status, type, amount and currency:', error);
                res.status(500).json({ message: 'Error getting commissions by status, type, amount and currency', error });
            }
        });
        this.getCommissionsByUserAndStatusAndTypeAndAmountAndCurrency = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userId, status, type, amount, currency } = req.query;
                const commissions = yield this.commissionService.getCommissionsByUserAndStatusAndTypeAndAmountAndCurrency(userId, status, type, Number(amount), currency);
                res.json(commissions);
            }
            catch (error) {
                logger_1.logger.error('Error getting commissions by user, status, type, amount and currency:', error);
                res.status(500).json({ message: 'Error getting commissions by user, status, type, amount and currency', error });
            }
        });
        this.getCommissionsByStatusAndTypeAndAmountAndCurrencyAndDescription = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { status, type, amount, currency, description } = req.query;
                const commissions = yield this.commissionService.getCommissionsByStatusAndTypeAndAmountAndCurrencyAndDescription(status, type, Number(amount), currency, description);
                res.json(commissions);
            }
            catch (error) {
                logger_1.logger.error('Error getting commissions by status, type, amount, currency and description:', error);
                res.status(500).json({ message: 'Error getting commissions by status, type, amount, currency and description', error });
            }
        });
        this.commissionService = CommissionService_1.CommissionService.getInstance();
    }
}
exports.CommissionController = CommissionController;
//# sourceMappingURL=commissionController.js.map