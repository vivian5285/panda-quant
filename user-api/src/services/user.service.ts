import { User } from '../models/user.model';
import bcrypt from 'bcrypt';
import { DatabaseError } from '../utils/errors';

export class UserService {
  private userModel = User;

  async getUserByEmail(email: string): Promise<User | null> {
    try {
      return await this.userModel.findOne({ email });
    } catch (error) {
      throw new DatabaseError('Error finding user by email');
    }
  }

  async createUser(userData: Partial<User>): Promise<User> {
    try {
      // Hash password before saving
      if (userData.password) {
        const salt = await bcrypt.genSalt(10);
        userData.password = await bcrypt.hash(userData.password, salt);
      }
      
      const user = new this.userModel(userData);
      return await user.save();
    } catch (error) {
      throw new DatabaseError('Error creating user');
    }
  }

  async updateUser(id: string, updateData: Partial<User>): Promise<User | null> {
    try {
      return await this.userModel.findByIdAndUpdate(
        id,
        { $set: updateData },
        { new: true }
      );
    } catch (error) {
      throw new DatabaseError('Error updating user');
    }
  }

  async verifyEmail(email: string): Promise<User | null> {
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

  async validateUser(email: string, password: string): Promise<User | null> {
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
      const result = await this.userModel.deleteOne({ _id: id });
      return result.deletedCount > 0;
    } catch (error) {
      throw new DatabaseError('Failed to delete user', error);
    }
  }

  async getUserById(id: string): Promise<User | null> {
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

  async getAllUsers(page: number = 1, limit: number = 10): Promise<{ users: User[]; total: number }> {
    try {
      const skip = (page - 1) * limit;
      const [users, total] = await Promise.all([
        this.userModel.find().skip(skip).limit(limit),
        this.userModel.countDocuments()
      ]);
      return { users, total };
    } catch (error) {
      throw new DatabaseError('Failed to get users', error);
    }
  }
} 