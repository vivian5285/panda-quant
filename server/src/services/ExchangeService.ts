import { Types } from 'mongoose';
import { Exchange } from '../models/Exchange.model';
import { IExchange, IExchangeDocument } from '../types/Exchange';
import { logger } from '../utils/Logger';
import { AppError } from '../utils/AppError';

export class ExchangeService {
  private static instance: ExchangeService;

  private constructor() {}

  public static getInstance(): ExchangeService {
    if (!ExchangeService.instance) {
      ExchangeService.instance = new ExchangeService();
    }
    return ExchangeService.instance;
  }

  async createExchange(exchangeData: Omit<IExchange, '_id'>): Promise<IExchange> {
    try {
      const exchange = new Exchange(exchangeData);
      const savedExchange = await exchange.save();
      return this.convertToIExchange(savedExchange);
    } catch (error) {
      logger.error('Error creating exchange:', error);
      throw error;
    }
  }

  async getExchangeById(id: string): Promise<IExchange | null> {
    try {
      const exchange = await Exchange.findById(id);
      return exchange ? this.convertToIExchange(exchange) : null;
    } catch (error) {
      logger.error('Error getting exchange:', error);
      throw error;
    }
  }

  private convertToIExchange(exchange: IExchangeDocument): IExchange {
    return {
      _id: exchange._id,
      name: exchange.name,
      apiKey: exchange.apiKey,
      apiSecret: exchange.apiSecret,
      status: exchange.status,
      createdAt: exchange.createdAt,
      updatedAt: exchange.updatedAt
    };
  }

  async getExchangesByUser(userId: string): Promise<IExchangeDocument[]> {
    try {
      return await Exchange.find({ userId: new Types.ObjectId(userId) });
    } catch (error) {
      logger.error('Error getting user exchanges:', error);
      throw new AppError('Failed to get user exchanges', 500);
    }
  }

  async updateExchangeStatus(id: string, status: 'active' | 'inactive'): Promise<IExchangeDocument | null> {
    try {
      return await Exchange.findByIdAndUpdate(
        id,
        { status, updatedAt: new Date() },
        { new: true }
      );
    } catch (error) {
      logger.error('Error updating exchange status:', error);
      throw new AppError('Failed to update exchange status', 500);
    }
  }

  async updateExchangeApiKey(id: string, apiKey: string, apiSecret: string): Promise<IExchangeDocument | null> {
    try {
      return await Exchange.findByIdAndUpdate(
        id,
        { 
          apiKey,
          apiSecret,
          updatedAt: new Date()
        },
        { new: true }
      );
    } catch (error) {
      logger.error('Error updating exchange API key:', error);
      throw new AppError('Failed to update exchange API key', 500);
    }
  }

  async deleteExchange(id: string): Promise<boolean> {
    try {
      const result = await Exchange.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      logger.error('Error deleting exchange:', error);
      throw new AppError('Failed to delete exchange', 500);
    }
  }

  async getActiveExchanges(): Promise<IExchangeDocument[]> {
    try {
      return await Exchange.find({ status: 'active' });
    } catch (error) {
      logger.error('Error getting active exchanges:', error);
      throw new AppError('Failed to get active exchanges', 500);
    }
  }

  async validateApiCredentials(exchangeId: string): Promise<boolean> {
    try {
      const exchange = await Exchange.findById(exchangeId);
      if (!exchange) {
        throw new AppError('Exchange not found', 404);
      }

      // TODO: Implement actual API validation logic
      return true;
    } catch (error) {
      logger.error('Error validating API credentials:', error);
      throw new AppError('Failed to validate API credentials', 500);
    }
  }
} 