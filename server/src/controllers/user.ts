import { Request, Response } from 'express';
import { UserService } from '../services/UserService';
import { AuthenticatedRequest } from '../types/auth';
import { logger } from '../utils/logger';

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = UserService.getInstance();
  }

  async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      const result = await this.userService.authenticate(email, password);
      res.json(result);
    } catch (error) {
      logger.error('Login error:', error);
      res.status(401).json({ message: 'Invalid credentials' });
    }
  }

  async register(req: Request, res: Response) {
    try {
      const user = await this.userService.createUser(req.body);
      res.status(201).json(user);
    } catch (error) {
      logger.error('Registration error:', error);
      res.status(400).json({ message: 'Registration failed' });
    }
  }

  public getProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
      const user = await this.userService.getUserById(req.user._id.toString());
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.json(user);
    } catch (error) {
      logger.error('Error getting profile:', error);
      res.status(500).json({ message: 'Error getting profile', error });
    }
  };

  public updateProfile = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
      const user = await this.userService.updateUser(req.user._id.toString(), req.body);
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.json(user);
    } catch (error) {
      logger.error('Error updating profile:', error);
      res.status(500).json({ message: 'Error updating profile', error });
    }
  };

  public deleteUser = async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user) {
        res.status(401).json({ message: 'User not authenticated' });
        return;
      }
      await this.userService.deleteUser(req.user._id.toString());
      res.status(204).send();
    } catch (error) {
      logger.error('Error deleting user:', error);
      res.status(500).json({ message: 'Error deleting user', error });
    }
  };
} 