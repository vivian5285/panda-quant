import { Request, Response } from 'express';
import { AuthenticatedRequest } from '../types/auth';
export declare class UserController {
    private userService;
    constructor();
    login(req: Request, res: Response): Promise<void>;
    register(req: Request, res: Response): Promise<void>;
    getProfile: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    updateProfile: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    deleteUser: (req: AuthenticatedRequest, res: Response) => Promise<void>;
}
