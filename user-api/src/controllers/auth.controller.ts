import { Request, Response } from 'express';
import { IUser } from '../models/User';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../types/api';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, name } = req.body;
      const user = await this.authService.register(email, password, name);
      const response: ApiResponse<IUser> = {
        success: true,
        data: user,
        error: null
      };
      res.status(201).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'An error occurred'
      };
      res.status(400).json(response);
    }
  }

  async login(req: Request, res: Response): Promise<void> {
    try {
      const { email, password } = req.body;
      const token = await this.authService.login(email, password);
      const response: ApiResponse<{ token: string }> = {
        success: true,
        data: { token },
        error: null
      };
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'An error occurred'
      };
      res.status(401).json(response);
    }
  }

  async verifyEmail(req: Request, res: Response): Promise<void> {
    try {
      const { code } = req.body;
      await this.authService.verifyEmail(code);
      const response: ApiResponse<null> = {
        success: true,
        data: null,
        error: null
      };
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'An error occurred'
      };
      res.status(400).json(response);
    }
  }

  async resendVerification(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      await this.authService.resendVerification(email);
      const response: ApiResponse<null> = {
        success: true,
        data: null,
        error: null
      };
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'An error occurred'
      };
      res.status(400).json(response);
    }
  }

  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }
      const user = await this.authService.getProfile(userId);
      const response: ApiResponse<IUser> = {
        success: true,
        data: user,
        error: null
      };
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'An error occurred'
      };
      res.status(401).json(response);
    }
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }
      const user = await this.authService.updateProfile(userId, req.body);
      const response: ApiResponse<IUser> = {
        success: true,
        data: user,
        error: null
      };
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'An error occurred'
      };
      res.status(400).json(response);
    }
  }

  async changePassword(req: Request, res: Response): Promise<void> {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new Error('User not authenticated');
      }
      const { currentPassword, newPassword } = req.body;
      await this.authService.changePassword(userId, currentPassword, newPassword);
      const response: ApiResponse<null> = {
        success: true,
        data: null,
        error: null
      };
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'An error occurred'
      };
      res.status(400).json(response);
    }
  }

  async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      await this.authService.forgotPassword(email);
      const response: ApiResponse<null> = {
        success: true,
        data: null,
        error: null
      };
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'An error occurred'
      };
      res.status(400).json(response);
    }
  }

  async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { token, newPassword } = req.body;
      await this.authService.resetPassword(token, newPassword);
      const response: ApiResponse<null> = {
        success: true,
        data: null,
        error: null
      };
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'An error occurred'
      };
      res.status(400).json(response);
    }
  }

  async sendVerificationCode(req: Request, res: Response): Promise<void> {
    try {
      const { email, type } = req.body;
      await this.authService.sendVerificationCode(email, type);
      const response: ApiResponse<null> = {
        success: true,
        data: null,
        error: null
      };
      res.status(200).json(response);
    } catch (error) {
      const response: ApiResponse<null> = {
        success: false,
        data: null,
        error: error instanceof Error ? error.message : 'An error occurred'
      };
      res.status(400).json(response);
    }
  }
}