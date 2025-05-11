import { Types } from 'mongoose';
import { Analysis } from '../models/Analysis.model';
import { IAnalysis, IAnalysisDocument } from '../types/Analysis';
import { logger } from '../utils/Logger';

export class AnalysisService {
  private static instance: AnalysisService;

  private constructor() {}

  public static getInstance(): AnalysisService {
    if (!AnalysisService.instance) {
      AnalysisService.instance = new AnalysisService();
    }
    return AnalysisService.instance;
  }

  private convertToIAnalysis(analysis: IAnalysisDocument): IAnalysis {
    return {
      _id: analysis._id,
      userId: analysis.userId,
      strategyId: analysis.strategyId,
      type: analysis.type,
      data: analysis.data,
      status: analysis.status,
      createdAt: analysis.createdAt,
      updatedAt: analysis.updatedAt
    };
  }

  async createAnalysis(analysisData: Partial<IAnalysis>): Promise<IAnalysis> {
    try {
      const analysis = new Analysis(analysisData);
      const savedAnalysis = await analysis.save();
      return this.convertToIAnalysis(savedAnalysis);
    } catch (error) {
      logger.error('Error creating analysis:', error);
      throw error;
    }
  }

  async getAnalysisById(id: string): Promise<IAnalysis | null> {
    try {
      const analysis = await Analysis.findById(id);
      return analysis ? this.convertToIAnalysis(analysis) : null;
    } catch (error) {
      logger.error('Error getting analysis:', error);
      throw error;
    }
  }

  async getAnalysesByUserId(userId: string): Promise<IAnalysis[]> {
    try {
      const analyses = await Analysis.find({ userId: new Types.ObjectId(userId) });
      return analyses.map((analysis: IAnalysisDocument) => this.convertToIAnalysis(analysis));
    } catch (error) {
      logger.error('Error getting analyses by user id:', error);
      throw error;
    }
  }

  async getAnalysesByStrategyId(strategyId: string): Promise<IAnalysis[]> {
    try {
      const analyses = await Analysis.find({ strategyId: new Types.ObjectId(strategyId) });
      return analyses.map((analysis: IAnalysisDocument) => this.convertToIAnalysis(analysis));
    } catch (error) {
      logger.error('Error getting analyses by strategy id:', error);
      throw error;
    }
  }

  async updateAnalysis(id: string, data: Partial<IAnalysis>): Promise<IAnalysis | null> {
    try {
      const analysis = await Analysis.findByIdAndUpdate(id, data, { new: true });
      return analysis ? this.convertToIAnalysis(analysis) : null;
    } catch (error) {
      logger.error('Error updating analysis:', error);
      throw error;
    }
  }

  async deleteAnalysis(id: string): Promise<boolean> {
    try {
      const result = await Analysis.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      logger.error('Error deleting analysis:', error);
      throw error;
    }
  }

  async updateAnalysisStatus(id: string, status: string): Promise<IAnalysis | null> {
    try {
      const analysis = await Analysis.findByIdAndUpdate(
        id,
        { status, updatedAt: new Date() },
        { new: true }
      );
      return analysis ? this.convertToIAnalysis(analysis) : null;
    } catch (error) {
      logger.error('Error updating analysis status:', error);
      throw error;
    }
  }
} 