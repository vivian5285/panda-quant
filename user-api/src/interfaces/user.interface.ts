export interface IUserInput {
    email: string;
    password: string;
    name: string;
    username: string;
    isVerified?: boolean;
    role?: 'user' | 'admin';
}

export interface IUser extends IUserInput {
    id: string;
    createdAt: Date;
    updatedAt: Date;
    verificationCode?: string;
    verificationCodeExpires?: Date;
    role: 'user' | 'admin';
} 