"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthController_1 = __importDefault(require("../types/../controllers/AuthController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const common_1 = require("../validations/common");
const Auth_1 = require("../validations/common/Auth");
const router = express_1.default.Router();
// Public routes
router.post('/login', (0, common_1.validateRequest)(Auth_1.loginSchema), (req, res) => {
    const authReq = req;
    AuthController_1.default.login(authReq, res);
});
router.post('/register', (0, common_1.validateRequest)(Auth_1.registerSchema), (req, res) => {
    const authReq = req;
    AuthController_1.default.register(authReq, res);
});
// Protected routes
router.get('/profile', authMiddleware_1.authenticate, (req, res) => {
    const authReq = req;
    AuthController_1.default.getCurrentUser(authReq, res);
});
router.put('/profile', authMiddleware_1.authenticate, (req, res) => {
    const authReq = req;
    AuthController_1.default.updateUser(authReq, res);
});
exports.default = router;
//# sourceMappingURL=authRoutes.js.map