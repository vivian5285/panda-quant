import { IUserLevel } from '../types/userLevel';
import { ValidationChain } from 'express-validator';
export declare const userLevelValidator: ValidationChain[];
export declare function validateUserLevel(levelData: Partial<IUserLevel>): void;
