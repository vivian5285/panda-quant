import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { logger } from '../utils/logger';
import { CommissionService } from '../services/CommissionService';
import { ProfitService } from '../services/profitService';

export class ProfitController {
  private commissionService: CommissionService;
  private profitService: ProfitService;

  constructor() {
    this.commissionService = CommissionService.getInstance();
    this.profitService = ProfitService.getInstance();
  }

  public getProfitSummary = async (_req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const summary = await this.profitService.getProfitSummary();
      res.json(summary);
    } catch (error) {
      logger.error('Error getting profit summary:', error);
      res.status(500).json({ message: 'Error getting profit summary', error: (error as Error).message });
    }
  };

  public updateCommission = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const updates = req.body;
      const commission = await this.commissionService.updateCommission(id.toString(), updates);
      res.status(200).json(commission);
    } catch (error) {
      logger.error('Error updating commission:', error);
      res.status(500).json({ message: 'Error updating commission', error });
    }
  };

  public deleteCommission = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.commissionService.deleteCommission(id.toString());
      res.status(204).send();
    } catch (error) {
      logger.error('Error deleting commission:', error);
      res.status(500).json({ message: 'Error deleting commission', error });
    }
  };
}

export default new ProfitController(); 