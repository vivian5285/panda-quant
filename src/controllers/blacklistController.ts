import { Request, Response } from 'express';
import { BlacklistService } from '../services/blacklistService';
import { IBlacklistEntry } from '../models/blacklist';
import { AuthRequest } from '../types/auth';

export class BlacklistController {
  private blacklistService: BlacklistService;

  constructor() {
    this.blacklistService = BlacklistService.getInstance();
  }

  public createBlacklistEntry = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (req.user?.role !== 'admin') {
        res.status(403).json({ message: 'Unauthorized' });
        return;
      }

      const blacklistEntry = await this.blacklistService.createBlacklistEntry(req.body);
      res.status(201).json(blacklistEntry);
    } catch (error) {
      res.status(500).json({ message: 'Error creating blacklist entry', error });
    }
  };

  public getBlacklistEntryById = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (req.user?.role !== 'admin') {
        res.status(403).json({ message: 'Unauthorized' });
        return;
      }

      const { id } = req.params;
      const blacklistEntry = await this.blacklistService.getBlacklistEntryById(id);
      
      if (!blacklistEntry) {
        res.status(404).json({ message: 'Blacklist entry not found' });
        return;
      }

      res.status(200).json(blacklistEntry);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving blacklist entry', error });
    }
  };

  public getBlacklistEntries = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (req.user?.role !== 'admin') {
        res.status(403).json({ message: 'Unauthorized' });
        return;
      }

      const blacklistEntries = await this.blacklistService.getBlacklistEntries();
      res.status(200).json(blacklistEntries);
    } catch (error) {
      res.status(500).json({ message: 'Error retrieving blacklist entries', error });
    }
  };

  public updateBlacklistEntry = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (req.user?.role !== 'admin') {
        res.status(403).json({ message: 'Unauthorized' });
        return;
      }

      const { id } = req.params;
      const updatedEntry = await this.blacklistService.updateBlacklistEntry(id, req.body);
      
      if (!updatedEntry) {
        res.status(404).json({ message: 'Blacklist entry not found' });
        return;
      }

      res.status(200).json(updatedEntry);
    } catch (error) {
      res.status(500).json({ message: 'Error updating blacklist entry', error });
    }
  };

  public deleteBlacklistEntry = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      if (req.user?.role !== 'admin') {
        res.status(403).json({ message: 'Unauthorized' });
        return;
      }

      const { id } = req.params;
      const deletedEntry = await this.blacklistService.deleteBlacklistEntry(id);
      
      if (!deletedEntry) {
        res.status(404).json({ message: 'Blacklist entry not found' });
        return;
      }

      res.status(200).json({ message: 'Blacklist entry deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error deleting blacklist entry', error });
    }
  };

  public checkUserBlacklistStatus = async (req: AuthRequest, res: Response): Promise<void> => {
    try {
      const { userId } = req.params;
      const isBlacklisted = await this.blacklistService.isUserBlacklisted(userId);
      res.status(200).json({ isBlacklisted });
    } catch (error) {
      res.status(500).json({ message: 'Error checking user blacklist status', error });
    }
  };
} 