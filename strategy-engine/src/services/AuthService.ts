import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../models/User';
import { IUser } from '../types/User';
import { IAuthToken, IAuthResponse } from '../types/Auth';

export class AuthService {
  private static readonly JWT_SECRET: string = process.env.JWT_SECRET || 'your-secret-key';
  private static readonly JWT_EXPIRES_IN: number = parseInt(process.env.JWT_EXPIRES_IN || '86400', 10);

  async validateUser(username: string, password: string): Promise<IUser | null> {
    const user = await User.findOne({ username });
    if (!user) return null;

    const isValid = await bcrypt.compare(password, user.password);
    return isValid ? user : null;
  }

  generateToken(user: IUser): IAuthToken {
    return {
      type: 'Bearer',
      token: jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        AuthService.JWT_SECRET,
        { expiresIn: AuthService.JWT_EXPIRES_IN }
      ),
      expiresIn: AuthService.JWT_EXPIRES_IN
    };
  }

  static async verifyToken(token: string): Promise<any> {
    try {
      return jwt.verify(token, AuthService.JWT_SECRET);
    } catch (error) {
      throw new Error('Invalid token');
    }
  }

  static async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  static async comparePassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  static async authenticate(email: string, password: string): Promise<IAuthResponse> {
    // 这里应该从数据库获取用户
    // const user = await UserModel.findOne({ email });
    // if (!user) throw new Error('User not found');

    // const isValid = await this.comparePassword(password, user.password);
    // if (!isValid) throw new Error('Invalid password');

    // const token = await this.generateToken(user);

    // return {
    //   user,
    //   token
    // };

    throw new Error('Not implemented');
  }
} 