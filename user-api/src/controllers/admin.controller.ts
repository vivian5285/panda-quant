import { Request, Response } from 'express';
import { User } from '../models/user.model';
import { IUser } from '../types/user.types';
import { ValidationError } from '../utils/errors';

export class AdminController {
  static async getUsers(_req: Request, res: Response) {
    try {
      const users = await User.find({}, '-password');
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  }

  static async updateUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const userData: Partial<IUser> = req.body;
      
      const user = await User.findByIdAndUpdate(
        id,
        { $set: userData },
        { new: true, runValidators: true }
      ).select('-password');

      if (!user) {
        throw new ValidationError('User not found');
      }

      res.json(user);
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to update user' });
      }
    }
  }

  static async deleteUser(req: Request, res: Response) {
    try {
      const { id } = req.params;
      const user = await User.findByIdAndDelete(id);

      if (!user) {
        throw new ValidationError('User not found');
      }

      res.json({ message: 'User deleted successfully' });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ error: error.message });
      } else {
        res.status(500).json({ error: 'Failed to delete user' });
      }
    }
  }
} 