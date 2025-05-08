import { IUser } from '../types/User';
import { AuthToken, IAuthResponse, ILoginCredentials, IRegisterData, IResetPasswordData } from '../types/Auth';
import { User, IUserDocument } from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { logger } from '../utils/logger';
import { config } from '../config';
import { UnauthorizedError, BadRequestError } from '../utils/errors';

export class AuthService {
  private static instance: AuthService;

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  private convertToIUser(user: IUserDocument): IUser {
    const userObj = user.toObject();
    return {
      ...userObj,
      id: userObj._id.toString(),
      _id: userObj._id,
      isActive: userObj.isActive ?? true
    };
  }

  public async register(data: IRegisterData): Promise<IAuthResponse> {
    try {
      const existingUser = await User.findOne({ email: data.email });
      if (existingUser) {
        throw new Error('User already exists');
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);
      const user = new User({
        email: data.email,
        password: hashedPassword,
        username: data.username,
        isActive: true
      });

      await user.save();
      const { token } = this.generateToken(user);

      return {
        user: user,
        token: token,
        refreshToken: token
      };
    } catch (error) {
      logger.error('Error in register:', error);
      throw error;
    }
  }

  public async login(credentials: ILoginCredentials): Promise<IAuthResponse> {
    try {
      const user = await User.findOne({ email: credentials.email });
      if (!user) {
        throw new Error('User not found');
      }

      const isValidPassword = await bcrypt.compare(credentials.password, user.password);
      if (!isValidPassword) {
        throw new Error('Invalid password');
      }

      const { token } = this.generateToken(user);
      return {
        user: user,
        token: token,
        refreshToken: token
      };
    } catch (error) {
      logger.error('Error in login:', error);
      throw error;
    }
  }

  public async logout(userId: string): Promise<void> {
    try {
      // In a real application, you might want to invalidate the token here
      // For now, we'll just log the logout
      logger.info(`User ${userId} logged out`);
    } catch (error) {
      logger.error('Logout error:', error);
      throw error;
    }
  }

  public async getCurrentUser(userId: string): Promise<IUser> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }
      return this.convertToIUser(user);
    } catch (error) {
      logger.error('Get current user error:', error);
      throw error;
    }
  }

  public async refreshToken(refreshToken: string): Promise<AuthToken> {
    try {
      const decoded = jwt.verify(refreshToken, process.env['JWT_SECRET'] || 'your-secret-key') as { id: string; email: string };
      const user = await User.findById(decoded.id);
      if (!user) {
        throw new Error('User not found');
      }

      const newToken = this.generateToken(user);
      return newToken;
    } catch (error) {
      logger.error('Refresh token error:', error);
      throw new Error('Invalid refresh token');
    }
  }

  public async updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      // Update only allowed fields
      if (updateData.name) {
        user.name = updateData.name;
      }
      if (updateData.email) {
        user.email = updateData.email;
      }

      await user.save();
      return this.convertToIUser(user);
    } catch (error) {
      logger.error('Update user error:', error);
      throw error;
    }
  }

  public async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error('User not found');
      }

      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        throw new Error('Current password is incorrect');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      user.password = hashedPassword;
      await user.save();
    } catch (error) {
      logger.error('Change password error:', error);
      throw error;
    }
  }

  private generateToken(user: IUserDocument): AuthToken {
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    return {
      token,
      expiresIn: 24 * 60 * 60 // 24 hours in seconds
    };
  }

  async resetPassword(data: IResetPasswordData): Promise<void> {
    try {
      const user = await User.findOne({ resetToken: data.token });
      if (!user) {
        throw new Error('Invalid reset token');
      }

      const hashedPassword = await bcrypt.hash(data.newPassword, 10);
      user.password = hashedPassword;
      user.resetToken = undefined;
      await user.save();
    } catch (error) {
      logger.error('Error in resetPassword:', error);
      throw error;
    }
  }
} 