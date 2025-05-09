import { Types } from 'mongoose';
import Settlement from '../models/settlement.model';
import { logger } from '../utils/logger';
import { SettlementStatus, ISettlementDocument } from '../types/Settlement';

export class SettlementService {
  private static instance: SettlementService;

  private constructor() {}

  public static getInstance(): SettlementService {
    if (!SettlementService.instance) {
      SettlementService.instance = new SettlementService();
    }
    return SettlementService.instance;
  }

  public async createSettlement(
    userId: string,
    amount: number,
    type: string,
    metadata: Record<string, any>
  ): Promise<ISettlementDocument> {
    try {
      const settlement = new Settlement({
        userId: new Types.ObjectId(userId),
        amount,
        type,
        status: SettlementStatus.PENDING,
        metadata
      });
      const savedSettlement = await settlement.save();
      return savedSettlement as unknown as ISettlementDocument;
    } catch (error) {
      logger.error('Error creating settlement:', error);
      throw error;
    }
  }

  public async updateSettlementStatus(
    id: string,
    status: SettlementStatus
  ): Promise<ISettlementDocument | null> {
    try {
      const settlement = await Settlement.findByIdAndUpdate(
        id,
        { $set: { status } },
        { new: true }
      );
      return settlement as unknown as ISettlementDocument | null;
    } catch (error) {
      logger.error('Error updating settlement status:', error);
      throw error;
    }
  }

  public async getSettlementById(id: string): Promise<ISettlementDocument | null> {
    try {
      const settlement = await Settlement.findById(id);
      return settlement as unknown as ISettlementDocument | null;
    } catch (error) {
      logger.error('Error getting settlement by id:', error);
      throw error;
    }
  }
} 