import { User } from '../models/user.model';
import { UserRepository } from '../repositories/user.repository';
import { Injectable } from '@nestjs/common';
import { db } from '../config/database';
import { hashPassword, comparePassword } from '../utils/password';

@Injectable()
export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async createUser(email: string, password: string) {
    const hashedPassword = await hashPassword(password);
    const user = {
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const result = await db.collection('users').insertOne(user);
    return { ...user, _id: result.insertedId };
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User | null> {
    return this.userRepository.update(id, userData);
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.userRepository.delete(id);
  }

  async validateUser(email: string, password: string) {
    const user = await this.getUserByEmail(email);
    if (!user) {
      return null;
    }
    
    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      return null;
    }
    
    return user;
  }

  async resetPassword(email: string, newPassword: string) {
    const hashedPassword = await hashPassword(newPassword);
    await db.collection('users').updateOne(
      { email },
      { $set: { password: hashedPassword, updatedAt: new Date() } }
    );
  }
} 