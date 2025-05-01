import { Request, Response, NextFunction } from 'express';
import { SettlementService } from '../services/SettlementService';
import { AuthenticatedRequest } from '../types/auth';
import { SettlementStatus } from '../types/enums';
import { logger } from '../utils/logger';
import { Types } from 'mongoose';

export class SettlementController {
  private settlementService: SettlementService;

  constructor() {
    this.settlementService = SettlementService.getInstance();
  }

  public getSettlements = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { startDate, endDate, status } = req.query;
      const userId = req.user?.id ? new Types.ObjectId(req.user.id) : undefined;

      const filter = {
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        userId,
        status: status as SettlementStatus | 'all'
      };

      const result = await this.settlementService.getSettlements(filter);
      res.json(result);
    } catch (error) {
      logger.error('Error getting settlements:', error);
      next(error);
    }
  };

  public getSettlementById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const settlement = await this.settlementService.getSettlementById(id);
      if (!settlement) {
        res.status(404).json({ message: 'Settlement not found' });
        return;
      }
      res.json(settlement);
    } catch (error) {
      logger.error('Error getting settlement by id:', error);
      next(error);
    }
  };

  public createSettlement = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { userId, amount, type, metadata } = req.body;
      if (!userId || !amount || !type) {
        res.status(400).json({ message: 'Missing required fields: userId, amount, type' });
        return;
      }
      const settlement = await this.settlementService.createSettlement(userId, amount, type, metadata);
      res.status(201).json(settlement);
    } catch (error) {
      logger.error('Error creating settlement:', error);
      next(error);
    }
  };

  public updateSettlementStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const settlement = await this.settlementService.updateSettlementStatus(id, status);
      if (!settlement) {
        res.status(404).json({ message: 'Settlement not found' });
        return;
      }
      res.json(settlement);
    } catch (error) {
      logger.error('Error updating settlement status:', error);
      next(error);
    }
  };

  public getSettlementSummary = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        res.status(400).json({ message: 'Start date and end date are required' });
        return;
      }
      const summary = await this.settlementService.getSettlementSummary(
        new Date(startDate as string),
        new Date(endDate as string)
      );
      res.json(summary);
    } catch (error) {
      logger.error('Error getting settlement summary:', error);
      next(error);
    }
  };

  public getPendingSettlements = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const settlements = await this.settlementService.getSettlements({ status: SettlementStatus.PENDING });
      res.json(settlements);
    } catch (error) {
      logger.error('Error getting pending settlements:', error);
      next(error);
    }
  };

  public getSettlementsByType = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { type } = req.params;
      const settlements = await this.settlementService.getSettlements({ 
        status: SettlementStatus.PENDING,
        startDate: new Date(0),
        endDate: new Date()
      });
      const filteredSettlements = settlements.settlements.filter(
        settlement => settlement.type === type
      );
      res.json({
        settlements: filteredSettlements,
        total: filteredSettlements.length
      });
    } catch (error) {
      logger.error('Error getting settlements by type:', error);
      next(error);
    }
  };

  public exportSettlements = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { startDate, endDate, status } = req.query;
      const userId = req.user?.id ? new Types.ObjectId(req.user.id) : undefined;

      const filter = {
        startDate: startDate ? new Date(startDate as string) : undefined,
        endDate: endDate ? new Date(endDate as string) : undefined,
        userId,
        status: status as SettlementStatus | 'all'
      };

      const csv = await this.settlementService.exportSettlements(filter);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=settlements.csv');
      res.send(csv);
    } catch (error) {
      logger.error('Error exporting settlements:', error);
      next(error);
    }
  };

  public generateSettlements = async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await this.settlementService.processPendingCommissions();
      res.status(201).json({ message: 'Settlements generated successfully' });
    } catch (error) {
      logger.error('Error generating settlements:', error);
      next(error);
    }
  };

  public processPayment = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const settlement = await this.settlementService.processPayment(id);
      if (!settlement) {
        res.status(404).json({ message: 'Settlement not found' });
        return;
      }
      res.json(settlement);
    } catch (error) {
      logger.error('Error processing payment:', error);
      next(error);
    }
  };
} 