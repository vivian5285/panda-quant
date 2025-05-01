"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WithdrawalController = void 0;
const logger_1 = require("../utils/logger");
const withdrawal_service_1 = require("../services/withdrawal.service");
const mongoose_1 = require("mongoose");
class WithdrawalController {
    constructor() {
        this.createWithdrawal = async (req, res) => {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'User not authenticated' });
                    return;
                }
                const withdrawalData = {
                    ...req.body,
                    userId: new mongoose_1.Types.ObjectId(req.user._id.toString())
                };
                const withdrawal = await this.withdrawalService.createWithdrawal(withdrawalData);
                res.status(201).json(withdrawal);
            }
            catch (error) {
                logger_1.logger.error('Error creating withdrawal:', error);
                res.status(400).json({ message: 'Error creating withdrawal', error: error.message });
            }
        };
        this.getWithdrawals = async (req, res) => {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'User not authenticated' });
                    return;
                }
                const withdrawals = await this.withdrawalService.getWithdrawals(req.user._id.toString());
                res.json(withdrawals);
            }
            catch (error) {
                logger_1.logger.error('Error getting withdrawals:', error);
                res.status(500).json({ message: 'Error getting withdrawals', error });
            }
        };
        this.getWithdrawal = async (req, res) => {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'User not authenticated' });
                    return;
                }
                const { id } = req.params;
                const withdrawal = await this.withdrawalService.getWithdrawal(id, req.user._id.toString());
                if (!withdrawal) {
                    res.status(404).json({ message: 'Withdrawal not found' });
                    return;
                }
                res.json(withdrawal);
            }
            catch (error) {
                logger_1.logger.error('Error getting withdrawal:', error);
                res.status(500).json({ message: 'Error getting withdrawal', error });
            }
        };
        this.updateWithdrawal = async (req, res) => {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'User not authenticated' });
                    return;
                }
                const withdrawal = await this.withdrawalService.updateWithdrawal(req.params['id'], req.user._id.toString(), req.body);
                if (!withdrawal) {
                    res.status(404).json({ message: 'Withdrawal not found' });
                    return;
                }
                res.json(withdrawal);
            }
            catch (error) {
                logger_1.logger.error('Error updating withdrawal:', error);
                res.status(400).json({ message: 'Error updating withdrawal', error: error.message });
            }
        };
        this.deleteWithdrawal = async (req, res) => {
            try {
                if (!req.user) {
                    res.status(401).json({ message: 'User not authenticated' });
                    return;
                }
                const withdrawal = await this.withdrawalService.deleteWithdrawal(req.params['id'], req.user._id.toString());
                if (!withdrawal) {
                    res.status(404).json({ message: 'Withdrawal not found' });
                    return;
                }
                res.json({ message: 'Withdrawal deleted successfully' });
            }
            catch (error) {
                logger_1.logger.error('Error deleting withdrawal:', error);
                res.status(400).json({ message: 'Error deleting withdrawal', error: error.message });
            }
        };
        this.withdrawalService = new withdrawal_service_1.WithdrawalService();
    }
}
exports.WithdrawalController = WithdrawalController;
exports.default = new WithdrawalController();
//# sourceMappingURL=withdrawalController.js.map