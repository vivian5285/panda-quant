import jwt from 'jsonwebtoken';
import { IUser } from '../models/user';

export const generateToken = (user: IUser): string => {
    return jwt.sign({ id: user._id }, process.env.JWT_SECRET as string, { expiresIn: '24h' });
};

export const verifyToken = (token: string): { id: string } => {
    return jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
}; 