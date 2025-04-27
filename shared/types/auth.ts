import { Request } from 'express';
import { IUser } from '../models/user';

export interface AuthRequest extends Request {
    user?: IUser & {
        balance: number;
        name: string;
        [key: string]: any;
    };
    body: any;
    params: any;
    query: any;
} 