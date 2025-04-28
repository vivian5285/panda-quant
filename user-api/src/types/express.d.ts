import { Request } from 'express';
import { AuthUser } from '../middleware/auth';

declare module 'express' {
    interface Request {
        user?: AuthUser;
    }
} 