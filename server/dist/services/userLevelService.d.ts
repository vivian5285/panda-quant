import { IUserLevel } from '../types/userLevel';
export declare class UserLevelService {
    getUserLevelById(id: string): Promise<IUserLevel | null>;
    updateUserLevel(id: string, data: Partial<IUserLevel>): Promise<IUserLevel | null>;
    getAllUserLevels(): Promise<IUserLevel[]>;
    createUserLevel(data: Partial<IUserLevel>): Promise<IUserLevel>;
    deleteUserLevel(id: string): Promise<boolean>;
}
