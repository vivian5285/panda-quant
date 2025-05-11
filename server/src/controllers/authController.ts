import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types/Auth';
import { logger } from '../utils/logger';
import { AuthService } from '../services/AuthService';
import { IUserDocument } from '../types/User';
import { isUser, isAuthenticatedRequest } from '../utils/typeGuards';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = AuthService.getInstance();
  }

  public login = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
      }
      const result = await this.authService.login({ email, password });
      res.json(result);
    } catch (error) {
      logger.error('Error during login:', error);
      res.status(401).json({ message: 'Invalid credentials' });
    }
  };

  public register = async (req: Request, res: Response): Promise<void> => {
    try {
      const { email, password, name } = req.body;
      if (!email || !password) {
        res.status(400).json({ message: 'Email and password are required' });
        return;
      }
      const userData = {
        email,
        password,
        confirmPassword: password,
        username: email.split('@')[0]
      };
      const user = await this.authService.register(userData);
      res.status(201).json(user);
    } catch (error) {
      logger.error('Error during registration:', error);
      res.status(400).json({ message: 'Registration failed', error: (error as Error).message });
    }
  };

  public getCurrentUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as AuthenticatedRequest).user;
      if (!user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
      const userData = await this.authService.getCurrentUser(user._id.toString());
      if (!isUser(userData)) {
        res.status(500).json({ message: 'Invalid user data' });
        return;
      }
      res.json(userData);
    } catch (error) {
      logger.error('Error getting current user:', error);
      res.status(500).json({ message: 'Error getting user data', error: (error as Error).message });
    }
  };

  public updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as AuthenticatedRequest).user;
      if (!user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
      const userData = await this.authService.updateUser(user._id.toString(), req.body);
      if (!isUser(userData)) {
        res.status(500).json({ message: 'Invalid user data' });
        return;
      }
      res.json(userData);
    } catch (error) {
      logger.error('Error updating user:', error);
      res.status(500).json({ message: 'Error updating user data', error: (error as Error).message });
    }
  };

  public changePassword = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as AuthenticatedRequest).user;
      if (!user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        res.status(400).json({ message: 'Current password and new password are required' });
        return;
      }
      await this.authService.changePassword(user._id.toString(), currentPassword, newPassword);
      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      logger.error('Error changing password:', error);
      res.status(500).json({ message: 'Error changing password', error: (error as Error).message });
    }
  };

  public logout = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = (req as AuthenticatedRequest).user;
      if (!user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
      await this.authService.logout(user._id.toString());
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      logger.error('Error during logout:', error);
      res.status(500).json({ message: 'Error during logout', error: (error as Error).message });
    }
  };
}

export default new AuthController(); 