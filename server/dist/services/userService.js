import { Types } from 'mongoose';
import { User } from '../models/User';
import bcrypt from 'bcrypt';
import { logger } from '../utils/logger';
export class UserService {
    constructor() { }
    static getInstance() {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }
        return UserService.instance;
    }
    convertToIUser(user) {
        if (!user)
            return null;
        return {
            ...user.toObject(),
            _id: user._id
        };
    }
    async authenticate(email, password) {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error('User not found');
            }
            const isValid = await bcrypt.compare(password, user.password);
            if (!isValid) {
                throw new Error('Invalid password');
            }
            const convertedUser = this.convertToIUser(user);
            if (!convertedUser) {
                throw new Error('Failed to convert user');
            }
            // TODO: Generate JWT token
            const token = 'dummy-token';
            return { user: convertedUser, token };
        }
        catch (error) {
            logger.error('Authentication error:', error);
            throw error;
        }
    }
    async createUser(data) {
        const user = new User({
            ...data,
            _id: new Types.ObjectId(),
            name: data.name || '',
            level: data.level || 1,
            role: data.role || 'user',
            status: data.status || 'active',
            permissions: data.permissions || []
        });
        const savedUser = await user.save();
        const convertedUser = this.convertToIUser(savedUser);
        if (!convertedUser) {
            throw new Error('Failed to create user');
        }
        return convertedUser;
    }
    async getUserById(id) {
        const user = await User.findById(id);
        return this.convertToIUser(user);
    }
    async updateUser(id, data) {
        const user = await User.findByIdAndUpdate(id, data, { new: true });
        return this.convertToIUser(user);
    }
    async deleteUser(id) {
        const result = await User.findByIdAndDelete(id);
        return result !== null;
    }
    async getUserByEmail(email) {
        const user = await User.findOne({ email });
        return this.convertToIUser(user);
    }
    async getUserByUsername(username) {
        const user = await User.findOne({ username });
        return this.convertToIUser(user);
    }
    async getUsers() {
        const users = await User.find();
        return users.map(user => this.convertToIUser(user)).filter((user) => user !== null);
    }
}
//# sourceMappingURL=UserService.js.map