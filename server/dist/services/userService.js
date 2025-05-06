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
exports.UserService = void 0;
const mongoose_1 = require("mongoose");
const User_1 = require("../models/User");
const bcrypt_1 = __importDefault(require("bcrypt"));
const logger_1 = require("../utils/logger");
class UserService {
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
        return Object.assign(Object.assign({}, user.toObject()), { _id: user._id });
    }
    authenticate(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield User_1.User.findOne({ email });
                if (!user) {
                    throw new Error('User not found');
                }
                const isValid = yield bcrypt_1.default.compare(password, user.password);
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
                logger_1.logger.error('Authentication error:', error);
                throw error;
            }
        });
    }
    createUser(data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = new User_1.User(Object.assign(Object.assign({}, data), { _id: new mongoose_1.Types.ObjectId(), name: data.name || '', level: data.level || 1, role: data.role || 'user', status: data.status || 'active', permissions: data.permissions || [] }));
            const savedUser = yield user.save();
            const convertedUser = this.convertToIUser(savedUser);
            if (!convertedUser) {
                throw new Error('Failed to create user');
            }
            return convertedUser;
        });
    }
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findById(id);
            return this.convertToIUser(user);
        });
    }
    updateUser(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findByIdAndUpdate(id, data, { new: true });
            return this.convertToIUser(user);
        });
    }
    deleteUser(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield User_1.User.findByIdAndDelete(id);
            return result !== null;
        });
    }
    getUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne({ email });
            return this.convertToIUser(user);
        });
    }
    getUserByUsername(username) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield User_1.User.findOne({ username });
            return this.convertToIUser(user);
        });
    }
    getUsers() {
        return __awaiter(this, void 0, void 0, function* () {
            const users = yield User_1.User.find();
            return users.map(user => this.convertToIUser(user)).filter((user) => user !== null);
        });
    }
}
exports.UserService = UserService;
//# sourceMappingURL=UserService.js.map