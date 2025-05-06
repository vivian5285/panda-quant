"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../models/User");
const config_1 = require("../config");
const errors_1 = require("../utils/errors");
class UserController {
    // 用户注册
    register(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password, name } = req.body;
                // 检查邮箱是否已存在
                const existingUser = yield User_1.User.findOne({ email });
                if (existingUser) {
                    throw new errors_1.BadRequestError('Email already exists');
                }
                // 创建新用户
                const user = yield User_1.User.create({
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
                const token = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, config_1.config.jwtSecret, { expiresIn: config_1.config.jwtExpiresIn });
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
        });
    }
    // 用户登录
    login(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, password } = req.body;
                // 查找用户
                const user = yield User_1.User.findOne({ email });
                if (!user) {
                    throw new errors_1.UnauthorizedError('Invalid credentials');
                }
                // 验证密码
                const isMatch = yield bcryptjs_1.default.compare(password, user.password);
                if (!isMatch) {
                    throw new errors_1.UnauthorizedError('Invalid credentials');
                }
                // 生成 JWT
                const token = jsonwebtoken_1.default.sign({ userId: user._id, role: user.role }, config_1.config.jwtSecret, { expiresIn: config_1.config.jwtExpiresIn });
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
        });
    }
    // 获取当前用户信息
    getCurrentUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.User.findById(req.user.id).select('-password');
                if (!user) {
                    throw new errors_1.NotFoundError('User not found');
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
        });
    }
    // 更新用户信息
    updateUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email } = req.body;
                const user = yield User_1.User.findById(req.user.id);
                if (!user) {
                    throw new errors_1.NotFoundError('User not found');
                }
                if (email && email !== user.email) {
                    const existingUser = yield User_1.User.findOne({ email });
                    if (existingUser) {
                        throw new errors_1.BadRequestError('Email already exists');
                    }
                    user.email = email;
                }
                if (name) {
                    user.name = name;
                }
                yield user.save();
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
        });
    }
    // 更改密码
    changePassword(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { currentPassword, newPassword } = req.body;
                const user = yield User_1.User.findById(req.user.id);
                if (!user) {
                    throw new errors_1.NotFoundError('User not found');
                }
                // 验证当前密码
                const isMatch = yield bcryptjs_1.default.compare(currentPassword, user.password);
                if (!isMatch) {
                    throw new errors_1.UnauthorizedError('Current password is incorrect');
                }
                // 更新密码
                user.password = newPassword;
                yield user.save();
                res.json({
                    success: true,
                    message: 'Password updated successfully'
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
    // 获取所有用户（管理员）
    getAllUsers(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const users = yield User_1.User.find().select('-password');
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
        });
    }
    // 根据ID获取用户（管理员）
    getUserById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.User.findById(req.params.id).select('-password');
                if (!user) {
                    throw new errors_1.NotFoundError('User not found');
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
        });
    }
    // 更新用户信息（管理员）
    updateUserById(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { name, email, role } = req.body;
                const user = yield User_1.User.findById(req.params.id);
                if (!user) {
                    throw new errors_1.NotFoundError('User not found');
                }
                if (email && email !== user.email) {
                    const existingUser = yield User_1.User.findOne({ email });
                    if (existingUser) {
                        throw new errors_1.BadRequestError('Email already exists');
                    }
                    user.email = email;
                }
                if (name) {
                    user.name = name;
                }
                if (role) {
                    user.role = role;
                }
                yield user.save();
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
        });
    }
    // 删除用户（管理员）
    deleteUser(req, res, next) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.User.findById(req.params.id);
                if (!user) {
                    throw new errors_1.NotFoundError('User not found');
                }
                yield user.deleteOne();
                res.json({
                    success: true,
                    message: 'User deleted successfully'
                });
            }
            catch (error) {
                next(error);
            }
        });
    }
}
exports.UserController = UserController;
//# sourceMappingURL=User.js.map