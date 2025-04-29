import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user';

export const auth = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            res.status(401).json({ error: 'No token provided' });
            return;
        }
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        const user = await User.findById(decoded.id);
        
        if (!user) {
            res.status(401).json({ error: 'User not found' });
            return;
        }
        
        (req as any).user = user;
        next();
    } catch (error) {
        res.status(401).json({ error: 'Invalid token' });
    }
}; 