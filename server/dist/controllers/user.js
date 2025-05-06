import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { config } from '../config';
import { BadRequestError, NotFoundError, UnauthorizedError } from '../utils/errors';
export class UserController {
    // 用户注册
    async register(req, res, next) {
        try {
            const { email, password, name } = req.body;
            // 检查邮箱是否已存在
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                throw new BadRequestError('Email already exists');
            }
            // 创建新用户
            const user = await User.create({
                email,
                password,
                name,
                username: email.split('@')[0],
                role: 'user',
                level: 1,
                status: 'active',
                permissions: []
            });
            // 生成 JWT
            const token = jwt.sign({ userId: user._id, role: user.role }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
            res.status(201).json({
                success: true,
                data: {
                    user: {
                        id: user._id,
                        email: user.email,
                        name: user.name,
                        role: user.role
                    },
                    token
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    // 用户登录
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            // 查找用户
            const user = await User.findOne({ email });
            if (!user) {
                throw new UnauthorizedError('Invalid credentials');
            }
            // 验证密码
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                throw new UnauthorizedError('Invalid credentials');
            }
            // 生成 JWT
            const token = jwt.sign({ userId: user._id, role: user.role }, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
            res.json({
                success: true,
                data: {
                    user: {
                        id: user._id,
                        email: user.email,
                        name: user.name,
                        role: user.role
                    },
                    token
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    // 获取当前用户信息
    async getCurrentUser(req, res, next) {
        try {
            const user = await User.findById(req.user.id).select('-password');
            if (!user) {
                throw new NotFoundError('User not found');
            }
            res.json({
                success: true,
                data: {
                    user: {
                        id: user._id,
                        email: user.email,
                        name: user.name,
                        role: user.role
                    }
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    // 更新用户信息
    async updateUser(req, res, next) {
        try {
            const { name, email } = req.body;
            const user = await User.findById(req.user.id);
            if (!user) {
                throw new NotFoundError('User not found');
            }
            if (email && email !== user.email) {
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    throw new BadRequestError('Email already exists');
                }
                user.email = email;
            }
            if (name) {
                user.name = name;
            }
            await user.save();
            res.json({
                success: true,
                data: {
                    user: {
                        id: user._id,
                        email: user.email,
                        name: user.name,
                        role: user.role
                    }
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    // 更改密码
    async changePassword(req, res, next) {
        try {
            const { currentPassword, newPassword } = req.body;
            const user = await User.findById(req.user.id);
            if (!user) {
                throw new NotFoundError('User not found');
            }
            // 验证当前密码
            const isMatch = await bcrypt.compare(currentPassword, user.password);
            if (!isMatch) {
                throw new UnauthorizedError('Current password is incorrect');
            }
            // 更新密码
            user.password = newPassword;
            await user.save();
            res.json({
                success: true,
                message: 'Password updated successfully'
            });
        }
        catch (error) {
            next(error);
        }
    }
    // 获取所有用户（管理员）
    async getAllUsers(req, res, next) {
        try {
            const users = await User.find().select('-password');
            res.json({
                success: true,
                data: {
                    users: users.map(user => ({
                        id: user._id,
                        email: user.email,
                        name: user.name,
                        role: user.role
                    }))
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    // 根据ID获取用户（管理员）
    async getUserById(req, res, next) {
        try {
            const user = await User.findById(req.params.id).select('-password');
            if (!user) {
                throw new NotFoundError('User not found');
            }
            res.json({
                success: true,
                data: {
                    user: {
                        id: user._id,
                        email: user.email,
                        name: user.name,
                        role: user.role
                    }
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    // 更新用户信息（管理员）
    async updateUserById(req, res, next) {
        try {
            const { name, email, role } = req.body;
            const user = await User.findById(req.params.id);
            if (!user) {
                throw new NotFoundError('User not found');
            }
            if (email && email !== user.email) {
                const existingUser = await User.findOne({ email });
                if (existingUser) {
                    throw new BadRequestError('Email already exists');
                }
                user.email = email;
            }
            if (name) {
                user.name = name;
            }
            if (role) {
                user.role = role;
            }
            await user.save();
            res.json({
                success: true,
                data: {
                    user: {
                        id: user._id,
                        email: user.email,
                        name: user.name,
                        role: user.role
                    }
                }
            });
        }
        catch (error) {
            next(error);
        }
    }
    // 删除用户（管理员）
    async deleteUser(req, res, next) {
        try {
            const user = await User.findById(req.params.id);
            if (!user) {
                throw new NotFoundError('User not found');
            }
            await user.deleteOne();
            res.json({
                success: true,
                message: 'User deleted successfully'
            });
        }
        catch (error) {
            next(error);
        }
    }
}
//# sourceMappingURL=User.js.map