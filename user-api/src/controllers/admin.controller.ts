import { Request, Response } from 'express';
import { UserModel } from '../models/user.model';
import { ValidationError } from '../utils/errors';

export class AdminController {
  constructor(private userModel: UserModel) {}

  listUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const { users, total } = await this.userModel.findAllUsers(page, limit);

      res.json({
        status: 'success',
        data: {
          users: users.map(user => ({
            ...user,
            password_hash: undefined
          })),
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error listing users'
      });
    }
  };

  searchUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const { query } = req.query;
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      if (!query) {
        throw new ValidationError('Search query is required');
      }

      const { users, total } = await this.userModel.searchUsers(query as string, page, limit);

      res.json({
        status: 'success',
        data: {
          users: users.map(user => ({
            ...user,
            password_hash: undefined
          })),
          pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit)
          }
        }
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({
          status: 'error',
          message: error.message
        });
      } else {
        res.status(500).json({
          status: 'error',
          message: 'Error searching users'
        });
      }
    }
  };

  updateUserRole = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { role, isAdmin, adminType } = req.body;

      if (!role) {
        throw new ValidationError('Role is required');
      }

      const user = await this.userModel.updateUserRole(
        id.toString(),
        role,
        isAdmin || false,
        adminType
      );

      res.json({
        status: 'success',
        data: {
          user: {
            ...user,
            password_hash: undefined
          }
        }
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({
          status: 'error',
          message: error.message
        });
      } else {
        res.status(500).json({
          status: 'error',
          message: 'Error updating user role'
        });
      }
    }
  };

  updateUserPermissions = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { permissions } = req.body;

      if (!permissions) {
        throw new ValidationError('Permissions are required');
      }

      const user = await this.userModel.updateUserPermissions(id.toString(), permissions);

      res.json({
        status: 'success',
        data: {
          user: {
            ...user,
            password_hash: undefined
          }
        }
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({
          status: 'error',
          message: error.message
        });
      } else {
        res.status(500).json({
          status: 'error',
          message: 'Error updating user permissions'
        });
      }
    }
  };

  deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      await this.userModel.deleteUser(id.toString());

      res.json({
        status: 'success',
        message: 'User deleted successfully'
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        message: 'Error deleting user'
      });
    }
  };
} 