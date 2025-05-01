import { User, IUser } from '../models/User';
import bcrypt from 'bcrypt';
import { DatabaseError } from '../utils/errors';

export class UserService {
  private userModel = User;

  async getUserByEmail(email: string): Promise<IUser | null> {
    try {
      return await this.userModel.findOne({ email });
    } catch (error) {
      throw new DatabaseError('Failed to get user by email', error);
    }
  }

  async createUser(userData: Partial<IUser>): Promise<IUser> {
    try {
      // Hash password before saving
      if (userData.password) {
        const salt = await bcrypt.genSalt(10);
        userData.password = await bcrypt.hash(userData.password, salt);
      }
      
      const user = new this.userModel(userData);
      return await user.save();
    } catch (error) {
      throw new DatabaseError('Failed to create user', error);
    }
  }

  async updateUser(id: string, userData: Partial<IUser>): Promise<IUser | null> {
    try {
      return await this.userModel.findByIdAndUpdate(
        id,
        { $set: userData },
        { new: true, runValidators: true }
      );
    } catch (error) {
      throw new DatabaseError('Failed to update user', error);
    }
  }

  async verifyEmail(email: string): Promise<IUser | null> {
    try {
      return await this.userModel.findOneAndUpdate(
        { email },
        { $set: { isEmailVerified: true } },
        { new: true }
      );
    } catch (error) {
      throw new DatabaseError('Error verifying email');
    }
  }

  async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcrypt.compare(password, hash);
  }

  async validateUser(email: string, password: string): Promise<IUser | null> {
    try {
      const user = await this.getUserByEmail(email);
      if (!user) return null;

      const isValid = await bcrypt.compare(password, user.password);
      return isValid ? user : null;
    } catch (error) {
      throw new DatabaseError('Failed to validate user', error);
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const result = await this.userModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      throw new DatabaseError('Failed to delete user', error);
    }
  }

  async getUserById(id: string): Promise<IUser | null> {
    try {
      const user = await this.userModel.findById(id);
      if (!user) {
        throw new Error('User not found');
      }
      return user;
    } catch (error) {
      console.error('Error getting user:', error);
      throw error;
    }
  }

  async getAllUsers(page: number = 1, limit: number = 10): Promise<{ users: IUser[]; total: number }> {
    try {
      const skip = (page - 1) * limit;
      const users = await this.userModel.find().skip(skip).limit(limit);
      const total = await this.userModel.countDocuments();
      return { users, total };
    } catch (error) {
      throw new DatabaseError('Failed to get users', error);
    }
  }
} 