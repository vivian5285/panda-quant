import { Types } from 'mongoose';
import { Commission } from '../models/Commission.model';
import { CommissionRule } from '../models/CommissionRule.model';
import { ICommission, ICommissionRule, ICommissionDocument, CommissionCreateInput, CommissionUpdateInput } from '../types/Commission';
import { CommissionType, CommissionStatus } from '../types/Enums';
import { logger } from '../utils/Logger';

export class CommissionService {
  private static instance: CommissionService;

  private constructor() {}

  public static getInstance(): CommissionService {
    if (!CommissionService.instance) {
      CommissionService.instance = new CommissionService();
    }
    return CommissionService.instance;
  }

  private convertToICommission(commission: any): ICommission {
    const commissionObject = commission.toObject();
    return {
      ...commissionObject,
      _id: commissionObject._id.toString(),
      userId: commissionObject.userId.toString(),
      type: commissionObject.type as CommissionType,
      status: commissionObject.status as CommissionStatus,
      referenceId: commissionObject.referenceId?.toString(),
      referenceType: commissionObject.referenceType || 'default'
    } as ICommission;
  }

  private convertToICommissionRule(rule: any): ICommissionRule {
    const ruleObject = rule.toObject();
    return {
      ...ruleObject,
      _id: ruleObject._id.toString(),
      name: ruleObject.name || '',
      description: ruleObject.description || '',
      type: ruleObject.type as CommissionType,
      value: ruleObject.value || 0,
      conditions: ruleObject.conditions || {},
      isActive: ruleObject.isActive ?? true,
      status: ruleObject.status as CommissionStatus,
      createdAt: ruleObject.createdAt || new Date(),
      updatedAt: ruleObject.updatedAt || new Date()
    } as ICommissionRule;
  }

  public async createCommission(commissionData: CommissionCreateInput): Promise<ICommission> {
    try {
      const commission = new Commission(commissionData);
      const savedCommission = await commission.save();
      return this.convertToICommission(savedCommission);
    } catch (error) {
      logger.error('Error creating commission:', error);
      throw error;
    }
  }

  public async getCommissionById(id: string): Promise<ICommission | null> {
    try {
      const commission = await Commission.findById(id);
      return commission ? this.convertToICommission(commission) : null;
    } catch (error) {
      logger.error('Error getting commission by id:', error);
      throw error;
    }
  }

  public async getCommissionByUserId(userId: string): Promise<ICommission | null> {
    try {
      const commission = await Commission.findOne({ userId });
      return commission ? this.convertToICommission(commission) : null;
    } catch (error) {
      logger.error('Error getting commission by user id:', error);
      throw error;
    }
  }

  public async updateCommission(id: string, updateData: CommissionUpdateInput): Promise<ICommission | null> {
    try {
      const commission = await Commission.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      );
      return commission ? this.convertToICommission(commission) : null;
    } catch (error) {
      logger.error('Error updating commission:', error);
      throw error;
    }
  }

  public async deleteCommission(id: string): Promise<boolean> {
    try {
      const result = await Commission.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      logger.error('Error deleting commission:', error);
      throw error;
    }
  }

  public async getCommissionsByUserId(userId: string): Promise<ICommission[]> {
    try {
      const commissions = await Commission.find({ userId });
      return commissions.map((commission: any) => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by user id:', error);
      throw error;
    }
  }

  public async getCommissionsByStatus(status: CommissionStatus): Promise<ICommission[]> {
    try {
      const commissions = await Commission.find({ status });
      return commissions.map((commission: any) => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by status:', error);
      throw error;
    }
  }

  public async getCommissionsByDateRange(startDate: Date, endDate: Date): Promise<ICommission[]> {
    try {
      const commissions = await Commission.find({
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      });
      return commissions.map((commission: any) => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by date range:', error);
      throw error;
    }
  }

  public async getCommissionsByType(type: CommissionType): Promise<ICommission[]> {
    try {
      const commissions = await Commission.find({ type });
      return commissions.map((commission: any) => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by type:', error);
      throw error;
    }
  }

  public async getCommissionsByUserAndDateRange(
    userId: string,
    startDate: Date,
    endDate: Date
  ): Promise<ICommission[]> {
    try {
      const commissions = await Commission.find({
        userId,
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      });
      return commissions.map((commission: any) => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by user and date range:', error);
      throw error;
    }
  }

  public async getCommissionsByUserAndStatus(
    userId: string,
    status: CommissionStatus
  ): Promise<ICommission[]> {
    try {
      const commissions = await Commission.find({ userId, status });
      return commissions.map((commission: any) => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by user and status:', error);
      throw error;
    }
  }

  public async getCommissionsByUserAndType(
    userId: string,
    type: CommissionType
  ): Promise<ICommission[]> {
    try {
      const commissions = await Commission.find({ userId, type });
      return commissions.map((commission: any) => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by user and type:', error);
      throw error;
    }
  }

  public async getCommissionsByUserAndDateRangeAndStatus(
    userId: string,
    startDate: Date,
    endDate: Date,
    status: CommissionStatus
  ): Promise<ICommission[]> {
    try {
      const commissions = await Commission.find({
        userId,
        status,
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      });
      return commissions.map((commission: any) => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by user and date range and status:', error);
      throw error;
    }
  }

  public async getCommissionsByUserAndDateRangeAndType(
    userId: string,
    startDate: Date,
    endDate: Date,
    type: CommissionType
  ): Promise<ICommission[]> {
    try {
      const commissions = await Commission.find({
        userId,
        type,
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      });
      return commissions.map((commission: any) => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by user and date range and type:', error);
      throw error;
    }
  }

  public async getCommissionsByUserAndDateRangeAndStatusAndType(
    userId: string,
    startDate: Date,
    endDate: Date,
    status: CommissionStatus,
    type: CommissionType
  ): Promise<ICommission[]> {
    try {
      const commissions = await Commission.find({
        userId,
        status,
        type,
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      });
      return commissions.map((commission: any) => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by user and date range and status and type:', error);
      throw error;
    }
  }

  public async getCommissionsByDateRangeAndStatus(
    startDate: Date,
    endDate: Date,
    status: CommissionStatus
  ): Promise<ICommission[]> {
    try {
      const commissions = await Commission.find({
        status,
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      });
      return commissions.map((commission: any) => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by date range and status:', error);
      throw error;
    }
  }

  public async getCommissionsByDateRangeAndType(
    startDate: Date,
    endDate: Date,
    type: CommissionType
  ): Promise<ICommission[]> {
    try {
      const commissions = await Commission.find({
        type,
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      });
      return commissions.map((commission: any) => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by date range and type:', error);
      throw error;
    }
  }

  public async getCommissionsByDateRangeAndStatusAndType(
    startDate: Date,
    endDate: Date,
    status: CommissionStatus,
    type: CommissionType
  ): Promise<ICommission[]> {
    try {
      const commissions = await Commission.find({
        status,
        type,
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      });
      return commissions.map((commission: any) => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by date range and status and type:', error);
      throw error;
    }
  }

  public async getCommissionsByStatusAndType(
    status: CommissionStatus,
    type: CommissionType
  ): Promise<ICommission[]> {
    try {
      const commissions = await Commission.find({ status, type });
      return commissions.map((commission: any) => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by status and type:', error);
      throw error;
    }
  }

  public async getCommissionsByUserAndStatusAndType(
    userId: string,
    status: CommissionStatus,
    type: CommissionType
  ): Promise<ICommission[]> {
    try {
      const commissions = await Commission.find({ userId, status, type });
      return commissions.map((commission: any) => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by user and status and type:', error);
      throw error;
    }
  }

  public async getCommissionsByUserAndDateRangeAndStatusAndTypeAndAmount(
    userId: string,
    startDate: Date,
    endDate: Date,
    status: CommissionStatus,
    type: CommissionType,
    amount: number
  ): Promise<ICommission[]> {
    try {
      const commissions = await Commission.find({
        userId,
        status,
        type,
        amount,
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      });
      return commissions.map((commission: any) => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by user and date range and status and type and amount:', error);
      throw error;
    }
  }

  public async getCommissionsByDateRangeAndStatusAndTypeAndAmount(
    startDate: Date,
    endDate: Date,
    status: CommissionStatus,
    type: CommissionType,
    amount: number
  ): Promise<ICommission[]> {
    try {
      const commissions = await Commission.find({
        status,
        type,
        amount,
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      });
      return commissions.map((commission: any) => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by date range and status and type and amount:', error);
      throw error;
    }
  }

  public async getCommissionsByStatusAndTypeAndAmount(
    status: CommissionStatus,
    type: CommissionType,
    amount: number
  ): Promise<ICommission[]> {
    try {
      const commissions = await Commission.find({ status, type, amount });
      return commissions.map((commission: any) => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by status and type and amount:', error);
      throw error;
    }
  }

  public async getCommissionsByUserAndStatusAndTypeAndAmount(
    userId: string,
    status: CommissionStatus,
    type: CommissionType,
    amount: number
  ): Promise<ICommission[]> {
    try {
      const commissions = await Commission.find({ userId, status, type, amount });
      return commissions.map((commission: any) => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by user and status and type and amount:', error);
      throw error;
    }
  }

  public async getCommissionsByUserAndDateRangeAndStatusAndTypeAndAmountAndCurrency(
    userId: string,
    startDate: Date,
    endDate: Date,
    status: CommissionStatus,
    type: CommissionType,
    amount: number,
    currency: string
  ): Promise<ICommission[]> {
    try {
      const commissions = await Commission.find({
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
      return commissions.map((commission: any) => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by user and date range and status and type and amount and currency:', error);
      throw error;
    }
  }

  public async getCommissionsByDateRangeAndStatusAndTypeAndAmountAndCurrency(
    startDate: Date,
    endDate: Date,
    status: CommissionStatus,
    type: CommissionType,
    amount: number,
    currency: string
  ): Promise<ICommission[]> {
    try {
      const commissions = await Commission.find({
        status,
        type,
        amount,
        currency,
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      });
      return commissions.map((commission: any) => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by date range and status and type and amount and currency:', error);
      throw error;
    }
  }

  public async getCommissionsByStatusAndTypeAndAmountAndCurrency(
    status: CommissionStatus,
    type: CommissionType,
    amount: number,
    currency: string
  ): Promise<ICommission[]> {
    try {
      const commissions = await Commission.find({ status, type, amount, currency });
      return commissions.map((commission: any) => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by status and type and amount and currency:', error);
      throw error;
    }
  }

  public async getCommissionsByUserAndStatusAndTypeAndAmountAndCurrency(
    userId: string,
    status: CommissionStatus,
    type: CommissionType,
    amount: number,
    currency: string
  ): Promise<ICommission[]> {
    try {
      const commissions = await Commission.find({ userId, status, type, amount, currency });
      return commissions.map((commission: any) => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by user and status and type and amount and currency:', error);
      throw error;
    }
  }

  public async getCommissionsByUserAndDateRangeAndStatusAndTypeAndAmountAndCurrencyAndDescription(
    userId: string,
    startDate: Date,
    endDate: Date,
    status: CommissionStatus,
    type: CommissionType,
    amount: number,
    currency: string,
    description: string
  ): Promise<ICommission[]> {
    try {
      const commissions = await Commission.find({
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
      return commissions.map((commission: any) => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by user and date range and status and type and amount and currency and description:', error);
      throw error;
    }
  }

  public async getCommissionsByDateRangeAndStatusAndTypeAndAmountAndCurrencyAndDescription(
    startDate: Date,
    endDate: Date,
    status: CommissionStatus,
    type: CommissionType,
    amount: number,
    currency: string,
    description: string
  ): Promise<ICommission[]> {
    try {
      const commissions = await Commission.find({
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
      return commissions.map((commission: any) => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by date range and status and type and amount and currency and description:', error);
      throw error;
    }
  }

  public async getCommissionsByStatusAndTypeAndAmountAndCurrencyAndDescription(
    status: CommissionStatus,
    type: CommissionType,
    amount: number,
    currency: string,
    description: string
  ): Promise<ICommission[]> {
    try {
      const commissions = await Commission.find({ status, type, amount, currency, description });
      return commissions.map((commission: any) => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by status and type and amount and currency and description:', error);
      throw error;
    }
  }

  public async getCommissionsByUserAndStatusAndTypeAndAmountAndCurrencyAndDescription(
    userId: string,
    status: CommissionStatus,
    type: CommissionType,
    amount: number,
    currency: string,
    description: string
  ): Promise<ICommission[]> {
    try {
      const commissions = await Commission.find({ userId, status, type, amount, currency, description });
      return commissions.map((commission: any) => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by user and status and type and amount and currency and description:', error);
      throw error;
    }
  }

  public async getCommissionRules(): Promise<ICommissionRule[]> {
    try {
      const rules = await CommissionRule.find();
      return rules.map((rule: any) => this.convertToICommissionRule(rule));
    } catch (error) {
      logger.error('Error getting commission rules:', error);
      throw error;
    }
  }

  public async createCommissionRule(data: Omit<ICommissionRule, '_id' | 'createdAt' | 'updatedAt'>): Promise<ICommissionRule> {
    try {
      const rule = new CommissionRule(data);
      const savedRule = await rule.save();
      return this.convertToICommissionRule(savedRule);
    } catch (error) {
      logger.error('Error creating commission rule:', error);
      throw error;
    }
  }

  public async updateCommissionRule(id: string, updateData: Partial<ICommissionRule>): Promise<ICommissionRule | null> {
    try {
      const rule = await CommissionRule.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      );
      return rule ? this.convertToICommissionRule(rule) : null;
    } catch (error) {
      logger.error('Error updating commission rule:', error);
      throw error;
    }
  }

  public async deleteCommissionRule(id: string): Promise<boolean> {
    try {
      const result = await CommissionRule.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      logger.error('Error deleting commission rule:', error);
      throw error;
    }
  }
}

export const commissionService = CommissionService.getInstance(); 