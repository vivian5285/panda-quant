import { Response } from 'express';
import { AuthenticatedRequest } from '../types/Auth';
import { logger } from '../utils/logger';
import { AuthService } from '../services/auth/AuthService';
import { IUser } from '../models/user.model';
import { isUser, isAuthenticatedRequest } from '../utils/typeGuards';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = AuthService.getInstance();
  }

  public login = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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

  public register = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
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

  public getCurrentUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!isAuthenticatedRequest(req) || !req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
      const user = await this.authService.getCurrentUser(req.user._id.toString());
      if (!isUser(user)) {
        res.status(500).json({ message: 'Invalid user data' });
        return;
      }
      res.json(user);
    } catch (error) {
      logger.error('Error getting current user:', error);
      res.status(500).json({ message: 'Error getting user data', error: (error as Error).message });
    }
  };

  public updateUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!isAuthenticatedRequest(req) || !req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
      const user = await this.authService.updateUser(req.user._id.toString(), req.body);
      if (!isUser(user)) {
        res.status(500).json({ message: 'Invalid user data' });
        return;
      }
      res.json(user);
    } catch (error) {
      logger.error('Error updating user:', error);
      res.status(500).json({ message: 'Error updating user data', error: (error as Error).message });
    }
  };

  public changePassword = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!isAuthenticatedRequest(req) || !req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
      const { currentPassword, newPassword } = req.body;
      if (!currentPassword || !newPassword) {
        res.status(400).json({ message: 'Current password and new password are required' });
        return;
      }
      await this.authService.changePassword(req.user._id.toString(), currentPassword, newPassword);
      res.json({ message: 'Password changed successfully' });
    } catch (error) {
      logger.error('Error changing password:', error);
      res.status(500).json({ message: 'Error changing password', error: (error as Error).message });
    }
  };

  public logout = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!isAuthenticatedRequest(req) || !req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
      await this.authService.logout(req.user._id.toString());
      res.status(200).json({ message: 'Logged out successfully' });
    } catch (error) {
      logger.error('Error during logout:', error);
      res.status(500).json({ message: 'Error during logout', error: (error as Error).message });
    }
  };
}

export default new AuthController(); 