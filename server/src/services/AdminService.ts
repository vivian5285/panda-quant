import { User } from '../models/User';
import { logger } from '../utils/logger';

export class AdminService {
  public async getDashboardData() {
    try {
      const totalUsers = await User.countDocuments();
      const activeUsers = await User.countDocuments({ status: 'active' });
      const inactiveUsers = await User.countDocuments({ status: 'inactive' });

      return {
        totalUsers,
        activeUsers,
        inactiveUsers,
        // Add more dashboard data as needed
      };
    } catch (error) {
      logger.error('Error in getDashboardData:', error);
      throw error;
    }
  }

  public async getUserStats() {
    try {
      const stats = await User.aggregate([
        {
          $group: {
            _id: '$role',
            count: { $sum: 1 }
          }
        }
      ]);

      return stats;
    } catch (error) {
      logger.error('Error in getUserStats:', error);
      throw error;
    }
  }

  public async getSystemStats() {
    try {
      // Implement system statistics collection
      return {
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage()
      };
    } catch (error) {
      logger.error('Error in getSystemStats:', error);
      throw error;
    }
  }
} 