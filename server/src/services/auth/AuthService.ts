import { IUser } from '../../models/user.model';
import { IRegisterData, ILoginData, IAuthResponse } from '../../types/Auth';
import { User } from '../../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Types } from 'mongoose';
import { isUser } from '../../utils/typeGuards';

export class AuthService {
  private static instance: AuthService;
  private readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private readonly JWT_EXPIRES_IN = '24h';

  private constructor() {}

  public static getInstance(): AuthService {
    if (!AuthService.instance) {
      AuthService.instance = new AuthService();
    }
    return AuthService.instance;
  }

  public async register(userData: IRegisterData): Promise<IAuthResponse> {
    const { email, password, username } = userData;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await User.create({
      email,
      password: hashedPassword,
      username,
      role: 'user',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    });

    const userObject = user.toObject();
    if (!isUser(userObject)) {
      throw new Error('Invalid user data');
    }

    // Generate tokens
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      this.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      user: userObject,
      token,
      refreshToken
    };
  }

  public async login(credentials: ILoginData): Promise<IAuthResponse> {
    const { email, password } = credentials;

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User not found');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid password');
    }

    const userObject = user.toObject();
    if (!isUser(userObject)) {
      throw new Error('Invalid user data');
    }

    // Generate tokens
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      this.JWT_SECRET,
      { expiresIn: this.JWT_EXPIRES_IN }
    );

    const refreshToken = jwt.sign(
      { userId: user._id },
      this.JWT_SECRET,
      { expiresIn: '7d' }
    );

    return {
      user: userObject,
      token,
      refreshToken
    };
  }

  public async getCurrentUser(userId: string): Promise<IUser> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    const userObject = user.toObject();
    if (!isUser(userObject)) {
      throw new Error('Invalid user data');
    }
    return userObject;
  }

  public async updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser> {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updateData },
      { new: true }
    );
    if (!user) {
      throw new Error('User not found');
    }
    const userObject = user.toObject();
    if (!isUser(userObject)) {
      throw new Error('Invalid user data');
    }
    return userObject;
  }

  public async changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void> {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
  }

  public async logout(userId: string): Promise<void> {
    // Implement logout logic if needed
    // For example, invalidate refresh tokens
  }
} 