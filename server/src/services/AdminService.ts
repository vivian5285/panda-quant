import { Types } from 'mongoose';
import { Admin } from '../models/Admin.model';
import { IAdmin, IAdminDocument, IAdminCreateInput, IAdminUpdateInput } from '../types/Admin';
import { logger } from '../utils/Logger';
import { IUser } from '../types/User';
import UserModel from '../models/User.model';
import { AppError } from '../utils/AppError';
import bcrypt from 'bcryptjs';

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

  private convertToIAdmin(admin: IAdminDocument): IAdmin {
    return {
      _id: admin._id,
      email: admin.email,
      password: admin.password,
      name: admin.name,
      role: admin.role,
      permissions: admin.permissions,
      isActive: admin.isActive,
      lastLogin: admin.lastLogin,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt,
      comparePassword: admin.comparePassword.bind(admin)
    };
  }

  async createAdmin(data: IAdminCreateInput): Promise<IAdmin> {
    try {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(data.password, salt);

      const admin = new Admin({
        ...data,
        password: hashedPassword
      });

      await admin.save();
      return this.convertToIAdmin(admin);
    } catch (error) {
      logger.error('Error creating admin:', error);
      throw new AppError('Failed to create admin', 500);
    }
  }

  async getAdminById(id: string): Promise<IAdmin | null> {
    try {
      const admin = await Admin.findById(id);
      return admin ? this.convertToIAdmin(admin) : null;
    } catch (error) {
      logger.error('Error getting admin by id:', error);
      throw new AppError('Failed to get admin', 500);
    }
  }

  async getAdminByEmail(email: string): Promise<IAdmin | null> {
    try {
      const admin = await Admin.findOne({ email });
      return admin ? this.convertToIAdmin(admin) : null;
    } catch (error) {
      logger.error('Error getting admin by email:', error);
      throw new AppError('Failed to get admin', 500);
    }
  }

  async updateAdmin(id: string, data: IAdminUpdateInput): Promise<IAdmin | null> {
    try {
      const admin = await Admin.findById(id);
      if (!admin) {
        return null;
      }

      if (data.password) {
        const salt = await bcrypt.genSalt(10);
        data.password = await bcrypt.hash(data.password, salt);
      }

      Object.assign(admin, data);
      await admin.save();
      return this.convertToIAdmin(admin);
    } catch (error) {
      logger.error('Error updating admin:', error);
      throw new AppError('Failed to update admin', 500);
    }
  }

  async deleteAdmin(id: string): Promise<void> {
    try {
      await Admin.findByIdAndDelete(id);
    } catch (error) {
      logger.error('Error deleting admin:', error);
      throw new AppError('Failed to delete admin', 500);
    }
  }

  async validatePassword(admin: IAdmin, password: string): Promise<boolean> {
    try {
      return await bcrypt.compare(password, admin.password);
    } catch (error) {
      logger.error('Error validating password:', error);
      throw new AppError('Failed to validate password', 500);
    }
  }
} 