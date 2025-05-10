import { Request, Response } from 'express';
export declare class AuthController {
    private authService;
    constructor();
    login: (req: Request, res: Response) => Promise<void>;
    register: (req: Request, res: Response) => Promise<void>;
    getCurrentUser: (req: Request, res: Response) => Promise<void>;
    updateUser: (req: Request, res: Response) => Promise<void>;
    changePassword: (req: Request, res: Response) => Promise<void>;
    logout: (req: Request, res: Response) => Promise<void>;
}
declare const _default: AuthController;
export default _default;
//# sourceMappingURL=AuthController.d.ts.map