"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const AuthController_1 = __importDefault(require("../controllers/AuthController"));
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = express_1.default.Router();
// Public routes
router.post('/login', AuthController_1.default.login);
router.post('/register', AuthController_1.default.register);
// Protected routes
router.get('/profile', authMiddleware_1.authenticate, AuthController_1.default.getCurrentUser);
router.put('/profile', authMiddleware_1.authenticate, AuthController_1.default.updateUser);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map