import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { logger } from '../utils/logger';
export class AuthService {
    convertToIUser(user) {
        const userObj = user.toObject ? user.toObject() : user;
        return {
            ...userObj,
            id: userObj._id.toString(),
            _id: userObj._id
        };
    }
    async register(userData) {
        try {
            const existingUser = await User.findOne({ email: userData.email });
            if (existingUser) {
                throw new Error('User already exists');
            }
            const hashedPassword = await bcrypt.hash(userData.password, 10);
            const user = await User.create({
                ...userData,
                password: hashedPassword,
                username: userData.email.split('@')[0],
                level: 1,
                role: 'user',
                status: 'active',
                permissions: []
            });
            return this.convertToIUser(user);
        }
        catch (error) {
            logger.error('Registration error:', error);
            throw error;
        }
    }
    async login(email, password) {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error('Invalid credentials');
            }
            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
                throw new Error('Invalid credentials');
            }
            const token = jwt.sign({ id: user._id, email: user.email }, process.env['JWT_SECRET'] || 'your-secret-key', { expiresIn: '24h' });
            return {
                token,
                expiresIn: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
            };
        }
        catch (error) {
            logger.error('Login error:', error);
            throw error;
        }
    }
    async logout(userId) {
        try {
            // In a real application, you might want to invalidate the token here
            // For now, we'll just log the logout
            logger.info(`User ${userId} logged out`);
        }
        catch (error) {
            logger.error('Logout error:', error);
            throw error;
        }
    }
    async getCurrentUser(userId) {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            return this.convertToIUser(user);
        }
        catch (error) {
            logger.error('Get current user error:', error);
            throw error;
        }
    }
    async refreshToken(refreshToken) {
        try {
            const decoded = jwt.verify(refreshToken, process.env['JWT_SECRET'] || 'your-secret-key');
            const user = await User.findById(decoded.id);
            if (!user) {
                throw new Error('User not found');
            }
            const newToken = jwt.sign({ id: user._id, email: user.email }, process.env['JWT_SECRET'] || 'your-secret-key', { expiresIn: '24h' });
            return {
                token: newToken,
                expiresIn: 24 * 60 * 60 * 1000 // 24 hours in milliseconds
            };
        }
        catch (error) {
            logger.error('Refresh token error:', error);
            throw new Error('Invalid refresh token');
        }
    }
}
//# sourceMappingURL=AuthService.js.map