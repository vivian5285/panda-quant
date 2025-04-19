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
exports.AuthController = void 0;
const user_model_1 = require("../models/user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errors_1 = require("../utils/errors");
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
class AuthController {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { emailOrUsername, password } = req.body;
                if (!emailOrUsername || !password) {
                    throw new errors_1.ValidationError('请提供邮箱/用户名和密码');
                }
                // 查找用户
                const user = yield user_model_1.User.findOne({
                    $or: [
                        { email: emailOrUsername },
                        { username: emailOrUsername }
                    ]
                }).exec();
                if (!user) {
                    throw new errors_1.AuthError('邮箱或密码错误');
                }
                // 验证密码
                const isValidPassword = yield user.comparePassword(password);
                if (!isValidPassword) {
                    throw new errors_1.AuthError('邮箱或密码错误');
                }
                // 检查用户状态
                if (user.status !== 'active') {
                    throw new errors_1.AuthError('账户已被禁用');
                }
                // 生成 JWT token
                const token = jsonwebtoken_1.default.sign({ _id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
                // 更新最后登录时间
                user.lastLogin = new Date();
                yield user.save();
                res.json({
                    message: '登录成功',
                    token,
                    user: {
                        _id: user._id,
                        email: user.email,
                        username: user.username,
                        walletAddress: user.walletAddress,
                        role: user.role,
                        status: user.status,
                        createdAt: user.createdAt,
                        updatedAt: user.updatedAt
                    }
                });
            }
            catch (error) {
                console.error('登录错误:', error);
                if (error instanceof errors_1.ValidationError) {
                    res.status(400).json({ message: error.message });
                }
                else if (error instanceof errors_1.AuthError) {
                    res.status(401).json({ message: error.message });
                }
                else {
                    res.status(500).json({ message: '服务器错误' });
                }
            }
        });
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { email, username, password } = req.body;
                if (!email || !password) {
                    throw new errors_1.ValidationError('请提供邮箱和密码');
                }
                // 检查邮箱是否已存在
                const existingUser = yield user_model_1.User.findOne({ email }).exec();
                if (existingUser) {
                    throw new errors_1.ValidationError('邮箱已被注册');
                }
                // 创建新用户
                const user = new user_model_1.User({
                    email,
                    username,
                    password,
                    role: 'user',
                    status: 'active'
                });
                yield user.save();
                // 生成 JWT token
                const token = jsonwebtoken_1.default.sign({ _id: user._id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
                res.status(201).json({
                    message: '注册成功',
                    token,
                    user: {
                        _id: user._id,
                        email: user.email,
                        username: user.username,
                        walletAddress: user.walletAddress,
                        role: user.role,
                        status: user.status,
                        createdAt: user.createdAt,
                        updatedAt: user.updatedAt
                    }
                });
            }
            catch (error) {
                console.error('注册错误:', error);
                if (error instanceof errors_1.ValidationError) {
                    res.status(400).json({ message: error.message });
                }
                else if (error instanceof errors_1.DatabaseError) {
                    res.status(500).json({ message: '数据库错误' });
                }
                else {
                    res.status(500).json({ message: '服务器错误' });
                }
            }
        });
    }
    getProfile(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const user = yield user_model_1.User.findById((_a = req.user) === null || _a === void 0 ? void 0 : _a._id).exec();
                if (!user) {
                    throw new errors_1.AuthError('用户不存在');
                }
                res.json({
                    _id: user._id,
                    email: user.email,
                    username: user.username,
                    walletAddress: user.walletAddress,
                    role: user.role,
                    status: user.status,
                    createdAt: user.createdAt,
                    updatedAt: user.updatedAt
                });
            }
            catch (error) {
                console.error('获取用户信息错误:', error);
                if (error instanceof errors_1.AuthError) {
                    res.status(401).json({ message: error.message });
                }
                else if (error instanceof errors_1.DatabaseError) {
                    res.status(500).json({ message: '数据库错误' });
                }
                else {
                    res.status(500).json({ message: '服务器错误' });
                }
            }
        });
    }
}
exports.AuthController = AuthController;
