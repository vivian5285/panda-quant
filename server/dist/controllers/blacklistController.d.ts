import { Request, Response } from 'express';
export declare const blacklistController: {
    getAllEntries(_req: Request, res: Response): Promise<void>;
    getEntryById(req: Request, res: Response): Promise<void>;
    createEntry(req: Request, res: Response): Promise<void>;
    updateEntry(req: Request, res: Response): Promise<void>;
    deleteEntry(req: Request, res: Response): Promise<void>;
    searchEntries(req: Request, res: Response): Promise<void>;
    getBlacklistEntry(req: Request, res: Response): Promise<void>;
    deleteBlacklistEntry(req: Request, res: Response): Promise<void>;
    updateBlacklistEntry(req: Request, res: Response): Promise<void>;
    getBlacklistEntryById(req: Request, res: Response): Promise<void>;
    deleteBlacklistEntryById(req: Request, res: Response): Promise<void>;
};
//# sourceMappingURL=BlacklistController.d.ts.map