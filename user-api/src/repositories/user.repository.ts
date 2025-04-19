import { User } from '../models/user.model';
import { db } from '../config/database';
import crypto from 'crypto';
import { ObjectId } from 'mongodb';
import { IUser } from '../models/user.model';
import { Document, ModifyResult } from 'mongoose';
import { WithId } from 'mongodb';

export class UserRepository {
  private readonly collection = db.collection('users');

  async findByEmail(email: string): Promise<User | null> {
    const user = await this.collection.findOne({ email });
    return user as User | null;
  }

  async create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Promise<User> {
    const now = new Date();
    const newUser: User = {
      ...user,
      id: crypto.randomUUID(),
      createdAt: now,
      updatedAt: now
    };
    await this.collection.insertOne(newUser);
    return newUser;
  }

  async update(id: string, user: Partial<User>): Promise<User | null> {
    const updateData = {
      ...user,
      updatedAt: new Date()
    };
    const result = await this.collection.findOneAndUpdate(
      { id },
      { $set: updateData },
      { returnDocument: 'after' }
    );
    return result as User | null;
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ id });
    return result.deletedCount === 1;
  }

  async updateUser(id: string, userData: Partial<IUser>): Promise<User | null> {
    const result = await db.collection('users').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: userData },
      { returnDocument: 'after' }
    );
    
    if (!result || !result.value) return null;
    
    const doc = result.value as WithId<Document>;
    return {
      id: doc._id.toString(),
      email: doc.email as string,
      password: doc.password as string,
      name: (doc.name as string) || '',
      isVerified: (doc.isVerified as boolean) || false,
      verificationCode: doc.verificationCode as string | undefined,
      verificationCodeExpires: doc.verificationCodeExpires as Date | undefined,
      createdAt: doc.createdAt as Date,
      updatedAt: doc.updatedAt as Date
    };
  }
} 