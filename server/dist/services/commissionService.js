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
        return Object.assign(Object.assign({}, commissionObject), { _id: commissionObject._id.toString(), userId: commissionObject.userId.toString(), type: commissionObject.type, status: commissionObject.status, referenceId: commissionObject.referenceId.toString() });
    }
    convertToICommissionRule(rule) {
        var _a;
        const ruleObject = rule.toObject();
        return Object.assign(Object.assign({}, ruleObject), { _id: ruleObject._id.toString(), name: ruleObject.name || '', description: ruleObject.description || '', type: ruleObject.type, value: ruleObject.value || 0, conditions: ruleObject.conditions || {}, isActive: (_a = ruleObject.isActive) !== null && _a !== void 0 ? _a : true, createdAt: ruleObject.createdAt || new Date(), updatedAt: ruleObject.updatedAt || new Date() });
    }
    createCommission(commissionData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commission = new Commission_1.Commission(commissionData);
                const savedCommission = yield commission.save();
                return this.convertToICommission(savedCommission);
            }
            catch (error) {
                logger_1.logger.error('Error creating commission:', error);
                throw error;
            }
        });
    }
    getCommissionById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commission = yield Commission_1.Commission.findById(id);
                return commission ? this.convertToICommission(commission) : null;
            }
            catch (error) {
                logger_1.logger.error('Error getting commission by id:', error);
                throw error;
            }
        });
    }
    getCommissionByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commission = yield Commission_1.Commission.findOne({ userId });
                return commission ? this.convertToICommission(commission) : null;
            }
            catch (error) {
                logger_1.logger.error('Error getting commission by user id:', error);
                throw error;
            }
        });
    }
    updateCommission(id, updateData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commission = yield Commission_1.Commission.findByIdAndUpdate(id, { $set: updateData }, { new: true });
                return commission ? this.convertToICommission(commission) : null;
            }
            catch (error) {
                logger_1.logger.error('Error updating commission:', error);
                throw error;
            }
        });
    }
    deleteCommission(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield Commission_1.Commission.findByIdAndDelete(id);
                return !!result;
            }
            catch (error) {
                logger_1.logger.error('Error deleting commission:', error);
                throw error;
            }
        });
    }
    getCommissionsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commissions = yield Commission_1.Commission.find({ userId });
                return commissions.map(commission => this.convertToICommission(commission));
            }
            catch (error) {
                logger_1.logger.error('Error getting commissions by user id:', error);
                throw error;
            }
        });
    }
    getCommissionsByStatus(status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commissions = yield Commission_1.Commission.find({ status });
                return commissions.map(commission => this.convertToICommission(commission));
            }
            catch (error) {
                logger_1.logger.error('Error getting commissions by status:', error);
                throw error;
            }
        });
    }
    getCommissionsByDateRange(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commissions = yield Commission_1.Commission.find({
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
        });
    }
    getCommissionsByType(type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commissions = yield Commission_1.Commission.find({ type });
                return commissions.map(commission => this.convertToICommission(commission));
            }
            catch (error) {
                logger_1.logger.error('Error getting commissions by type:', error);
                throw error;
            }
        });
    }
    getCommissionsByUserAndDateRange(userId, startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commissions = yield Commission_1.Commission.find({
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
        });
    }
    getCommissionsByUserAndStatus(userId, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commissions = yield Commission_1.Commission.find({ userId, status });
                return commissions.map(commission => this.convertToICommission(commission));
            }
            catch (error) {
                logger_1.logger.error('Error getting commissions by user and status:', error);
                throw error;
            }
        });
    }
    getCommissionsByUserAndType(userId, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commissions = yield Commission_1.Commission.find({ userId, type });
                return commissions.map(commission => this.convertToICommission(commission));
            }
            catch (error) {
                logger_1.logger.error('Error getting commissions by user and type:', error);
                throw error;
            }
        });
    }
    getCommissionsByUserAndDateRangeAndStatus(userId, startDate, endDate, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commissions = yield Commission_1.Commission.find({
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
        });
    }
    getCommissionsByUserAndDateRangeAndType(userId, startDate, endDate, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commissions = yield Commission_1.Commission.find({
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
        });
    }
    getCommissionsByUserAndDateRangeAndStatusAndType(userId, startDate, endDate, status, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commissions = yield Commission_1.Commission.find({
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
        });
    }
    getCommissionsByDateRangeAndStatus(startDate, endDate, status) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commissions = yield Commission_1.Commission.find({
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
        });
    }
    getCommissionsByDateRangeAndType(startDate, endDate, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commissions = yield Commission_1.Commission.find({
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
        });
    }
    getCommissionsByDateRangeAndStatusAndType(startDate, endDate, status, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commissions = yield Commission_1.Commission.find({
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
        });
    }
    getCommissionsByStatusAndType(status, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commissions = yield Commission_1.Commission.find({ status, type });
                return commissions.map(commission => this.convertToICommission(commission));
            }
            catch (error) {
                logger_1.logger.error('Error getting commissions by status and type:', error);
                throw error;
            }
        });
    }
    getCommissionsByUserAndStatusAndType(userId, status, type) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commissions = yield Commission_1.Commission.find({ userId, status, type });
                return commissions.map(commission => this.convertToICommission(commission));
            }
            catch (error) {
                logger_1.logger.error('Error getting commissions by user, status and type:', error);
                throw error;
            }
        });
    }
    getCommissionsByUserAndDateRangeAndStatusAndTypeAndAmount(userId, startDate, endDate, status, type, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commissions = yield Commission_1.Commission.find({
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
        });
    }
    getCommissionsByDateRangeAndStatusAndTypeAndAmount(startDate, endDate, status, type, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commissions = yield Commission_1.Commission.find({
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
        });
    }
    getCommissionsByStatusAndTypeAndAmount(status, type, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commissions = yield Commission_1.Commission.find({ status, type, amount });
                return commissions.map(commission => this.convertToICommission(commission));
            }
            catch (error) {
                logger_1.logger.error('Error getting commissions by status, type and amount:', error);
                throw error;
            }
        });
    }
    getCommissionsByUserAndStatusAndTypeAndAmount(userId, status, type, amount) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commissions = yield Commission_1.Commission.find({ userId, status, type, amount });
                return commissions.map(commission => this.convertToICommission(commission));
            }
            catch (error) {
                logger_1.logger.error('Error getting commissions by user, status, type and amount:', error);
                throw error;
            }
        });
    }
    getCommissionsByUserAndDateRangeAndStatusAndTypeAndAmountAndCurrency(userId, startDate, endDate, status, type, amount, currency) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commissions = yield Commission_1.Commission.find({
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
        });
    }
    getCommissionsByDateRangeAndStatusAndTypeAndAmountAndCurrency(startDate, endDate, status, type, amount, currency) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commissions = yield Commission_1.Commission.find({
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
        });
    }
    getCommissionsByStatusAndTypeAndAmountAndCurrency(status, type, amount, currency) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commissions = yield Commission_1.Commission.find({ status, type, amount, currency });
                return commissions.map(commission => this.convertToICommission(commission));
            }
            catch (error) {
                logger_1.logger.error('Error getting commissions by status, type, amount and currency:', error);
                throw error;
            }
        });
    }
    getCommissionsByUserAndStatusAndTypeAndAmountAndCurrency(userId, status, type, amount, currency) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commissions = yield Commission_1.Commission.find({ userId, status, type, amount, currency });
                return commissions.map(commission => this.convertToICommission(commission));
            }
            catch (error) {
                logger_1.logger.error('Error getting commissions by user, status, type, amount and currency:', error);
                throw error;
            }
        });
    }
    getCommissionsByUserAndDateRangeAndStatusAndTypeAndAmountAndCurrencyAndDescription(userId, startDate, endDate, status, type, amount, currency, description) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commissions = yield Commission_1.Commission.find({
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
        });
    }
    getCommissionsByDateRangeAndStatusAndTypeAndAmountAndCurrencyAndDescription(startDate, endDate, status, type, amount, currency, description) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commissions = yield Commission_1.Commission.find({
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
        });
    }
    getCommissionsByStatusAndTypeAndAmountAndCurrencyAndDescription(status, type, amount, currency, description) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commissions = yield Commission_1.Commission.find({ status, type, amount, currency, description });
                return commissions.map(commission => this.convertToICommission(commission));
            }
            catch (error) {
                logger_1.logger.error('Error getting commissions by status, type, amount, currency and description:', error);
                throw error;
            }
        });
    }
    getCommissionsByUserAndStatusAndTypeAndAmountAndCurrencyAndDescription(userId, status, type, amount, currency, description) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const commissions = yield Commission_1.Commission.find({ userId, status, type, amount, currency, description });
                return commissions.map(commission => this.convertToICommission(commission));
            }
            catch (error) {
                logger_1.logger.error('Error getting commissions by user, status, type, amount, currency and description:', error);
                throw error;
            }
        });
    }
    getCommissionRules() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rules = yield CommissionRule_1.default.find().sort({ createdAt: -1 });
                return rules.map(rule => this.convertToICommissionRule(rule));
            }
            catch (error) {
                logger_1.logger.error('Error getting commission rules:', error);
                throw error;
            }
        });
    }
    createCommissionRule(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const rule = new CommissionRule_1.default(data);
                const savedRule = yield rule.save();
                return this.convertToICommissionRule(savedRule);
            }
            catch (error) {
                logger_1.logger.error('Error creating commission rule:', error);
                throw error;
            }
        });
    }
    updateCommissionRule(rule) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedRule = yield CommissionRule_1.default.findByIdAndUpdate(rule._id, { $set: rule }, { new: true });
                return updatedRule ? this.convertToICommissionRule(updatedRule) : null;
            }
            catch (error) {
                logger_1.logger.error('Error updating commission rule:', error);
                throw error;
            }
        });
    }
    deleteCommissionRule(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield CommissionRule_1.default.findByIdAndDelete(id);
                return !!result;
            }
            catch (error) {
                logger_1.logger.error('Error deleting commission rule:', error);
                throw error;
            }
        });
    }
}
exports.CommissionService = CommissionService;
//# sourceMappingURL=CommissionService.js.map