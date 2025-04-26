import { Request } from 'express';
import { IUser } from '../models/user';

export interface AuthRequest extends Request {
    user?: IUser & {
        _id: string;
        comparePassword: (password: string) => Promise<boolean>;
        $assertPopulated: () => void;
        $clone: () => any;
        $getAllSubdocs: () => any[];
    };
} 