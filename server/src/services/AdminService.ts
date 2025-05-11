import { IUser } from '../types/User';
import UserModel from '../models/User.model';
import { logger } from '../utils/Logger';

export class AdminService {
  private static instance: AdminService;

  private constructor() {}

  public static getInstance(): AdminService {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService();
    }
    return AdminService.instance;
  }

  async getAdminDashboard() {
    try {
      const totalUsers = await UserModel.countDocuments();
      const activeUsers = await UserModel.countDocuments({ status: 'active' });
      const inactiveUsers = await UserModel.countDocuments({ status: 'inactive' });

      return {
        totalUsers,
        activeUsers,
        inactiveUsers,
        // Add more dashboard statistics as needed
      };
    } catch (error) {
      logger.error('Error in getAdminDashboard:', error);
      throw error;
    }
  }

  async getAllUsers() {
    try {
      return await UserModel.find().select('-password');
    } catch (error) {
      logger.error('Error in getAllUsers:', error);
      throw error;
    }
  }

  async getUserById(id: string) {
    try {
      return await UserModel.findById(id).select('-password');
    } catch (error) {
      logger.error('Error in getUserById:', error);
      throw error;
    }
  }

  async updateUser(id: string, userData: Partial<IUser>) {
    try {
      return await UserModel.findByIdAndUpdate(
        id,
        { $set: userData },
        { new: true }
      ).select('-password');
    } catch (error) {
      logger.error('Error in updateUser:', error);
      throw error;
    }
  }

  async deleteUser(id: string) {
    try {
      return await UserModel.findByIdAndDelete(id);
    } catch (error) {
      logger.error('Error in deleteUser:', error);
      throw error;
    }
  }
} 