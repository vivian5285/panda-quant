import jwt from 'jsonwebtoken';
import { AuthUser } from '../middleware/auth';
import User from '../models/User';

export const generateToken = (user: AuthUser): string => {
    return jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET as string,
        { expiresIn: '24h' }
    );
};

export const verifyToken = async (token: string): Promise<AuthUser> => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { id: string };
        const user = await User.findById(decoded.id);
        
        if (!user) {
            throw new Error('User not found');
        }
        
        return {
            id: user._id.toString(),
            email: user.email,
            role: user.role
        };
    } catch (error) {
        throw new Error('Invalid token');
    }
}; 