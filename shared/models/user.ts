import mongoose from 'mongoose';

export interface IUser {
    email: string;
    password: string;
    name: string;
    role: string;
    status: string;
    lastLogin?: Date;
    createdAt: Date;
    updatedAt: Date;
}

const userSchema = new mongoose.Schema<IUser>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    role: { type: String, required: true, enum: ['admin', 'user'] },
    status: { type: String, required: true, enum: ['active', 'inactive'], default: 'active' },
    lastLogin: { type: Date },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

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