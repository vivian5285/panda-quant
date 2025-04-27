import mongoose, { Document, Types } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    email: string;
    username?: string;
    password: string;
    walletAddress?: string;
    role: 'user' | 'admin';
    status: 'active' | 'suspended' | 'inactive';
    isAdmin: boolean;
    adminType?: string;
    permissions: Record<string, any>;
    balance: number;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
    referralCode?: string;
    referredBy?: Types.ObjectId;
    name: string;
    comparePassword: (candidatePassword: string) => Promise<boolean>;
}

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, enum: ['admin', 'user'], default: 'user' },
    status: { type: String, required: true, enum: ['active', 'inactive'], default: 'active' },
    balance: { type: Number, default: 0 },
    lastLogin: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// 添加密码比较方法
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
    return bcrypt.compare(candidatePassword, this.password);
};

// 添加静态方法
userSchema.statics.createAdmin = async function(email: string, password: string, name: string) {
    const hashedPassword = await bcrypt.hash(password, 10);
    return this.create({ email, password: hashedPassword, name, role: 'admin' });
};

export const User = mongoose.model<IUser>('User', userSchema); 