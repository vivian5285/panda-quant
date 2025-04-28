import { Request, Response } from 'express';
import { UserModel, UserRole, UserStatus } from '../models/User';
import { VerificationService } from '../services/verification.service';
import { DatabaseError, ValidationError } from '../utils/errors';
import { generateToken } from '../../middlewares/auth';
import { hashPassword, comparePassword } from '../utils/password';
import { User, IUser } from '../../models/user.model';
import { AuthRequest, AuthUser } from '../../types/auth';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const convertToAuthUser = (user: IUser): AuthUser => {
  return {
    id: user._id.toString(),
    email: user.email,
    role: user.role
  };
};

export class AuthController {
  private userModel: UserModel;
  private verificationService: VerificationService;

  constructor() {
    this.userModel = new UserModel();
    this.verificationService = new VerificationService();
  }

  register = async (req: Request, res: Response) => {
    try {
      const { email, password, username, name, code } = req.body;

      if (!email || !password || !username || !name || !code) {
        throw new ValidationError('Missing required fields');
      }

      // 验证验证码
      const isValid = await this.verificationService.verifyCode('register', email, code);
      if (!isValid) {
        throw new ValidationError('Invalid or expired verification code');
      }

      const hashedPassword = await hashPassword(password);
      const user = await this.userModel.createUser({
        email,
        password: hashedPassword,
        username,
        name,
        isVerified: true,
        role: 'user' as UserRole,
        status: 'active' as UserStatus
      });

      const authUser = convertToAuthUser(user);
      const token = generateToken(authUser.id, authUser.role);

      res.status(201).json({
        token,
        user: authUser
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ message: error.message });
      } else if (error instanceof DatabaseError) {
        res.status(409).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });
      
      if (!user) {
        return res.status(401).json({ message: '用户不存在' });
      }
      
      const isValidPassword = await user.comparePassword(password);
      if (!isValidPassword) {
        return res.status(401).json({ message: '密码错误' });
      }
      
      const authUser = convertToAuthUser(user);
      const token = generateToken(authUser.id, authUser.role);
      
      res.json({
        token,
        user: authUser
      });
    } catch (error) {
      res.status(500).json({ message: '登录失败' });
    }
  };

  verifyEmail = async (req: Request, res: Response) => {
    try {
      const { token } = req.body;

      if (!token) {
        throw new ValidationError('Token is required');
      }

      const userId = await this.verificationService.verifyEmailToken(token);
      await this.userModel.verifyUser(userId);

      res.json({ message: 'Email verified successfully' });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  resendVerification = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      if (!email) {
        throw new ValidationError('Email is required');
      }

      const user = await this.userModel.findUserByEmail(email);
      
      if (!user) {
        throw new ValidationError('User not found');
      }

      if (user.isVerified) {
        throw new ValidationError('Email is already verified');
      }

      await this.verificationService.generateCode('register', user.email);

      res.json({ message: 'Verification email sent' });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  getProfile = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ValidationError('User not authenticated');
      }

      const user = await this.userModel.findUserById(userId);

      if (!user) {
        throw new ValidationError('User not found');
      }

      res.json({
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name
        }
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  updateProfile = async (req: AuthRequest, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ValidationError('User not authenticated');
      }

      const { name } = req.body;

      if (!name) {
        throw new ValidationError('Name is required');
      }

      const user = await this.userModel.updateUser(userId, { name });

      res.json({
        user: {
          id: user._id.toString(),
          email: user.email,
          name: user.name
        }
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  changePassword = async (req: Request, res: Response) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        throw new ValidationError('User not authenticated');
      }

      const { currentPassword, newPassword } = req.body;

      if (!currentPassword || !newPassword) {
        throw new ValidationError('Current password and new password are required');
      }

      const user = await this.userModel.findUserById(userId);

      if (!user) {
        throw new ValidationError('User not found');
      }

      const isPasswordValid = await comparePassword(currentPassword, user.password);
      if (!isPasswordValid) {
        throw new ValidationError('Current password is incorrect');
      }

      const hashedPassword = await hashPassword(newPassword);
      await this.userModel.updateUser(userId, { password: hashedPassword });

      res.json({ message: 'Password updated successfully' });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      if (!email) {
        throw new ValidationError('Email is required');
      }

      const user = await this.userModel.findUserByEmail(email);
      
      if (!user) {
        // Return success even if user doesn't exist for security
        res.json({ message: 'If an account exists with this email, you will receive a password reset link' });
        return;
      }

      await this.verificationService.sendPasswordResetEmail(user);

      res.json({ message: 'If an account exists with this email, you will receive a password reset link' });
    } catch (error) {
      res.status(500).json({ message: 'Internal server error' });
    }
  };

  resetPassword = async (req: Request, res: Response) => {
    try {
      const { token, newPassword } = req.body;

      if (!token || !newPassword) {
        throw new ValidationError('Token and new password are required');
      }

      const userId = await this.verificationService.verifyPasswordResetToken(token);
      const hashedPassword = await hashPassword(newPassword);
      await this.userModel.updateUser(userId, { password: hashedPassword });

      res.json({ message: 'Password reset successfully' });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ message: error.message });
      } else {
        res.status(500).json({ message: 'Internal server error' });
      }
    }
  };

  sendVerificationCode = async (req: Request, res: Response) => {
    try {
      const { email, type } = req.body;

      if (!email || !type) {
        throw new ValidationError('Email and type are required');
      }

      if (type !== 'register' && type !== 'reset-password') {
        throw new ValidationError('Invalid verification type');
      }

      // 如果是注册,检查邮箱是否已存在
      if (type === 'register') {
        const existingUser = await this.userModel.findUserByEmail(email);
        if (existingUser) {
          throw new ValidationError('Email already registered');
        }
      }

      await this.verificationService.generateCode(type, email);
      res.json({
        message: 'Verification code sent successfully'
      });
    } catch (error) {
      if (error instanceof ValidationError) {
        res.status(400).json({ message: error.message });
      } else {
        console.error('Failed to send verification code:', error);
        res.status(500).json({ 
          message: 'Failed to send verification code',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }
  };
}