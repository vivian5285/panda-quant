import { ISettlement } from '../types/Settlement';
import Settlement from '../models/Settlement.model';
import { logger } from '../utils/Logger';
import { SettlementStatus } from '../types/Enums';

export class SettlementService {
  private static instance: SettlementService;

  private constructor() {}

  public static getInstance(): SettlementService {
    if (!SettlementService.instance) {
      SettlementService.instance = new SettlementService();
    }
    return SettlementService.instance;
  }

  async createSettlement(settlementData: Partial<ISettlement>) {
    try {
      const settlement = new Settlement(settlementData);
      return await settlement.save();
    } catch (error) {
      logger.error('Error in createSettlement:', error);
      throw error;
    }
  }

  async getSettlementById(id: string) {
    try {
      return await Settlement.findById(id);
    } catch (error) {
      logger.error('Error in getSettlementById:', error);
      throw error;
    }
  }

  async updateSettlement(id: string, settlementData: Partial<ISettlement>) {
    try {
      return await Settlement.findByIdAndUpdate(
        id,
        { $set: settlementData },
        { new: true }
      );
    } catch (error) {
      logger.error('Error in updateSettlement:', error);
      throw error;
    }
  }

  async deleteSettlement(id: string) {
    try {
      return await Settlement.findByIdAndDelete(id);
    } catch (error) {
      logger.error('Error in deleteSettlement:', error);
      throw error;
    }
  }

  async getSettlementsByStatus(status: SettlementStatus) {
    try {
      return await Settlement.find({ status });
    } catch (error) {
      logger.error('Error in getSettlementsByStatus:', error);
      throw error;
    }
  }

  async getSettlementsByUserId(userId: string) {
    try {
      return await Settlement.find({ userId });
    } catch (error) {
      logger.error('Error in getSettlementsByUserId:', error);
      throw error;
    }
  }

  async getSettlementSummary(startDate: Date, endDate: Date) {
    try {
      return await Settlement.aggregate([
        { $match: { createdAt: { $gte: startDate, $lte: endDate } } },
        {
          $group: {
            _id: null,
            totalAmount: { $sum: '$amount' },
            count: { $sum: 1 }
          }
        }
      ]);
    } catch (error) {
      logger.error('Error in getSettlementSummary:', error);
      throw error;
    }
  }
} 