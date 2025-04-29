import { User } from '../models/user.model';
import { hashPassword, comparePassword } from '../utils/password';
import { generateToken } from '../utils/jwt';
import { VerificationService } from './verification.service';
import { AuthUser } from '../types/auth.types';

export class AuthService {
  private verificationService: VerificationService;

  constructor() {
    this.verificationService = new VerificationService();
  }

  async register(email: string, password: string, name: string): Promise<User> {
    const hashedPassword = await hashPassword(password);
    const user = await User.create({
      email,
      password: hashedPassword,
      name,
      role: 'user'
    });

    await this.verificationService.sendVerificationEmail(user);
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
      id: user._id.toString(),
      email: user.email,
      role: user.role as 'user' | 'admin'
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
    await this.verificationService.sendVerificationEmail(user);
  }

  async getProfile(userId: string): Promise<User> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async updateProfile(userId: string, data: Partial<User>): Promise<User> {
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

    if (type === 'register') {
      await this.verificationService.sendVerificationEmail(user);
    } else {
      await this.verificationService.sendPasswordResetEmail(user);
    }
  }
} 