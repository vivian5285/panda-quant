import { IUserLevel } from '../types/userLevel';
export declare class UserLevelService {
    private static instance;
    private constructor();
    static getInstance(): UserLevelService;
    createUserLevel(data: Partial<IUserLevel>): Promise<IUserLevel>;
    getUserLevels(): Promise<IUserLevel[]>;
    updateUserLevel(id: string, data: Partial<IUserLevel>): Promise<IUserLevel>;
    getUserLevelById(id: string): Promise<IUserLevel | null>;
    deleteUserLevel(id: string): Promise<IUserLevel | null>;
    addExperience(userId: string, amount: number): Promise<IUserLevel>;
    getUserLevelInfo(userId: string): Promise<{
        level: number;
        experience: number;
        requiredExperience: number;
        progress: number;
        benefits: {
            withdrawalLimit: number;
            strategyLimit: number;
            commissionRate: number;
            maxLeverage: number;
            prioritySupport: boolean;
            customFeatures: string[];
        };
    }>;
    getUserLevel(userId: string): Promise<IUserLevel | null>;
    getAllUserLevels(): Promise<IUserLevel[]>;
    getUserLevelByUserId(userId: string): Promise<IUserLevel | null>;
    updateByUserId(userId: string, data: Partial<IUserLevel>): Promise<IUserLevel | null>;
}
