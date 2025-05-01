"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawalController = void 0;
const WithdrawalService_1 = require("../services/WithdrawalService");
const errorHandler_1 = require("../utils/errorHandler");
const withdrawalService = WithdrawalService_1.WithdrawalService.getInstance();
class WithdrawalController {
    async createWithdrawal(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'User not authenticated' });
                return;
            }
            const withdrawalData = {
                userId: req.user._id,
                amount: req.body.amount,
                walletAddress: req.body.walletAddress,
                paymentMethod: req.body.paymentMethod,
                paymentDetails: req.body.paymentDetails,
                status: req.body.status,
                metadata: req.body.metadata
            };
            const withdrawal = await withdrawalService.createWithdrawal(withdrawalData);
            res.status(201).json(withdrawal);
        }
        catch (error) {
            (0, errorHandler_1.handleError)(res, error);
        }
    }
    async getWithdrawals(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'User not authenticated' });
                return;
            }
            const withdrawals = await withdrawalService.getWithdrawals(req.user._id);
            res.json(withdrawals);
        }
        catch (error) {
            (0, errorHandler_1.handleError)(res, error);
        }
    }
    async getWithdrawalById(req, res) {
        try {
            const { id } = req.params;
            const withdrawal = await withdrawalService.getWithdrawalById(id);
            if (!withdrawal) {
                res.status(404).json({ message: 'Withdrawal not found' });
                return;
            }
            res.json(withdrawal);
        }
        catch (error) {
            (0, errorHandler_1.handleError)(res, error);
        }
    }
    async updateWithdrawal(req, res) {
        try {
            const { id } = req.params;
            const withdrawal = await withdrawalService.updateWithdrawal(id, req.body);
            if (!withdrawal) {
                res.status(404).json({ message: 'Withdrawal not found' });
                return;
            }
            res.json(withdrawal);
        }
        catch (error) {
            (0, errorHandler_1.handleError)(res, error);
        }
    }
    async deleteWithdrawal(req, res) {
        try {
            const { id } = req.params;
            const success = await withdrawalService.deleteWithdrawal(id);
            if (!success) {
                res.status(404).json({ message: 'Withdrawal not found' });
                return;
            }
            res.json({ message: 'Withdrawal deleted successfully' });
        }
        catch (error) {
            (0, errorHandler_1.handleError)(res, error);
        }
    }
}
exports.WithdrawalController = WithdrawalController;
//# sourceMappingURL=withdrawalController.js.map