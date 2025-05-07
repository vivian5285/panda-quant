import { Response } from 'express';
import { AuthenticatedRequest } from '../types/Auth';
import { logger } from '../utils/logger';
import { AuthService } from '../services/AuthService';
import { IUser } from '../types/User';
import { UserRole, UserLevel, UserStatus } from '../types/Enums';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public login = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      res.json(result);
    } catch (error) {
      logger.error('Error during login:', error);
      res.status(401).json({ message: 'Invalid credentials' });
    }
  };

  public register = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      const { email, password, name } = req.body;
      const userData: Partial<IUser> = {
        email,
        password,
        name,
        username: email.split('@')[0],
        role: UserRole.USER,
        level: UserLevel.BASIC,
        status: UserStatus.ACTIVE,
        permissions: []
      };
      const user = await this.authService.register(userData as IUser);
      res.status(201).json(user);
    } catch (error) {
      logger.error('Error during registration:', error);
      res.status(400).json({ message: 'Registration failed', error: (error as Error).message });
    }
  };

  public getCurrentUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
      const user = await this.authService.getCurrentUser(req.user._id.toString());
      res.json(user);
    } catch (error) {
      logger.error('Error getting current user:', error);
      res.status(500).json({ message: 'Error getting current user', error: (error as Error).message });
    }
  };

  public logout = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      // 清除用户会话或令牌
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      logger.error('Error during logout:', error);
      res.status(500).json({ message: 'Error during logout', error: (error as Error).message });
    }
  };

  public updateUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
      const user = await this.authService.updateUser(req.user._id.toString(), req.body);
      res.json(user);
    } catch (error) {
      logger.error('Error updating user:', error);
      res.status(500).json({ message: 'Error updating user', error: (error as Error).message });
    }
  };

  public changePassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
      const { currentPassword, newPassword } = req.body;
      await this.authService.changePassword(req.user._id.toString(), currentPassword, newPassword);
      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      logger.error('Error changing password:', error);
      res.status(500).json({ message: 'Error changing password', error: (error as Error).message });
    }
  };
}

export default new AuthController(); 