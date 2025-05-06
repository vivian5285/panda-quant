"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_model_1 = require("../models/user.model");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const nanoid_1 = require("nanoid");
const router = express_1.default.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const generateToken = (userId, role) => {
    return jsonwebtoken_1.default.sign({ id: userId, role }, JWT_SECRET, { expiresIn: '24h' });
};
router.post('/register', async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: '请提供邮箱和密码' });
            return;
        }
        const existingUser = await user_model_1.User.findOne({ email });
        if (existingUser) {
            res.status(400).json({ message: '邮箱已被注册' });
            return;
        }
        const user = await user_model_1.User.create({
            email,
            password,
            name: email.split('@')[0],
            role: 'user',
            status: 'active',
            referralCode: (0, nanoid_1.nanoid)(8)
        });
        const token = generateToken(user._id.toString(), user.role);
        res.status(201).json({
            message: '注册成功',
            token,
            user: {
                id: user._id,
                email: user.email,
                name: user.name,
                role: user.role
            }
        });
    }
    catch (error) {
        console.error('注册错误:', error);
        res.status(500).json({ message: '注册失败，请稍后重试' });
    }
});
router.post('/login', async (req, res) => {
    try {
        const { identifier, password } = req.body;
        if (!identifier || !password) {
            res.status(400).json({ message: '请提供邮箱和密码' });
            return;
        }
        let user;
        if (identifier.includes('@')) {
            user = await user_model_1.User.findOne({ email: identifier });
        }
        else {
            user = await user_model_1.User.findOne({ username: identifier });
        }
        if (!user) {
            res.status(401).json({ message: '邮箱或密码错误' });
            return;
        }
        const isPasswordValid = await user.comparePassword(password);
        if (!isPasswordValid) {
            res.status(401).json({ message: '邮箱或密码错误' });
            return;
        }
        if (user.status !== 'active') {
            res.status(403).json({ message: '账户已被禁用' });
            return;
        }
        const token = generateToken(user._id.toString(), user.role);
        res.json({
            message: '登录成功',
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                status: user.status
            }
        });
    }
    catch (error) {
        console.error('登录错误:', error);
        res.status(500).json({ message: '服务器错误' });
    }
});
exports.default = router;
//# sourceMappingURL=auth.js.map