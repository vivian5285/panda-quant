import { IUserLevel } from '../types/UserLevel';
export declare class UserLevelService {
    private static instance;
    private constructor();
    static getInstance(): UserLevelService;
    private convertToIUserLevel;
    getUserLevelById(id: string): Promise<IUserLevel | null>;
    updateUserLevel(id: string, data: Partial<IUserLevel>): Promise<IUserLevel | null>;
    getAllUserLevels(): Promise<IUserLevel[]>;
    createUserLevel(data: Partial<IUserLevel>): Promise<IUserLevel>;
    deleteUserLevel(id: string): Promise<boolean>;
}
//# sourceMappingURL=UserLevelService.d.ts.map