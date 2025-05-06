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
exports.WithdrawalService = void 0;
const Withdrawal_1 = require("../models/Withdrawal");
const logger_1 = require("../utils/logger");
class WithdrawalService {
    constructor() { }
    static getInstance() {
        if (!WithdrawalService.instance) {
            WithdrawalService.instance = new WithdrawalService();
        }
        return WithdrawalService.instance;
    }
    createWithdrawal(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const withdrawal = new Withdrawal_1.Withdrawal(data);
                const savedWithdrawal = yield withdrawal.save();
                return savedWithdrawal.toObject();
            }
            catch (error) {
                logger_1.logger.error('Error creating withdrawal:', error);
                throw error;
            }
        });
    }
    getWithdrawalById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const withdrawal = yield Withdrawal_1.Withdrawal.findById(id);
                return withdrawal ? withdrawal.toObject() : null;
            }
            catch (error) {
                logger_1.logger.error('Error getting withdrawal:', error);
                throw error;
            }
        });
    }
    updateWithdrawal(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const withdrawal = yield Withdrawal_1.Withdrawal.findByIdAndUpdate(id, data, { new: true });
                return withdrawal ? withdrawal.toObject() : null;
            }
            catch (error) {
                logger_1.logger.error('Error updating withdrawal:', error);
                throw error;
            }
        });
    }
    deleteWithdrawal(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield Withdrawal_1.Withdrawal.findByIdAndDelete(id);
                return result !== null;
            }
            catch (error) {
                logger_1.logger.error('Error deleting withdrawal:', error);
                throw error;
            }
        });
    }
    getWithdrawalsByUserId(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const withdrawals = yield Withdrawal_1.Withdrawal.find({ userId });
                return withdrawals.map(withdrawal => withdrawal.toObject());
            }
            catch (error) {
                logger_1.logger.error('Error getting withdrawals by user:', error);
                throw error;
            }
        });
    }
}
exports.WithdrawalService = WithdrawalService;
//# sourceMappingURL=WithdrawalService.js.map