import { Request, Response } from 'express';
import { UserLevelService } from '../services/userLevelService';
import { AuthRequest } from '../types';

export class UserLevelController {
  private userLevelService: UserLevelService;

  constructor() {
    this.userLevelService = UserLevelService.getInstance();
  }

  public async createUserLevel(req: AuthRequest, res: Response) {
    try {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
      }

      const userLevel = await this.userLevelService.createUserLevel(req.body);
      res.status(201).json(userLevel);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }

  public async getUserLevelById(req: AuthRequest, res: Response) {
    try {
      const userLevel = await this.userLevelService.getUserLevelById(req.params.id);
      if (!userLevel) {
        return res.status(404).json({ error: 'User level not found' });
      }
      res.json(userLevel);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }

  public async getUserLevels(req: AuthRequest, res: Response) {
    try {
      const userLevels = await this.userLevelService.getUserLevels();
      res.json(userLevels);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }

  public async updateUserLevel(req: AuthRequest, res: Response) {
    try {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
      }

      const userLevel = await this.userLevelService.updateUserLevel(req.params.id, req.body);
      if (!userLevel) {
        return res.status(404).json({ error: 'User level not found' });
      }
      res.json(userLevel);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }

  public async deleteUserLevel(req: AuthRequest, res: Response) {
    try {
      if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
      }

      const userLevel = await this.userLevelService.deleteUserLevel(req.params.id);
      if (!userLevel) {
        return res.status(404).json({ error: 'User level not found' });
      }
      res.json({ message: 'User level deleted successfully' });
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'An unknown error occurred' });
      }
    }
  }
} 