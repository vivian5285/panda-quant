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
exports.WithdrawalController = void 0;
const WithdrawalService_1 = require("../services/WithdrawalService");
const errorHandler_1 = require("../utils/errorHandler");
const withdrawalService = WithdrawalService_1.WithdrawalService.getInstance();
class WithdrawalController {
    createWithdrawal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'User not authenticated' });
                    return;
                }
                const withdrawalData = {
                    userId: req.user._id,
                    amount: req.body.amount,
                    currency: req.body.currency,
                    status: req.body.status || 'pending',
                    network: req.body.network,
                    address: req.body.address,
                    transactionId: req.body.transactionId
                };
                const withdrawal = yield withdrawalService.createWithdrawal(withdrawalData);
                res.status(201).json(withdrawal);
            }
            catch (error) {
                (0, errorHandler_1.handleError)(res, error);
            }
        });
    }
    getWithdrawals(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'User not authenticated' });
                    return;
                }
                const withdrawals = yield withdrawalService.getWithdrawalsByUserId(req.user._id.toString());
                res.json(withdrawals);
            }
            catch (error) {
                (0, errorHandler_1.handleError)(res, error);
            }
        });
    }
    getWithdrawalById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const withdrawal = yield withdrawalService.getWithdrawalById(id);
                if (!withdrawal) {
                    res.status(404).json({ message: 'Withdrawal not found' });
                    return;
                }
                res.json(withdrawal);
            }
            catch (error) {
                (0, errorHandler_1.handleError)(res, error);
            }
        });
    }
    updateWithdrawal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const withdrawal = yield withdrawalService.updateWithdrawal(id, req.body);
                if (!withdrawal) {
                    res.status(404).json({ message: 'Withdrawal not found' });
                    return;
                }
                res.json(withdrawal);
            }
            catch (error) {
                (0, errorHandler_1.handleError)(res, error);
            }
        });
    }
    deleteWithdrawal(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { id } = req.params;
                const success = yield withdrawalService.deleteWithdrawal(id);
                if (!success) {
                    res.status(404).json({ message: 'Withdrawal not found' });
                    return;
                }
                res.json({ message: 'Withdrawal deleted successfully' });
            }
            catch (error) {
                (0, errorHandler_1.handleError)(res, error);
            }
        });
    }
}
exports.WithdrawalController = WithdrawalController;
//# sourceMappingURL=withdrawalController.js.map