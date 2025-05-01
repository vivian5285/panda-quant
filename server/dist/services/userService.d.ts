import { IUser } from '../types/user';
export declare class UserService {
    private static instance;
    private constructor();
    static getInstance(): UserService;
    private convertToIUser;
    authenticate(email: string, password: string): Promise<{
        user: IUser;
        token: string;
    }>;
    createUser(data: Partial<IUser>): Promise<IUser>;
    getUserById(id: string): Promise<IUser | null>;
    updateUser(id: string, data: Partial<IUser>): Promise<IUser | null>;
    deleteUser(id: string): Promise<boolean>;
    getUserByEmail(email: string): Promise<IUser | null>;
    getUserByUsername(username: string): Promise<IUser | null>;
    getUsers(): Promise<IUser[]>;
}
