import { Response, Request } from 'express';
import { CommissionService } from '../services/CommissionService';
import { AuthenticatedRequest } from '../types/Auth';
import { logger } from '../utils/logger';
import { Types } from 'mongoose';
import { CommissionStatus, CommissionType } from '../types/Enums';
import { CommissionCreateInput, CommissionUpdateInput } from '../types/Commission';
import { AppError } from '../utils/AppError';

export class CommissionController {
  private commissionService: CommissionService;

  constructor() {
    this.commissionService = CommissionService.getInstance();
  }

  public getCommissionById = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const commission = await this.commissionService.getCommissionById(id.toString());
      if (!commission) {
        res.status(404).json({ message: 'Commission not found' });
        return;
      }
      res.json(commission);
    } catch (error) {
      logger.error('Error getting commission details:', error);
      res.status(500).json({ message: 'Error getting commission details', error });
    }
  };

  public getCommissionByUserId = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const commission = await this.commissionService.getCommissionByUserId(userId.toString());
      if (!commission) {
        res.status(404).json({ message: 'Commission not found' });
        return;
      }
      res.json(commission);
    } catch (error) {
      logger.error('Error getting commission by user id:', error);
      res.status(500).json({ message: 'Error getting commission by user id', error });
    }
  };

  public createCommission = async (req: Request, res: Response) => {
    try {
      const { userId, amount, type, metadata } = req.body;
      
      const commission = await this.commissionService.createCommission({
        userId: userId.toString(),
        amount,
        type,
        status: CommissionStatus.PENDING,
        referenceId: req.body.referenceId || '',
        referenceType: req.body.referenceType || 'MANUAL',
        metadata
      });

      res.status(201).json(commission);
    } catch (error) {
      logger.error('Error creating commission:', error);
      throw new AppError('Failed to create commission', 500);
    }
  };

  public updateCommission = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const commission = await this.commissionService.updateCommission(id.toString(), req.body);
      if (!commission) {
        res.status(404).json({ message: 'Commission not found' });
        return;
      }
      res.json(commission);
    } catch (error) {
      logger.error('Error updating commission:', error);
      res.status(500).json({ message: 'Error updating commission', error });
    }
  };

  public deleteCommission = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const success = await this.commissionService.deleteCommission(id.toString());
      if (!success) {
        res.status(404).json({ message: 'Commission not found' });
        return;
      }
      res.json({ message: 'Commission deleted successfully' });
    } catch (error) {
      logger.error('Error deleting commission:', error);
      res.status(500).json({ message: 'Error deleting commission', error });
    }
  };

  public getCommissionRules = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const rules = await this.commissionService.getCommissionRules();
      res.json(rules);
    } catch (error) {
      logger.error('Error getting commission rules:', error);
      res.status(500).json({ message: 'Error getting commission rules', error });
    }
  };

  public createCommissionRule = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const rule = await this.commissionService.createCommissionRule(req.body);
      res.status(201).json(rule);
    } catch (error) {
      logger.error('Error creating commission rule:', error);
      res.status(500).json({ message: 'Error creating commission rule', error });
    }
  };

  public updateCommissionRule = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const rule = await this.commissionService.updateCommissionRule(id, req.body);
      if (!rule) {
        res.status(404).json({ message: 'Commission rule not found' });
        return;
      }
      res.json(rule);
    } catch (error) {
      logger.error('Error updating commission rule:', error);
      res.status(500).json({ message: 'Error updating commission rule', error });
    }
  };

  public deleteCommissionRule = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const success = await this.commissionService.deleteCommissionRule(id);
      if (!success) {
        res.status(404).json({ message: 'Commission rule not found' });
        return;
      }
      res.json({ message: 'Commission rule deleted successfully' });
    } catch (error) {
      logger.error('Error deleting commission rule:', error);
      res.status(500).json({ message: 'Error deleting commission rule', error });
    }
  };

  public getCommissionsByType = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { type } = req.params;
      const commissions = await this.commissionService.getCommissionsByType(type);
      res.json(commissions);
    } catch (error) {
      logger.error('Error getting commissions by type:', error);
      res.status(500).json({ message: 'Error getting commissions by type', error });
    }
  };

  public getCommissionsByStatusAndTypeAndAmount = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { status, type, amount } = req.query;
      const commissions = await this.commissionService.getCommissionsByStatusAndTypeAndAmount(
        status as CommissionStatus,
        type as CommissionType,
        Number(amount)
      );
      res.json(commissions);
    } catch (error) {
      logger.error('Error getting commissions by status, type and amount:', error);
      res.status(500).json({ message: 'Error getting commissions by status, type and amount', error });
    }
  };

  public getCommissionsByStatusAndTypeAndAmountAndCurrency = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { status, type, amount, currency } = req.query;
      const commissions = await this.commissionService.getCommissionsByStatusAndTypeAndAmountAndCurrency(
        status as CommissionStatus,
        type as CommissionType,
        Number(amount),
        currency as string
      );
      res.json(commissions);
    } catch (error) {
      logger.error('Error getting commissions by status, type, amount and currency:', error);
      res.status(500).json({ message: 'Error getting commissions by status, type, amount and currency', error });
    }
  };

  public getCommissionsByUserAndStatusAndTypeAndAmountAndCurrency = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { userId, status, type, amount, currency } = req.query;
      const commissions = await this.commissionService.getCommissionsByUserAndStatusAndTypeAndAmountAndCurrency(
        userId as string,
        status as CommissionStatus,
        type as CommissionType,
        Number(amount),
        currency as string
      );
      res.json(commissions);
    } catch (error) {
      logger.error('Error getting commissions by user, status, type, amount and currency:', error);
      res.status(500).json({ message: 'Error getting commissions by user, status, type, amount and currency', error });
    }
  };

  public getCommissionsByStatusAndTypeAndAmountAndCurrencyAndDescription = async (
    req: AuthenticatedRequest,
    res: Response
  ): Promise<void> => {
    try {
      const { status, type, amount, currency, description } = req.query;
      const commissions = await this.commissionService.getCommissionsByStatusAndTypeAndAmountAndCurrencyAndDescription(
        status as CommissionStatus,
        type as CommissionType,
        Number(amount),
        currency as string,
        description as string
      );
      res.json(commissions);
    } catch (error) {
      logger.error('Error getting commissions by status, type, amount, currency and description:', error);
      res.status(500).json({ message: 'Error getting commissions by status, type, amount, currency and description', error });
    }
  };

  public getCommissionsByStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { status } = req.query;
      const commissions = await this.commissionService.getCommissionsByStatus(
        status as unknown as CommissionStatus
      );
      res.json(commissions);
    } catch (error) {
      logger.error('Error getting commissions by status:', error);
      res.status(500).json({ message: 'Error getting commissions by status', error });
    }
  };

  public getCommissionsByUserAndStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { userId, status } = req.query;
      const commissions = await this.commissionService.getCommissionsByUserAndStatus(
        userId as string,
        status as unknown as CommissionStatus
      );
      res.json(commissions);
    } catch (error) {
      logger.error('Error getting commissions by user and status:', error);
      res.status(500).json({ message: 'Error getting commissions by user and status', error });
    }
  };

  public getCommissionsByDateRangeAndStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { startDate, endDate, status } = req.query;
      const commissions = await this.commissionService.getCommissionsByDateRangeAndStatus(
        new Date(startDate as string),
        new Date(endDate as string),
        status as unknown as CommissionStatus
      );
      res.json(commissions);
    } catch (error) {
      logger.error('Error getting commissions by date range and status:', error);
      res.status(500).json({ message: 'Error getting commissions by date range and status', error });
    }
  };

  public getCommissionsByUserAndDateRangeAndStatus = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { userId, startDate, endDate, status } = req.query;
      const commissions = await this.commissionService.getCommissionsByUserAndDateRangeAndStatus(
        userId as string,
        new Date(startDate as string),
        new Date(endDate as string),
        status as unknown as CommissionStatus
      );
      res.json(commissions);
    } catch (error) {
      logger.error('Error getting commissions by user and date range and status:', error);
      res.status(500).json({ message: 'Error getting commissions by user and date range and status', error });
    }
  };

  public updateCommissionStatus = async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const commission = await this.commissionService.updateCommission(
        id,
        { status: status as CommissionStatus }
      );

      res.json(commission);
    } catch (error) {
      logger.error('Error updating commission status:', error);
      throw new AppError('Failed to update commission status', 500);
    }
  };
} 