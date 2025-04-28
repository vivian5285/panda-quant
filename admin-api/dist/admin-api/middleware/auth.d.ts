import { Request, Response, NextFunction } from 'express';
import { IUser } from '../models/user.model';
declare global {
    namespace Express {
        interface Request {
            user?: IUser;
        }
    }
}
export declare const authenticateToken: (req: Request, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const isAdmin: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
export declare const authenticateAdmin: (req: Request, res: Response, next: NextFunction) => Response<any, Record<string, any>> | undefined;
