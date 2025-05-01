import { IUser } from '../types/user';
export declare class UserService {
    private static instance;
    private constructor();
    static getInstance(): UserService;
    getAllUsers(): Promise<IUser[]>;
    createUser(data: Partial<IUser>): Promise<IUser>;
    updateUser(id: string, data: Partial<IUser>): Promise<IUser>;
    deleteUser(id: string): Promise<IUser>;
    getUserById(id: string): Promise<IUser>;
    login(email: string, password: string): Promise<string>;
    register(email: string, password: string, username: string): Promise<IUser>;
    getProfile(userId: string): Promise<IUser>;
    updateProfile(userId: string, data: Partial<IUser>): Promise<IUser>;
    changePassword(userId: string, oldPassword: string, newPassword: string): Promise<void>;
}
