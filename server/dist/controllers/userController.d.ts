import type { Request, Response } from 'express';
export declare class UserController {
    getAllUsers(_req: Request, res: Response): Promise<void>;
    getUserById(req: Request, res: Response): Promise<void>;
    register(req: Request, res: Response): Promise<void>;
    updateUser(req: Request, res: Response): Promise<void>;
    deleteUser(req: Request, res: Response): Promise<void>;
}
//# sourceMappingURL=UserController.d.ts.map