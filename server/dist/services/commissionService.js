"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommissionService = void 0;
const Commission_1 = require("../models/Commission");
const CommissionRule_1 = __importDefault(require("../models/CommissionRule"));
const logger_1 = require("../utils/logger");
class CommissionService {
    constructor() { }
    static getInstance() {
        if (!CommissionService.instance) {
            CommissionService.instance = new CommissionService();
        }
        return CommissionService.instance;
    }
    convertToICommission(commission) {
        const commissionObject = commission.toObject();
        return {
            ...commissionObject,
            _id: commissionObject._id.toString(),
            userId: commissionObject.userId.toString()
        };
    }
    convertToICommissionRule(rule) {
        const ruleObject = rule.toObject();
        return {
            ...ruleObject,
            _id: ruleObject._id.toString(),
            name: ruleObject.name || '',
            description: ruleObject.description || '',
            type: ruleObject.type || '',
            value: ruleObject.value || 0,
            conditions: ruleObject.conditions || {},
            isActive: ruleObject.isActive || true,
            createdAt: ruleObject.createdAt || new Date(),
            updatedAt: ruleObject.updatedAt || new Date()
        };
    }
    async createCommission(commissionData) {
        try {
            const commission = new Commission_1.Commission(commissionData);
            const savedCommission = await commission.save();
            return this.convertToICommission(savedCommission);
        }
        catch (error) {
            logger_1.logger.error('Error creating commission:', error);
            throw error;
        }
    }
    async getCommissionById(id) {
        try {
            const commission = await Commission_1.Commission.findById(id);
            return commission ? this.convertToICommission(commission) : null;
        }
        catch (error) {
            logger_1.logger.error('Error getting commission by id:', error);
            throw error;
        }
    }
    async getCommissionByUserId(userId) {
        try {
            const commission = await Commission_1.Commission.findOne({ userId });
            return commission ? this.convertToICommission(commission) : null;
        }
        catch (error) {
            logger_1.logger.error('Error getting commission by user id:', error);
            throw error;
        }
    }
    async updateCommission(id, updateData) {
        try {
            const commission = await Commission_1.Commission.findByIdAndUpdate(id, { $set: updateData }, { new: true });
            return commission ? this.convertToICommission(commission) : null;
        }
        catch (error) {
            logger_1.logger.error('Error updating commission:', error);
            throw error;
        }
    }
    async deleteCommission(id) {
        try {
            const result = await Commission_1.Commission.findByIdAndDelete(id);
            return !!result;
        }
        catch (error) {
            logger_1.logger.error('Error deleting commission:', error);
            throw error;
        }
    }
    async getCommissionsByUserId(userId) {
        try {
            const commissions = await Commission_1.Commission.find({ userId });
            return commissions.map(commission => this.convertToICommission(commission));
        }
        catch (error) {
            logger_1.logger.error('Error getting commissions by user id:', error);
            throw error;
        }
    }
    async getCommissionsByStatus(status) {
        try {
            const commissions = await Commission_1.Commission.find({ status });
            return commissions.map(commission => this.convertToICommission(commission));
        }
        catch (error) {
            logger_1.logger.error('Error getting commissions by status:', error);
            throw error;
        }
    }
    async getCommissionsByDateRange(startDate, endDate) {
        try {
            const commissions = await Commission_1.Commission.find({
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            });
            return commissions.map(commission => this.convertToICommission(commission));
        }
        catch (error) {
            logger_1.logger.error('Error getting commissions by date range:', error);
            throw error;
        }
    }
    async getCommissionsByType(type) {
        try {
            const commissions = await Commission_1.Commission.find({ type });
            return commissions.map(commission => this.convertToICommission(commission));
        }
        catch (error) {
            logger_1.logger.error('Error getting commissions by type:', error);
            throw error;
        }
    }
    async getCommissionsByUserAndDateRange(userId, startDate, endDate) {
        try {
            const commissions = await Commission_1.Commission.find({
                userId,
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            });
            return commissions.map(commission => this.convertToICommission(commission));
        }
        catch (error) {
            logger_1.logger.error('Error getting commissions by user and date range:', error);
            throw error;
        }
    }
    async getCommissionsByUserAndStatus(userId, status) {
        try {
            const commissions = await Commission_1.Commission.find({ userId, status });
            return commissions.map(commission => this.convertToICommission(commission));
        }
        catch (error) {
            logger_1.logger.error('Error getting commissions by user and status:', error);
            throw error;
        }
    }
    async getCommissionsByUserAndType(userId, type) {
        try {
            const commissions = await Commission_1.Commission.find({ userId, type });
            return commissions.map(commission => this.convertToICommission(commission));
        }
        catch (error) {
            logger_1.logger.error('Error getting commissions by user and type:', error);
            throw error;
        }
    }
    async getCommissionsByUserAndDateRangeAndStatus(userId, startDate, endDate, status) {
        try {
            const commissions = await Commission_1.Commission.find({
                userId,
                status,
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            });
            return commissions.map(commission => this.convertToICommission(commission));
        }
        catch (error) {
            logger_1.logger.error('Error getting commissions by user, date range and status:', error);
            throw error;
        }
    }
    async getCommissionsByUserAndDateRangeAndType(userId, startDate, endDate, type) {
        try {
            const commissions = await Commission_1.Commission.find({
                userId,
                type,
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            });
            return commissions.map(commission => this.convertToICommission(commission));
        }
        catch (error) {
            logger_1.logger.error('Error getting commissions by user, date range and type:', error);
            throw error;
        }
    }
    async getCommissionsByUserAndDateRangeAndStatusAndType(userId, startDate, endDate, status, type) {
        try {
            const commissions = await Commission_1.Commission.find({
                userId,
                status,
                type,
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            });
            return commissions.map(commission => this.convertToICommission(commission));
        }
        catch (error) {
            logger_1.logger.error('Error getting commissions by user, date range, status and type:', error);
            throw error;
        }
    }
    async getCommissionsByDateRangeAndStatus(startDate, endDate, status) {
        try {
            const commissions = await Commission_1.Commission.find({
                status,
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            });
            return commissions.map(commission => this.convertToICommission(commission));
        }
        catch (error) {
            logger_1.logger.error('Error getting commissions by date range and status:', error);
            throw error;
        }
    }
    async getCommissionsByDateRangeAndType(startDate, endDate, type) {
        try {
            const commissions = await Commission_1.Commission.find({
                type,
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            });
            return commissions.map(commission => this.convertToICommission(commission));
        }
        catch (error) {
            logger_1.logger.error('Error getting commissions by date range and type:', error);
            throw error;
        }
    }
    async getCommissionsByDateRangeAndStatusAndType(startDate, endDate, status, type) {
        try {
            const commissions = await Commission_1.Commission.find({
                status,
                type,
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            });
            return commissions.map(commission => this.convertToICommission(commission));
        }
        catch (error) {
            logger_1.logger.error('Error getting commissions by date range, status and type:', error);
            throw error;
        }
    }
    async getCommissionsByStatusAndType(status, type) {
        try {
            const commissions = await Commission_1.Commission.find({ status, type });
            return commissions.map(commission => this.convertToICommission(commission));
        }
        catch (error) {
            logger_1.logger.error('Error getting commissions by status and type:', error);
            throw error;
        }
    }
    async getCommissionsByUserAndStatusAndType(userId, status, type) {
        try {
            const commissions = await Commission_1.Commission.find({ userId, status, type });
            return commissions.map(commission => this.convertToICommission(commission));
        }
        catch (error) {
            logger_1.logger.error('Error getting commissions by user, status and type:', error);
            throw error;
        }
    }
    async getCommissionsByUserAndDateRangeAndStatusAndTypeAndAmount(userId, startDate, endDate, status, type, amount) {
        try {
            const commissions = await Commission_1.Commission.find({
                userId,
                status,
                type,
                amount,
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            });
            return commissions.map(commission => this.convertToICommission(commission));
        }
        catch (error) {
            logger_1.logger.error('Error getting commissions by user, date range, status, type and amount:', error);
            throw error;
        }
    }
    async getCommissionsByDateRangeAndStatusAndTypeAndAmount(startDate, endDate, status, type, amount) {
        try {
            const commissions = await Commission_1.Commission.find({
                status,
                type,
                amount,
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            });
            return commissions.map(commission => this.convertToICommission(commission));
        }
        catch (error) {
            logger_1.logger.error('Error getting commissions by date range, status, type and amount:', error);
            throw error;
        }
    }
    async getCommissionsByStatusAndTypeAndAmount(status, type, amount) {
        try {
            const commissions = await Commission_1.Commission.find({ status, type, amount });
            return commissions.map(commission => this.convertToICommission(commission));
        }
        catch (error) {
            logger_1.logger.error('Error getting commissions by status, type and amount:', error);
            throw error;
        }
    }
    async getCommissionsByUserAndStatusAndTypeAndAmount(userId, status, type, amount) {
        try {
            const commissions = await Commission_1.Commission.find({ userId, status, type, amount });
            return commissions.map(commission => this.convertToICommission(commission));
        }
        catch (error) {
            logger_1.logger.error('Error getting commissions by user, status, type and amount:', error);
            throw error;
        }
    }
    async getCommissionsByUserAndDateRangeAndStatusAndTypeAndAmountAndCurrency(userId, startDate, endDate, status, type, amount, currency) {
        try {
            const commissions = await Commission_1.Commission.find({
                userId,
                status,
                type,
                amount,
                currency,
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            });
            return commissions.map(commission => this.convertToICommission(commission));
        }
        catch (error) {
            logger_1.logger.error('Error getting commissions by user, date range, status, type, amount and currency:', error);
            throw error;
        }
    }
    async getCommissionsByDateRangeAndStatusAndTypeAndAmountAndCurrency(startDate, endDate, status, type, amount, currency) {
        try {
            const commissions = await Commission_1.Commission.find({
                status,
                type,
                amount,
                currency,
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            });
            return commissions.map(commission => this.convertToICommission(commission));
        }
        catch (error) {
            logger_1.logger.error('Error getting commissions by date range, status, type, amount and currency:', error);
            throw error;
        }
    }
    async getCommissionsByStatusAndTypeAndAmountAndCurrency(status, type, amount, currency) {
        try {
            const commissions = await Commission_1.Commission.find({ status, type, amount, currency });
            return commissions.map(commission => this.convertToICommission(commission));
        }
        catch (error) {
            logger_1.logger.error('Error getting commissions by status, type, amount and currency:', error);
            throw error;
        }
    }
    async getCommissionsByUserAndStatusAndTypeAndAmountAndCurrency(userId, status, type, amount, currency) {
        try {
            const commissions = await Commission_1.Commission.find({ userId, status, type, amount, currency });
            return commissions.map(commission => this.convertToICommission(commission));
        }
        catch (error) {
            logger_1.logger.error('Error getting commissions by user, status, type, amount and currency:', error);
            throw error;
        }
    }
    async getCommissionsByUserAndDateRangeAndStatusAndTypeAndAmountAndCurrencyAndDescription(userId, startDate, endDate, status, type, amount, currency, description) {
        try {
            const commissions = await Commission_1.Commission.find({
                userId,
                status,
                type,
                amount,
                currency,
                description,
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            });
            return commissions.map(commission => this.convertToICommission(commission));
        }
        catch (error) {
            logger_1.logger.error('Error getting commissions by user, date range, status, type, amount, currency and description:', error);
            throw error;
        }
    }
    async getCommissionsByDateRangeAndStatusAndTypeAndAmountAndCurrencyAndDescription(startDate, endDate, status, type, amount, currency, description) {
        try {
            const commissions = await Commission_1.Commission.find({
                status,
                type,
                amount,
                currency,
                description,
                createdAt: {
                    $gte: startDate,
                    $lte: endDate
                }
            });
            return commissions.map(commission => this.convertToICommission(commission));
        }
        catch (error) {
            logger_1.logger.error('Error getting commissions by date range, status, type, amount, currency and description:', error);
            throw error;
        }
    }
    async getCommissionsByStatusAndTypeAndAmountAndCurrencyAndDescription(status, type, amount, currency, description) {
        try {
            const commissions = await Commission_1.Commission.find({ status, type, amount, currency, description });
            return commissions.map(commission => this.convertToICommission(commission));
        }
        catch (error) {
            logger_1.logger.error('Error getting commissions by status, type, amount, currency and description:', error);
            throw error;
        }
    }
    async getCommissionsByUserAndStatusAndTypeAndAmountAndCurrencyAndDescription(userId, status, type, amount, currency, description) {
        try {
            const commissions = await Commission_1.Commission.find({ userId, status, type, amount, currency, description });
            return commissions.map(commission => this.convertToICommission(commission));
        }
        catch (error) {
            logger_1.logger.error('Error getting commissions by user, status, type, amount, currency and description:', error);
            throw error;
        }
    }
    async getCommissionRules() {
        try {
            const rules = await CommissionRule_1.default.find().sort({ createdAt: -1 });
            return rules.map(rule => this.convertToICommissionRule(rule));
        }
        catch (error) {
            logger_1.logger.error('Error getting commission rules:', error);
            throw error;
        }
    }
    async createCommissionRule(data) {
        try {
            const rule = new CommissionRule_1.default(data);
            const savedRule = await rule.save();
            return this.convertToICommissionRule(savedRule);
        }
        catch (error) {
            logger_1.logger.error('Error creating commission rule:', error);
            throw error;
        }
    }
    async updateCommissionRule(rule) {
        try {
            const updatedRule = await CommissionRule_1.default.findByIdAndUpdate(rule._id, { $set: rule }, { new: true });
            return updatedRule ? this.convertToICommissionRule(updatedRule) : null;
        }
        catch (error) {
            logger_1.logger.error('Error updating commission rule:', error);
            throw error;
        }
    }
    async deleteCommissionRule(id) {
        try {
            const result = await CommissionRule_1.default.findByIdAndDelete(id);
            return !!result;
        }
        catch (error) {
            logger_1.logger.error('Error deleting commission rule:', error);
            throw error;
        }
    }
}
exports.CommissionService = CommissionService;
//# sourceMappingURL=CommissionService.js.map