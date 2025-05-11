"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawalController = void 0;
const mongoose_1 = require("mongoose");
const WithdrawalService_1 = require("../types/../services/WithdrawalService");
const errorHandler_1 = require("../utils/errorHandler");
class WithdrawalController {
    constructor() {
        this.withdrawalService = WithdrawalService_1.WithdrawalService.getInstance();
    }
    async createWithdrawal(req, res) {
        try {
            if (!req.user) {
                res.status(401).json({ message: 'User not authenticated' });
                return;
            }
            const withdrawalData = {
                userId: new mongoose_1.Types.ObjectId(req.user._id.toString()),
                amount: req.body.amount,
                currency: req.body.currency,
                status: req.body.status || 'pending',
                network: req.body.network,
                address: req.body.address,
                transactionId: req.body.transactionId
            };
            const withdrawal = await this.withdrawalService.createWithdrawal(withdrawalData);
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
            const withdrawals = await this.withdrawalService.getWithdrawalsByUserId(req.user._id.toString());
            res.json(withdrawals);
        }
        catch (error) {
            (0, errorHandler_1.handleError)(res, error);
        }
    }
    async getWithdrawalById(req, res) {
        try {
            const { id } = req.params;
            const withdrawal = await this.withdrawalService.getWithdrawalById(id);
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
            const withdrawal = await this.withdrawalService.updateWithdrawal(id, req.body);
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
            const success = await this.withdrawalService.deleteWithdrawal(id);
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
//# sourceMappingURL=WithdrawalController.js.map