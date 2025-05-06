import { Withdrawal } from '../models/Withdrawal';
import { logger } from '../utils/logger';
export class WithdrawalService {
    constructor() { }
    static getInstance() {
        if (!WithdrawalService.instance) {
            WithdrawalService.instance = new WithdrawalService();
        }
        return WithdrawalService.instance;
    }
    async createWithdrawal(data) {
        try {
            const withdrawal = new Withdrawal(data);
            const savedWithdrawal = await withdrawal.save();
            return savedWithdrawal.toObject();
        }
        catch (error) {
            logger.error('Error creating withdrawal:', error);
            throw error;
        }
    }
    async getWithdrawalById(id) {
        try {
            const withdrawal = await Withdrawal.findById(id);
            return withdrawal ? withdrawal.toObject() : null;
        }
        catch (error) {
            logger.error('Error getting withdrawal:', error);
            throw error;
        }
    }
    async updateWithdrawal(id, data) {
        try {
            const withdrawal = await Withdrawal.findByIdAndUpdate(id, data, { new: true });
            return withdrawal ? withdrawal.toObject() : null;
        }
        catch (error) {
            logger.error('Error updating withdrawal:', error);
            throw error;
        }
    }
    async deleteWithdrawal(id) {
        try {
            const result = await Withdrawal.findByIdAndDelete(id);
            return result !== null;
        }
        catch (error) {
            logger.error('Error deleting withdrawal:', error);
            throw error;
        }
    }
    async getWithdrawalsByUserId(userId) {
        try {
            const withdrawals = await Withdrawal.find({ userId });
            return withdrawals.map(withdrawal => withdrawal.toObject());
        }
        catch (error) {
            logger.error('Error getting withdrawals by user:', error);
            throw error;
        }
    }
}
//# sourceMappingURL=WithdrawalService.js.map