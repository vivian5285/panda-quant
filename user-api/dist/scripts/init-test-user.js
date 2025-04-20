"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const User_1 = require("../models/User");
const password_1 = require("../utils/password");
const database_1 = require("../config/database");
const mongoose_1 = __importDefault(require("mongoose"));
const initTestUser = async () => {
    try {
        // 先连接数据库
        await (0, database_1.connectDB)();
        // 删除现有的集合
        try {
            await mongoose_1.default.connection.collection('users').drop();
            console.log('Existing users collection dropped');
        }
        catch (error) {
            // 如果集合不存在，忽略错误
            console.log('No existing users collection to drop');
        }
        const userModel = new User_1.UserModel();
        const hashedPassword = await (0, password_1.hashPassword)('PandaQuant123!');
        const testUser = {
            email: 'test@example.com',
            password: 'password123',
            name: 'Test User',
            username: 'testuser',
            isVerified: true
        };
        await userModel.createUser(testUser);
        console.log('Test user created successfully');
        process.exit(0);
    }
    catch (error) {
        console.error('Error creating test user:', error);
        process.exit(1);
    }
};
initTestUser();
