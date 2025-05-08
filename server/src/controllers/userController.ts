import type { Request, Response } from 'express';
import { User } from '../models/user.model';
import { logger } from '../utils/logger';

export class UserController {
  async getAllUsers(_req: Request, res: Response): Promise<void> {
    try {
      const users = await User.find();
      res.json(users);
    } catch (error) {
      logger.error('Error getting users:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getUserById(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json(user);
    } catch (error) {
      logger.error('Error getting user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async register(req: Request, res: Response): Promise<void> {
    try {
      const user = new User(req.body);
      await user.save();
      res.status(201).json(user);
    } catch (error) {
      logger.error('Error registering user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndUpdate(id, req.body, { new: true });
      if (!user) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      res.json(user);
    } catch (error) {
      logger.error('Error updating user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const success = await User.findByIdAndDelete(id);
      if (!success) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.status(204).send({});
    } catch (error) {
      logger.error('Error deleting user:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
} 