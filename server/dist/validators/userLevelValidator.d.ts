import { IUserLevel } from '../types/UserLevel';
import { ValidationChain } from 'express-validator';
export declare const userLevelValidator: ValidationChain[];
export declare function validateUserLevel(levelData: Partial<IUserLevel>): void;
