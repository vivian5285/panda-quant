import { IUser } from '../types/User';
import { AuthToken, IAuthResponse, ILoginCredentials, IRegisterData, IResetPasswordData } from '../types/Auth';
export declare class AuthService {
    private static instance;
    private constructor();
    static getInstance(): AuthService;
    private convertToIUser;
    register(data: IRegisterData): Promise<IAuthResponse>;
    login(credentials: ILoginCredentials): Promise<IAuthResponse>;
    logout(userId: string): Promise<void>;
    getCurrentUser(userId: string): Promise<IUser>;
    refreshToken(refreshToken: string): Promise<AuthToken>;
    updateUser(userId: string, updateData: Partial<IUser>): Promise<IUser>;
    changePassword(userId: string, currentPassword: string, newPassword: string): Promise<void>;
    private generateToken;
    resetPassword(data: IResetPasswordData): Promise<void>;
}
//# sourceMappingURL=AuthService.d.ts.map