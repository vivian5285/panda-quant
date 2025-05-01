import { Response } from 'express';
import { AuthRequest } from '../types/express.d';
import { depositService } from '../services/deposit';

export const createDeposit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { chain } = req.body;
    const address = await depositService.getDepositAddress(req.user!.id, chain);
    res.json({ address });
  } catch (error) {
    res.status(500).json({ error: 'Failed to create deposit' });
  }
};

export const getDeposits = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const deposits = await depositService.getDepositsByUserId(req.user!.id);
    res.json(deposits);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get deposits' });
  }
};

export const getDeposit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deposit = await depositService.getDepositById(id);
    if (!deposit) {
      res.status(404).json({ error: 'Deposit not found' });
      return;
    }
    res.json(deposit);
  } catch (error) {
    res.status(500).json({ error: 'Failed to get deposit' });
  }
};

export const updateDeposit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const deposit = await depositService.updateDeposit(id, { status });
    if (!deposit) {
      res.status(404).json({ error: 'Deposit not found' });
      return;
    }
    res.json(deposit);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update deposit' });
  }
};

export const deleteDeposit = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const deposit = await depositService.deleteDeposit(id);
    if (!deposit) {
      res.status(404).json({ error: 'Deposit not found' });
      return;
    }
    res.json({ message: 'Deposit deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete deposit' });
  }
}; 