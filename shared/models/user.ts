import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

export interface IUser {
    _id?: string;
    email: string;
    password: string;
    name: string;
    role: string;
    status: string;
    balance?: number;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
    comparePassword: (password: string) => Promise<boolean>;
    $assertPopulated: () => void;
    $clone: () => any;
    $getAllSubdocs: () => any[];
}

const userSchema = new mongoose.Schema<IUser>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, required: true, enum: ['admin', 'user'] },
    status: { type: String, required: true, enum: ['active', 'inactive'], default: 'active' },
    balance: { type: Number, default: 0 },
    lastLogin: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// 添加密码比较方法
userSchema.methods.comparePassword = async function(password: string): Promise<boolean> {
    return await bcrypt.compare(password, this.password);
};

// 添加静态方法
userSchema.statics.createAdmin = async function(email: string, password: string, name: string) {
    const admin = new this({
        email,
        password,
        name,
        role: 'admin',
        status: 'active'
    });
    return await admin.save();
};

export const User = mongoose.model<IUser>('User', userSchema); 