import { Request, Response } from 'express';
import { AuthRequest } from '../types/auth';
import { depositService } from '../services/deposit';

export const depositController = {
  async createDeposit(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const deposit = await depositService.createDeposit({
        ...req.body,
        userId: userId.toString()
      });
      res.status(201).json(deposit);
    } catch (error) {
      res.status(500).json({ message: 'Error creating deposit', error });
    }
  },

  async getDeposits(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const deposits = await depositService.getDepositsByUserId(userId.toString());
      res.json(deposits);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching deposits', error });
    }
  },

  async getDepositById(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const deposit = await depositService.getDepositById(req.params.id);
      if (!deposit) {
        return res.status(404).json({ message: 'Deposit not found' });
      }

      if (deposit.userId !== userId.toString()) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      res.json(deposit);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching deposit', error });
    }
  },

  async updateDeposit(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const deposit = await depositService.getDepositById(req.params.id);
      if (!deposit) {
        return res.status(404).json({ message: 'Deposit not found' });
      }

      if (deposit.userId !== userId.toString()) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      const updatedDeposit = await depositService.updateDeposit(req.params.id, req.body);
      res.json(updatedDeposit);
    } catch (error) {
      res.status(500).json({ message: 'Error updating deposit', error });
    }
  },

  async deleteDeposit(req: AuthRequest, res: Response) {
    try {
      const userId = req.user?._id;
      if (!userId) {
        return res.status(401).json({ message: 'Unauthorized' });
      }

      const deposit = await depositService.getDepositById(req.params.id);
      if (!deposit) {
        return res.status(404).json({ message: 'Deposit not found' });
      }

      if (deposit.userId !== userId.toString()) {
        return res.status(403).json({ message: 'Forbidden' });
      }

      await depositService.deleteDeposit(req.params.id);
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: 'Error deleting deposit', error });
    }
  }
}; 