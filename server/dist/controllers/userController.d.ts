import { Request, Response } from 'express';
import { AuthRequest } from '../types/auth';
import { AuthenticatedRequest } from '../types/express';
export declare class UserController {
    private userService;
    constructor();
    private checkAuth;
    getAllUsers(_req: AuthenticatedRequest, res: Response): Promise<void>;
    getUserById(req: AuthenticatedRequest, res: Response): Promise<void>;
    updateUser(req: AuthenticatedRequest, res: Response): Promise<void>;
    updateUserStatus(req: AuthenticatedRequest, res: Response): Promise<void>;
    deleteUser(req: AuthenticatedRequest, res: Response): Promise<void>;
    getProfile(req: AuthRequest, res: Response): Promise<void>;
    updateProfile(req: AuthRequest, res: Response): Promise<void>;
    changePassword(req: AuthenticatedRequest, res: Response): Promise<void>;
    getUser(req: Request, res: Response): Promise<void>;
    login: (req: Request, res: Response) => Promise<void>;
    register: (req: Request, res: Response) => Promise<void>;
    getUserProfile: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    updateUserProfile: (req: AuthenticatedRequest, res: Response) => Promise<void>;
}
declare const _default: UserController;
export default _default;
