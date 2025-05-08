import { IUser } from '../types/user.types';
import { User } from '../models/user.model';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { VerificationService } from './verification.service';
import { AuthUser } from '../types/auth.types';
import { VerificationUser } from '../types/verification.types';

export class AuthService {
  private verificationService: VerificationService;

  constructor() {
    this.verificationService = new VerificationService();
  }

  async register(email: string, password: string, name: string): Promise<IUser> {
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      role: 'user'
    });

    const verificationUser: VerificationUser = {
      email: user.email,
      verificationCode: user.verificationCode || ''
    };
    await this.verificationService.sendVerificationEmail(verificationUser);
    return user;
  }

  async login(email: string, password: string): Promise<string> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      throw new Error('Invalid credentials');
    }

    if (!user.isVerified) {
      throw new Error('Email not verified');
    }

    const authUser: AuthUser = {
      id: user.id,
      email: user.email,
      role: user.role
    };

    return generateToken(authUser);
  }

  async verifyEmail(code: string): Promise<void> {
    await this.verificationService.verifyEmailCode(code);
  }

  async resendVerification(email: string): Promise<void> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }
    const verificationUser: VerificationUser = {
      email: user.email,
      verificationCode: user.verificationCode || ''
    };
    await this.verificationService.sendVerificationEmail(verificationUser);
  }

  async getProfile(userId: string): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async updateProfile(userId: string, data: Partial<IUser>): Promise<IUser> {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: data },
      { new: true }
    );
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const isValid = await comparePassword(currentPassword, user.password);
    if (!isValid) {
      throw new Error('Invalid current password');
    }

    const hashedPassword = await hashPassword(newPassword);
    user.password = hashedPassword;
    await user.save();
  }

  async forgotPassword(email: string): Promise<void> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }
    await this.verificationService.sendPasswordResetEmail(user);
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    const hashedPassword = await hashPassword(newPassword);
    await this.verificationService.resetPassword(token, hashedPassword);
  }

  async sendVerificationCode(email: string, type: 'register' | 'reset-password'): Promise<void> {
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    const verificationUser: VerificationUser = {
      email: user.email,
      verificationCode: user.verificationCode || ''
    };

    if (type === 'register') {
      await this.verificationService.sendVerificationEmail(verificationUser);
    } else {
      await this.verificationService.sendPasswordResetEmail(user);
    }
  }
} 