import { Response } from 'express';
import { AuthenticatedRequest } from '../types/Auth';
export declare class AuthController {
    private authService;
    constructor();
    login: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    register: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    getCurrentUser: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    logout: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    updateUser: (req: AuthenticatedRequest, res: Response) => Promise<void>;
    changePassword: (req: AuthenticatedRequest, res: Response) => Promise<void>;
}
declare const _default: AuthController;
export default _default;
//# sourceMappingURL=AuthController.d.ts.map