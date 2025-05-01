import { Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
import { logger } from '../utils/logger';
import { AuthService } from '../services/authService';
import { IUser } from '../types/user';

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
        role: 'user',
        level: 1,
        status: 'active',
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
}

export default new AuthController(); 