import { Types } from 'mongoose';
import { ApiKey } from '../models/ApiKey.model';
import { IApiKey, IApiKeyDocument } from '../types/ApiKey';
import { logger } from '../utils/Logger';

export class ApiKeyService {
  private static instance: ApiKeyService;

  private constructor() {}

  public static getInstance(): ApiKeyService {
    if (!ApiKeyService.instance) {
      ApiKeyService.instance = new ApiKeyService();
    }
    return ApiKeyService.instance;
  }

  private convertToIApiKey(apiKey: IApiKeyDocument): IApiKey {
    return {
      _id: apiKey._id,
      userId: apiKey.userId,
      name: apiKey.name,
      key: apiKey.key,
      secret: apiKey.secret,
      permissions: apiKey.permissions,
      status: apiKey.status,
      createdAt: apiKey.createdAt,
      updatedAt: apiKey.updatedAt
    };
  }

  async createApiKey(apiKeyData: Partial<IApiKey>): Promise<IApiKey> {
    try {
      const apiKey = new ApiKey(apiKeyData);
      const savedApiKey = await apiKey.save();
      return this.convertToIApiKey(savedApiKey);
    } catch (error) {
      logger.error('Error creating API key:', error);
      throw error;
    }
  }

  async getApiKeyById(id: string): Promise<IApiKey | null> {
    try {
      const apiKey = await ApiKey.findById(id);
      return apiKey ? this.convertToIApiKey(apiKey) : null;
    } catch (error) {
      logger.error('Error getting API key:', error);
      throw error;
    }
  }

  async getApiKeysByUserId(userId: string): Promise<IApiKey[]> {
    try {
      const apiKeys = await ApiKey.find({ userId: new Types.ObjectId(userId) });
      return apiKeys.map(apiKey => this.convertToIApiKey(apiKey));
    } catch (error) {
      logger.error('Error getting API keys by user id:', error);
      throw error;
    }
  }

  async updateApiKey(id: string, data: Partial<IApiKey>): Promise<IApiKey | null> {
    try {
      const apiKey = await ApiKey.findByIdAndUpdate(id, data, { new: true });
      return apiKey ? this.convertToIApiKey(apiKey) : null;
    } catch (error) {
      logger.error('Error updating API key:', error);
      throw error;
    }
  }

  async deleteApiKey(id: string): Promise<boolean> {
    try {
      const result = await ApiKey.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      logger.error('Error deleting API key:', error);
      throw error;
    }
  }

  async updateApiKeyStatus(id: string, status: string): Promise<IApiKey | null> {
    try {
      const apiKey = await ApiKey.findByIdAndUpdate(
        id,
        { status, updatedAt: new Date() },
        { new: true }
      );
      return apiKey ? this.convertToIApiKey(apiKey) : null;
    } catch (error) {
      logger.error('Error updating API key status:', error);
      throw error;
    }
  }
} 