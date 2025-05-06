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
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const Strategy_1 = __importDefault(require("../controllers/Strategy"));
const Auth_1 = require("../middleware/Auth");
const router = (0, express_1.Router)();
const userController = new userController_1.UserController();
// 所有路由都需要认证和管理员权限
router.use(Auth_1.authenticate);
router.use(Auth_1.isAdmin);
// 用户管理路由
router.get('/users', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield userController.getAllUsers(req, res);
}));
router.post('/users', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userController.register(req, res);
    }
    catch (error) {
        next(error);
    }
}));
router.put('/users/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield userController.updateUser(req, res);
    }
    catch (error) {
        next(error);
    }
}));
router.delete('/users/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield userController.deleteUser(req, res);
}));
// 策略管理路由
router.get('/strategies', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield Strategy_1.default.getStrategies(req, res);
}));
router.get('/strategies/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield Strategy_1.default.getStrategy(req, res);
}));
router.post('/strategies', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield Strategy_1.default.createStrategy(req, res);
}));
router.put('/strategies/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield Strategy_1.default.updateStrategy(req, res);
}));
router.delete('/strategies/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield Strategy_1.default.deleteStrategy(req, res);
}));
exports.default = router;
//# sourceMappingURL=admin.js.map