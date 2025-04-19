import { Request, Response } from 'express';
import { VerificationService } from '../services/verification.service';
import { ValidationError } from '../utils/errors';

export class VerificationController {
  private verificationService: VerificationService;

  constructor() {
    this.verificationService = new VerificationService();
  }

  sendCode = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, type } = req.body;

      if (!email || !type) {
        throw new ValidationError('Email and type are required');
      }

      if (type !== 'register' && type !== 'reset-password') {
        throw new ValidationError('Invalid verification type');
      }

      await this.verificationService.sendVerificationEmail(email, type);

      res.json({
        success: true,
        message: 'Verification code sent successfully'
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to send verification code'
        });
      }
    }
  };

  verifyCode = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, code, type } = req.body;

      if (!email || !code || !type) {
        throw new ValidationError('Email, code and type are required');
      }

      if (type !== 'register' && type !== 'reset-password') {
        throw new ValidationError('Invalid verification type');
      }

      const isValid = await this.verificationService.verifyCode(email, code, type);

      if (!isValid) {
        res.status(400).json({
          success: false,
          message: 'Invalid verification code'
        });
        return;
      }

      res.json({
        success: true,
        message: 'Verification code is valid'
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({
          success: false,
          message: error.message
        });
      } else {
        res.status(500).json({
          success: false,
          message: 'Failed to verify code'
        });
      }
    }
  };
} 