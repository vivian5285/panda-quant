import { Types } from 'mongoose';
import { Commission } from '../models/Commission';
import CommissionRule from '../models/CommissionRule';
import { ICommission, ICommissionRule } from '../types/Commission';
import { CommissionType, CommissionStatus } from '../types/Enums';
import { logger } from '../utils/logger';

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
      referenceId: commissionObject.referenceId.toString()
    } as ICommission;
  }

  private convertToICommissionRule(rule: any): ICommissionRule {
    const ruleObject = rule.toObject();
    return {
      ...ruleObject,
      _id: ruleObject._id.toString(),
      name: ruleObject.name || '',
      description: ruleObject.description || '',
      type: ruleObject.type as 'percentage' | 'fixed',
      value: ruleObject.value || 0,
      conditions: ruleObject.conditions || {},
      isActive: ruleObject.isActive ?? true,
      createdAt: ruleObject.createdAt || new Date(),
      updatedAt: ruleObject.updatedAt || new Date()
    } as ICommissionRule;
  }

  public async createCommission(commissionData: Partial<ICommission>): Promise<ICommission> {
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

  public async updateCommission(id: string, updateData: Partial<ICommission>): Promise<ICommission | null> {
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
      return commissions.map(commission => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by user id:', error);
      throw error;
    }
  }

  public async getCommissionsByStatus(status: string): Promise<ICommission[]> {
    try {
      const commissions = await Commission.find({ status });
      return commissions.map(commission => this.convertToICommission(commission));
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
      return commissions.map(commission => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by date range:', error);
      throw error;
    }
  }

  public async getCommissionsByType(type: string): Promise<ICommission[]> {
    try {
      const commissions = await Commission.find({ type });
      return commissions.map(commission => this.convertToICommission(commission));
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
      return commissions.map(commission => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by user and date range:', error);
      throw error;
    }
  }

  public async getCommissionsByUserAndStatus(
    userId: string,
    status: string
  ): Promise<ICommission[]> {
    try {
      const commissions = await Commission.find({ userId, status });
      return commissions.map(commission => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by user and status:', error);
      throw error;
    }
  }

  public async getCommissionsByUserAndType(
    userId: string,
    type: string
  ): Promise<ICommission[]> {
    try {
      const commissions = await Commission.find({ userId, type });
      return commissions.map(commission => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by user and type:', error);
      throw error;
    }
  }

  public async getCommissionsByUserAndDateRangeAndStatus(
    userId: string,
    startDate: Date,
    endDate: Date,
    status: string
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
      return commissions.map(commission => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by user, date range and status:', error);
      throw error;
    }
  }

  public async getCommissionsByUserAndDateRangeAndType(
    userId: string,
    startDate: Date,
    endDate: Date,
    type: string
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
      return commissions.map(commission => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by user, date range and type:', error);
      throw error;
    }
  }

  public async getCommissionsByUserAndDateRangeAndStatusAndType(
    userId: string,
    startDate: Date,
    endDate: Date,
    status: string,
    type: string
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
      return commissions.map(commission => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by user, date range, status and type:', error);
      throw error;
    }
  }

  public async getCommissionsByDateRangeAndStatus(
    startDate: Date,
    endDate: Date,
    status: string
  ): Promise<ICommission[]> {
    try {
      const commissions = await Commission.find({
        status,
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      });
      return commissions.map(commission => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by date range and status:', error);
      throw error;
    }
  }

  public async getCommissionsByDateRangeAndType(
    startDate: Date,
    endDate: Date,
    type: string
  ): Promise<ICommission[]> {
    try {
      const commissions = await Commission.find({
        type,
        createdAt: {
          $gte: startDate,
          $lte: endDate
        }
      });
      return commissions.map(commission => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by date range and type:', error);
      throw error;
    }
  }

  public async getCommissionsByDateRangeAndStatusAndType(
    startDate: Date,
    endDate: Date,
    status: string,
    type: string
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
      return commissions.map(commission => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by date range, status and type:', error);
      throw error;
    }
  }

  public async getCommissionsByStatusAndType(
    status: string,
    type: string
  ): Promise<ICommission[]> {
    try {
      const commissions = await Commission.find({ status, type });
      return commissions.map(commission => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by status and type:', error);
      throw error;
    }
  }

  public async getCommissionsByUserAndStatusAndType(
    userId: string,
    status: string,
    type: string
  ): Promise<ICommission[]> {
    try {
      const commissions = await Commission.find({ userId, status, type });
      return commissions.map(commission => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by user, status and type:', error);
      throw error;
    }
  }

  public async getCommissionsByUserAndDateRangeAndStatusAndTypeAndAmount(
    userId: string,
    startDate: Date,
    endDate: Date,
    status: string,
    type: string,
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
      return commissions.map(commission => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by user, date range, status, type and amount:', error);
      throw error;
    }
  }

  public async getCommissionsByDateRangeAndStatusAndTypeAndAmount(
    startDate: Date,
    endDate: Date,
    status: string,
    type: string,
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
      return commissions.map(commission => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by date range, status, type and amount:', error);
      throw error;
    }
  }

  public async getCommissionsByStatusAndTypeAndAmount(
    status: string,
    type: string,
    amount: number
  ): Promise<ICommission[]> {
    try {
      const commissions = await Commission.find({ status, type, amount });
      return commissions.map(commission => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by status, type and amount:', error);
      throw error;
    }
  }

  public async getCommissionsByUserAndStatusAndTypeAndAmount(
    userId: string,
    status: string,
    type: string,
    amount: number
  ): Promise<ICommission[]> {
    try {
      const commissions = await Commission.find({ userId, status, type, amount });
      return commissions.map(commission => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by user, status, type and amount:', error);
      throw error;
    }
  }

  public async getCommissionsByUserAndDateRangeAndStatusAndTypeAndAmountAndCurrency(
    userId: string,
    startDate: Date,
    endDate: Date,
    status: string,
    type: string,
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
      return commissions.map(commission => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by user, date range, status, type, amount and currency:', error);
      throw error;
    }
  }

  public async getCommissionsByDateRangeAndStatusAndTypeAndAmountAndCurrency(
    startDate: Date,
    endDate: Date,
    status: string,
    type: string,
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
      return commissions.map(commission => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by date range, status, type, amount and currency:', error);
      throw error;
    }
  }

  public async getCommissionsByStatusAndTypeAndAmountAndCurrency(
    status: string,
    type: string,
    amount: number,
    currency: string
  ): Promise<ICommission[]> {
    try {
      const commissions = await Commission.find({ status, type, amount, currency });
      return commissions.map(commission => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by status, type, amount and currency:', error);
      throw error;
    }
  }

  public async getCommissionsByUserAndStatusAndTypeAndAmountAndCurrency(
    userId: string,
    status: string,
    type: string,
    amount: number,
    currency: string
  ): Promise<ICommission[]> {
    try {
      const commissions = await Commission.find({ userId, status, type, amount, currency });
      return commissions.map(commission => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by user, status, type, amount and currency:', error);
      throw error;
    }
  }

  public async getCommissionsByUserAndDateRangeAndStatusAndTypeAndAmountAndCurrencyAndDescription(
    userId: string,
    startDate: Date,
    endDate: Date,
    status: string,
    type: string,
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
      return commissions.map(commission => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by user, date range, status, type, amount, currency and description:', error);
      throw error;
    }
  }

  public async getCommissionsByDateRangeAndStatusAndTypeAndAmountAndCurrencyAndDescription(
    startDate: Date,
    endDate: Date,
    status: string,
    type: string,
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
      return commissions.map(commission => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by date range, status, type, amount, currency and description:', error);
      throw error;
    }
  }

  public async getCommissionsByStatusAndTypeAndAmountAndCurrencyAndDescription(
    status: string,
    type: string,
    amount: number,
    currency: string,
    description: string
  ): Promise<ICommission[]> {
    try {
      const commissions = await Commission.find({ status, type, amount, currency, description });
      return commissions.map(commission => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by status, type, amount, currency and description:', error);
      throw error;
    }
  }

  public async getCommissionsByUserAndStatusAndTypeAndAmountAndCurrencyAndDescription(
    userId: string,
    status: string,
    type: string,
    amount: number,
    currency: string,
    description: string
  ): Promise<ICommission[]> {
    try {
      const commissions = await Commission.find({ userId, status, type, amount, currency, description });
      return commissions.map(commission => this.convertToICommission(commission));
    } catch (error) {
      logger.error('Error getting commissions by user, status, type, amount, currency and description:', error);
      throw error;
    }
  }

  public async getCommissionRules(): Promise<ICommissionRule[]> {
    try {
      const rules = await CommissionRule.find().sort({ createdAt: -1 });
      return rules.map(rule => this.convertToICommissionRule(rule));
    } catch (error) {
      logger.error('Error getting commission rules:', error);
      throw error;
    }
  }

  public async createCommissionRule(data: Partial<ICommissionRule>): Promise<ICommissionRule> {
    try {
      const rule = new CommissionRule(data);
      const savedRule = await rule.save();
      return this.convertToICommissionRule(savedRule);
    } catch (error) {
      logger.error('Error creating commission rule:', error);
      throw error;
    }
  }

  public async updateCommissionRule(rule: ICommissionRule): Promise<ICommissionRule | null> {
    try {
      const updatedRule = await CommissionRule.findByIdAndUpdate(
        rule._id,
        { $set: rule },
        { new: true }
      );
      return updatedRule ? this.convertToICommissionRule(updatedRule) : null;
    } catch (error) {
      logger.error('Error updating commission rule:', error);
      throw error;
    }
  }

  public async deleteCommissionRule(id: Types.ObjectId): Promise<boolean> {
    try {
      const result = await CommissionRule.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      logger.error('Error deleting commission rule:', error);
      throw error;
    }
  }
} 