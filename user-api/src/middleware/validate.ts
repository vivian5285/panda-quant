import { Request, Response, NextFunction } from 'express';
import { z } from 'zod';

const depositRequestSchema = z.object({
  chain: z.enum(['OP', 'MATIC', 'TRX', 'BSC', 'ARB']),
  amount: z.string(),
  transactionHash: z.string()
});

export const validateDepositRequest = async (req: Request, res: Response, next: NextFunction) => {
  try {
    depositRequestSchema.parse(req.body);
    next();
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: 'Invalid request data', errors: error.errors });
    }
    return res.status(500).json({ message: 'Internal server error' });
  }
}; 