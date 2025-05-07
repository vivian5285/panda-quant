"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionController = void 0;
const CommissionService_1 = require("../services/CommissionService");
const logger_1 = require("../utils/logger");
class CommissionController {
    constructor() {
        this.getCommissionById = async (req, res) => {
            try {
                const { id } = req.params;
                const commission = await this.commissionService.getCommissionById(id.toString());
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
        };
        this.getCommissionByUserId = async (req, res) => {
            try {
                const { userId } = req.params;
                const commission = await this.commissionService.getCommissionByUserId(userId.toString());
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
        };
        this.createCommission = async (req, res) => {
            try {
                const { userId, amount, type, metadata } = req.body;
                const commission = await this.commissionService.createCommission({
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
        };
        this.updateCommission = async (req, res) => {
            try {
                const { id } = req.params;
                const commission = await this.commissionService.updateCommission(id.toString(), req.body);
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
        };
        this.deleteCommission = async (req, res) => {
            try {
                const { id } = req.params;
                const success = await this.commissionService.deleteCommission(id.toString());
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
        };
        this.getCommissionRules = async (_req, res) => {
            try {
                const rules = await this.commissionService.getCommissionRules();
                res.json(rules);
            }
            catch (error) {
                logger_1.logger.error('Error getting commission rules:', error);
                res.status(500).json({ message: 'Error getting commission rules', error });
            }
        };
        this.createCommissionRule = async (req, res) => {
            try {
                const rule = await this.commissionService.createCommissionRule(req.body);
                res.status(201).json(rule);
            }
            catch (error) {
                logger_1.logger.error('Error creating commission rule:', error);
                res.status(500).json({ message: 'Error creating commission rule', error });
            }
        };
        this.updateCommissionRule = async (req, res) => {
            try {
                const { id } = req.params;
                const rule = await this.commissionService.updateCommissionRule(id, req.body);
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
        };
        this.deleteCommissionRule = async (req, res) => {
            try {
                const { id } = req.params;
                const success = await this.commissionService.deleteCommissionRule(id);
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
        };
        this.getCommissionsByType = async (req, res) => {
            try {
                const { type } = req.params;
                const commissions = await this.commissionService.getCommissionsByType(type);
                res.json(commissions);
            }
            catch (error) {
                logger_1.logger.error('Error getting commissions by type:', error);
                res.status(500).json({ message: 'Error getting commissions by type', error });
            }
        };
        this.getCommissionsByStatusAndTypeAndAmount = async (req, res) => {
            try {
                const { status, type, amount } = req.query;
                const commissions = await this.commissionService.getCommissionsByStatusAndTypeAndAmount(status, type, Number(amount));
                res.json(commissions);
            }
            catch (error) {
                logger_1.logger.error('Error getting commissions by status, type and amount:', error);
                res.status(500).json({ message: 'Error getting commissions by status, type and amount', error });
            }
        };
        this.getCommissionsByStatusAndTypeAndAmountAndCurrency = async (req, res) => {
            try {
                const { status, type, amount, currency } = req.query;
                const commissions = await this.commissionService.getCommissionsByStatusAndTypeAndAmountAndCurrency(status, type, Number(amount), currency);
                res.json(commissions);
            }
            catch (error) {
                logger_1.logger.error('Error getting commissions by status, type, amount and currency:', error);
                res.status(500).json({ message: 'Error getting commissions by status, type, amount and currency', error });
            }
        };
        this.getCommissionsByUserAndStatusAndTypeAndAmountAndCurrency = async (req, res) => {
            try {
                const { userId, status, type, amount, currency } = req.query;
                const commissions = await this.commissionService.getCommissionsByUserAndStatusAndTypeAndAmountAndCurrency(userId, status, type, Number(amount), currency);
                res.json(commissions);
            }
            catch (error) {
                logger_1.logger.error('Error getting commissions by user, status, type, amount and currency:', error);
                res.status(500).json({ message: 'Error getting commissions by user, status, type, amount and currency', error });
            }
        };
        this.getCommissionsByStatusAndTypeAndAmountAndCurrencyAndDescription = async (req, res) => {
            try {
                const { status, type, amount, currency, description } = req.query;
                const commissions = await this.commissionService.getCommissionsByStatusAndTypeAndAmountAndCurrencyAndDescription(status, type, Number(amount), currency, description);
                res.json(commissions);
            }
            catch (error) {
                logger_1.logger.error('Error getting commissions by status, type, amount, currency and description:', error);
                res.status(500).json({ message: 'Error getting commissions by status, type, amount, currency and description', error });
            }
        };
        this.commissionService = CommissionService_1.CommissionService.getInstance();
    }
}
exports.CommissionController = CommissionController;
//# sourceMappingURL=CommissionController.js.map