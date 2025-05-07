import type { Request, Response } from 'express';
import { User } from '../models/User';
import { logger } from '../utils/logger';
import { AdminService } from '../services/AdminService';

export class AdminController {
  private adminService: AdminService;

  constructor() {
    this.adminService = new AdminService();
  }

  public getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      logger.error('Error in getAllUsers:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  public getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json(user);
    } catch (error) {
      logger.error('Error in getUser:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  public updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json(user);
    } catch (error) {
      logger.error('Error in updateUser:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  public deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const user = await User.findByIdAndDelete(req.params.id);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      logger.error('Error in deleteUser:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  public getSettings = async (_req: Request, res: Response): Promise<void> => {
    try {
      // TODO: Implement settings retrieval
      res.json({ message: 'Settings retrieved successfully' });
    } catch (error) {
      logger.error('Error getting settings:', error);
      res.status(500).json({ message: 'Error getting settings', error });
    }
  };

  public updateSettings = async (req: Request, res: Response): Promise<void> => {
    try {
      // TODO: Implement settings update
      res.json({ message: 'Settings updated successfully' });
    } catch (error) {
      logger.error('Error updating settings:', error);
      res.status(500).json({ message: 'Error updating settings', error });
    }
  };

  public getLogs = async (_req: Request, res: Response): Promise<void> => {
    try {
      // TODO: Implement logs retrieval
      res.json({ message: 'Logs retrieved successfully' });
    } catch (error) {
      logger.error('Error getting logs:', error);
      res.status(500).json({ message: 'Error getting logs', error });
    }
  };

  public getLogById = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      // TODO: Implement log retrieval by id
      res.json({ message: 'Log retrieved successfully', id });
    } catch (error) {
      logger.error('Error getting log by id:', error);
      res.status(500).json({ message: 'Error getting log by id', error });
    }
  };

  public async getAdminDashboard(req: Request, res: Response): Promise<void> {
    try {
      const dashboardData = await this.adminService.getDashboardData();
      res.json(dashboardData);
    } catch (error) {
      logger.error('Error in getAdminDashboard:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
} 