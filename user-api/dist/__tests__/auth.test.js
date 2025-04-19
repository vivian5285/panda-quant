"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongodb_memory_server_1 = require("mongodb-memory-server");
const auth_controller_1 = require("../controllers/auth.controller");
const User_1 = require("../models/User");
const password_1 = require("../utils/password");
let mongoServer;
beforeAll(async () => {
    mongoServer = await mongodb_memory_server_1.MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose_1.default.connect(mongoUri);
});
afterAll(async () => {
    await mongoose_1.default.disconnect();
    await mongoServer.stop();
});
describe('AuthController', () => {
    let authController;
    let userModel;
    beforeEach(async () => {
        await mongoose_1.default.connection.dropDatabase();
        authController = new auth_controller_1.AuthController();
        userModel = new User_1.UserModel();
    });
    describe('register', () => {
        it('should register a new user successfully', async () => {
            const req = {
                body: {
                    email: 'test@example.com',
                    password: 'password123',
                    name: 'Test User'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            await authController.register(req, res);
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({
                message: 'User registered successfully. Please check your email for verification.'
            });
            const user = await userModel.findUserByEmail('test@example.com');
            expect(user).toBeTruthy();
            expect(user === null || user === void 0 ? void 0 : user.email).toBe('test@example.com');
            expect(user === null || user === void 0 ? void 0 : user.name).toBe('Test User');
            expect(user === null || user === void 0 ? void 0 : user.isVerified).toBe(false);
        });
        it('should not register a user with missing fields', async () => {
            const req = {
                body: {
                    email: 'test@example.com'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            await authController.register(req, res);
            expect(res.status).toHaveBeenCalledWith(400);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Missing required fields'
            });
        });
    });
    describe('login', () => {
        beforeEach(async () => {
            const hashedPassword = await (0, password_1.hashPassword)('password123');
            await userModel.createUser({
                email: 'test@example.com',
                password: hashedPassword,
                name: 'Test User',
                isVerified: true
            });
        });
        it('should login successfully with correct credentials', async () => {
            const req = {
                body: {
                    email: 'test@example.com',
                    password: 'password123'
                }
            };
            const res = {
                json: jest.fn()
            };
            await authController.login(req, res);
            expect(res.json).toHaveBeenCalled();
            const response = res.json.mock.calls[0][0];
            expect(response.token).toBeTruthy();
            expect(response.user.email).toBe('test@example.com');
            expect(response.user.name).toBe('Test User');
        });
        it('should not login with incorrect password', async () => {
            const req = {
                body: {
                    email: 'test@example.com',
                    password: 'wrongpassword'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            await authController.login(req, res);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Invalid credentials'
            });
        });
        it('should not login unverified user', async () => {
            var _a;
            await userModel.updateUser(((_a = (await userModel.findUserByEmail('test@example.com'))) === null || _a === void 0 ? void 0 : _a._id.toString()) || '', { isVerified: false });
            const req = {
                body: {
                    email: 'test@example.com',
                    password: 'password123'
                }
            };
            const res = {
                status: jest.fn().mockReturnThis(),
                json: jest.fn()
            };
            await authController.login(req, res);
            expect(res.status).toHaveBeenCalledWith(401);
            expect(res.json).toHaveBeenCalledWith({
                message: 'Please verify your email first'
            });
        });
    });
});
