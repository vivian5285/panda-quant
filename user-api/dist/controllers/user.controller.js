"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const user_service_1 = require("../services/user.service");
const verification_service_1 = require("../services/verification.service");
const email_1 = require("../utils/email");
const auth_1 = require("../utils/auth");
const validation_1 = require("../utils/validation");
let UserController = class UserController {
    constructor(userService, verificationService) {
        this.userService = userService;
        this.verificationService = verificationService;
    }
    async sendCode(body) {
        const { email, type } = body;
        // 如果是注册，检查邮箱是否已存在
        if (type === 'register') {
            const existingUser = await this.userService.getUserByEmail(email);
            if (existingUser) {
                throw new common_1.HttpException('该邮箱已被注册', common_1.HttpStatus.BAD_REQUEST);
            }
        }
        // 生成并发送验证码
        await this.verificationService.sendVerificationEmail(email, type);
        return { message: '验证码已发送' };
    }
    async register(body) {
        const { email, password, name } = body;
        if (!email || !password || !name) {
            throw new common_1.HttpException('Missing required fields', common_1.HttpStatus.BAD_REQUEST);
        }
        if (!(0, validation_1.validateEmail)(email)) {
            throw new common_1.HttpException('Invalid email format', common_1.HttpStatus.BAD_REQUEST);
        }
        if (!(0, validation_1.validatePassword)(password)) {
            throw new common_1.HttpException('Password must be at least 8 characters long', common_1.HttpStatus.BAD_REQUEST);
        }
        const existingUser = await this.userService.getUserByEmail(email);
        if (existingUser) {
            throw new common_1.HttpException('Email already registered', common_1.HttpStatus.CONFLICT);
        }
        const hashedPassword = await (0, auth_1.hashPassword)(password);
        const verificationCode = Math.random().toString(36).substring(2, 8);
        const user = await this.userService.createUser({
            email,
            password: hashedPassword,
            name,
            verificationCode,
            isVerified: false
        });
        await (0, email_1.sendVerificationEmail)(email, verificationCode);
        return {
            message: 'User registered successfully',
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        };
    }
    async login(body) {
        const { email, password } = body;
        if (!email || !password) {
            throw new common_1.HttpException('Missing email or password', common_1.HttpStatus.BAD_REQUEST);
        }
        const user = await this.userService.getUserByEmail(email);
        if (!user) {
            throw new common_1.HttpException('Invalid credentials', common_1.HttpStatus.UNAUTHORIZED);
        }
        if (!user.isVerified) {
            throw new common_1.HttpException('Please verify your email first', common_1.HttpStatus.FORBIDDEN);
        }
        const isPasswordValid = await this.userService.comparePassword(password, user.password);
        if (!isPasswordValid) {
            throw new common_1.HttpException('Invalid credentials', common_1.HttpStatus.UNAUTHORIZED);
        }
        const token = (0, auth_1.generateToken)({ id: user.id, email: user.email });
        return {
            message: 'Login successful',
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        };
    }
    async resetPassword(body) {
        const { email, newPassword, code } = body;
        const isValid = await this.verificationService.verifyCode(email, code, 'reset-password');
        if (!isValid) {
            throw new common_1.HttpException('验证码无效或已过期', common_1.HttpStatus.BAD_REQUEST);
        }
        await this.userService.updateUser(email, { password: await (0, auth_1.hashPassword)(newPassword) });
        return { message: '密码重置成功' };
    }
    async verifyEmail(body) {
        const { email, code } = body;
        if (!email || !code) {
            throw new common_1.HttpException('Missing email or verification code', common_1.HttpStatus.BAD_REQUEST);
        }
        const user = await this.userService.getUserByEmail(email);
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        if (user.isVerified) {
            throw new common_1.HttpException('Email already verified', common_1.HttpStatus.BAD_REQUEST);
        }
        if (user.verificationCode !== code) {
            throw new common_1.HttpException('Invalid verification code', common_1.HttpStatus.BAD_REQUEST);
        }
        await this.userService.updateUser(user.id, { isVerified: true, verificationCode: undefined });
        return { message: 'Email verified successfully' };
    }
    async getProfile(req) {
        if (!req.user) {
            throw new common_1.HttpException('Unauthorized', common_1.HttpStatus.UNAUTHORIZED);
        }
        const user = await user_service_1.UserService.getUserById(req.user.id);
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        return {
            user: {
                id: user.id,
                email: user.email,
                name: user.name
            }
        };
    }
    async updateProfile(req, body) {
        if (!req.user) {
            throw new common_1.HttpException('Unauthorized', common_1.HttpStatus.UNAUTHORIZED);
        }
        const { name } = body;
        if (!name) {
            throw new common_1.HttpException('Name is required', common_1.HttpStatus.BAD_REQUEST);
        }
        const updatedUser = await this.userService.updateUser(req.user.id, { name });
        if (!updatedUser) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        return {
            message: 'Profile updated successfully',
            user: {
                id: updatedUser.id,
                email: updatedUser.email,
                name: updatedUser.name
            }
        };
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)('send-code'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "sendCode", null);
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "login", null);
__decorate([
    (0, common_1.Post)('reset-password'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "resetPassword", null);
__decorate([
    (0, common_1.Post)('verify-email'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "verifyEmail", null);
__decorate([
    (0, common_1.Post)('profile'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "getProfile", null);
__decorate([
    (0, common_1.Post)('profile/update'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "updateProfile", null);
exports.UserController = UserController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [user_service_1.UserService,
        verification_service_1.VerificationService])
], UserController);
