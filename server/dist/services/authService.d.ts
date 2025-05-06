import { IUser } from '../types/User';
import { IAuthToken } from '../types/Auth';
export declare class AuthService {
    private convertToIUser;
    register(userData: IUser): Promise<IUser>;
    login(email: string, password: string): Promise<IAuthToken>;
    logout(userId: string): Promise<void>;
    getCurrentUser(userId: string): Promise<IUser>;
    refreshToken(refreshToken: string): Promise<IAuthToken>;
}
