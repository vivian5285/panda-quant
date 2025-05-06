import { Types } from 'mongoose';
import Settlement from '../models/Settlement';
import { logger } from '../utils/logger';
import { SettlementStatus } from '../types/Settlement';
export class SettlementService {
    constructor() { }
    static getInstance() {
        if (!SettlementService.instance) {
            SettlementService.instance = new SettlementService();
        }
        return SettlementService.instance;
    }
    async createSettlement(userId, amount, type, metadata) {
        try {
            const settlement = new Settlement({
                userId: new Types.ObjectId(userId),
                amount,
                type,
                status: SettlementStatus.PENDING,
                metadata
            });
            const savedSettlement = await settlement.save();
            return savedSettlement;
        }
        catch (error) {
            logger.error('Error creating settlement:', error);
            throw error;
        }
    }
    async updateSettlementStatus(id, status) {
        try {
            const settlement = await Settlement.findByIdAndUpdate(id, { $set: { status } }, { new: true });
            return settlement;
        }
        catch (error) {
            logger.error('Error updating settlement status:', error);
            throw error;
        }
    }
    async getSettlementById(id) {
        try {
            const settlement = await Settlement.findById(id);
            return settlement;
        }
        catch (error) {
            logger.error('Error getting settlement by id:', error);
            throw error;
        }
    }
}
//# sourceMappingURL=settlement.service.js.map