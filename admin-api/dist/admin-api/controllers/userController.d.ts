import { Request, Response } from 'express';
export declare const getUsers: (req: Request, res: Response) => Promise<void>;
export declare const updateUserStatus: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
export declare const rewardUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
