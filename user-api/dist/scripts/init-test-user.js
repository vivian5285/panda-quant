"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const user_model_1 = require("../models/user.model");
async function initTestUser() {
    try {
        const email = 'test@example.com';
        const password = 'test123';
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        const user = await user_model_1.User.findOne({ email });
        if (!user) {
            await user_model_1.User.create({
                email,
                password: hashedPassword,
                role: 'admin'
            });
            console.log('Test user created successfully');
        }
        else {
            console.log('Test user already exists');
        }
    }
    catch (error) {
        console.error('Error creating test user:', error);
    }
}
initTestUser();
//# sourceMappingURL=init-test-user.js.map