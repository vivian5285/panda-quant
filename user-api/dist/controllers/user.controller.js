"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const user_service_1 = require("../services/user.service");
const verification_service_1 = require("../services/verification.service");
const validation_1 = require("../utils/validation");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const generateToken = (payload) => {
    return jsonwebtoken_1.default.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};
const hashPassword = async (password) => {
    const salt = await bcrypt_1.default.genSalt(10);
    return bcrypt_1.default.hash(password, salt);
};
const comparePassword = async (password, hash) => {
    return bcrypt_1.default.compare(password, hash);
};
class UserController {
    constructor() {
        this.userService = new user_service_1.UserService();
        this.verificationService = new verification_service_1.VerificationService();
    }
    async sendCode(req, res) {
        try {
            const { email, type } = req.body;
            if (!email || !type) {
                return res.status(400).json({ message: 'Email and type are required' });
            }
            if (type === 'register') {
                const existingUser = await this.userService.getUserByEmail(email);
                if (existingUser) {
                    return res.status(400).json({ message: '该邮箱已被注册' });
                }
            }
            const code = await this.verificationService.generateCode(type, email);
            const verificationUser = { email, verificationCode: code };
            await this.verificationService.sendVerificationEmail(verificationUser);
            return res.json({ message: '验证码已发送' });
        }
        catch (error) {
            console.error('Failed to send code:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async register(req, res) {
        try {
            const { email, password, name, code } = req.body;
            if (!email || !password || !name || !code) {
                return res.status(400).json({ message: 'Missing required fields' });
            }
            if (!(0, validation_1.validateEmail)(email)) {
                return res.status(400).json({ message: 'Invalid email format' });
            }
            if (!(0, validation_1.validatePassword)(password)) {
                return res.status(400).json({ message: 'Password must be at least 8 characters long' });
            }
            const existingUser = await this.userService.getUserByEmail(email);
            if (existingUser) {
                return res.status(409).json({ message: 'Email already registered' });
            }
            const hashedPassword = await hashPassword(password);
            const user = await this.userService.createUser({
                email,
                password: hashedPassword,
                name,
                isVerified: false
            });
            if (!user) {
                return res.status(500).json({ message: 'Failed to create user' });
            }
            return res.status(201).json({
                message: 'User registered successfully',
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name
                }
            });
        }
        catch (error) {
            console.error('Failed to register:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async login(req, res) {
        var _a;
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: 'Missing email or password' });
            }
            const user = await this.userService.getUserByEmail(email);
            if (!user) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            if (!user.isVerified) {
                return res.status(403).json({ message: 'Please verify your email first' });
            }
            const isPasswordValid = await comparePassword(password, user.password);
            if (!isPasswordValid) {
                return res.status(401).json({ message: 'Invalid credentials' });
            }
            const token = generateToken({
                id: ((_a = user._id) === null || _a === void 0 ? void 0 : _a.toString()) || '',
                email: user.email,
                role: user.role
            });
            return res.json({
                message: 'Login successful',
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    name: user.name
                }
            });
        }
        catch (error) {
            console.error('Failed to login:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async verifyEmail(req, res) {
        try {
            const { email, code } = req.body;
            if (!email || !code) {
                return res.status(400).json({ message: 'Missing email or verification code' });
            }
            const user = await this.userService.getUserByEmail(email);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            if (user.isVerified) {
                return res.status(400).json({ message: 'Email already verified' });
            }
            const isValid = await this.verificationService.verifyCode(email, code, 'register');
            if (!isValid) {
                return res.status(400).json({ message: 'Invalid verification code' });
            }
            const updatedUser = await this.userService.updateUser(user.id, { isVerified: true });
            if (!updatedUser) {
                return res.status(500).json({ message: 'Failed to update user' });
            }
            return res.json({ message: 'Email verified successfully' });
        }
        catch (error) {
            console.error('Failed to verify email:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
    async getProfile(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                throw new Error('User not authenticated');
            }
            const user = await this.userService.getUserById(userId);
            if (!user) {
                throw new Error('User not found');
            }
            const response = {
                success: true,
                data: user,
                error: null
            };
            res.status(200).json(response);
        }
        catch (error) {
            const response = {
                success: false,
                data: null,
                error: error instanceof Error ? error.message : 'An error occurred'
            };
            res.status(401).json(response);
        }
    }
    async updateProfile(req, res) {
        var _a;
        try {
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
            if (!userId) {
                throw new Error('User not authenticated');
            }
            const user = await this.userService.updateUser(userId, req.body);
            if (!user) {
                throw new Error('User not found');
            }
            const response = {
                success: true,
                data: user,
                error: null
            };
            res.status(200).json(response);
        }
        catch (error) {
            const response = {
                success: false,
                data: null,
                error: error instanceof Error ? error.message : 'An error occurred'
            };
            res.status(400).json(response);
        }
    }
}
exports.UserController = UserController;
//# sourceMappingURL=user.controller.js.map