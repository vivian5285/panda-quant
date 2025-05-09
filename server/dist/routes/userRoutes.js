"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const requestHandler_1 = require("../utils/requestHandler");
const ensureAuthenticated_1 = require("../middleware/ensureAuthenticated");
const UserController_1 = require("../controllers/UserController");
const common_1 = require("../validations/common");
const user_1 = require("../validations/schemas/user");
const router = express_1.default.Router();
const userController = new UserController_1.UserController();
// Protected routes
router.use(ensureAuthenticated_1.ensureAuthenticated);
// Get all users
router.get('/', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await userController.getAllUsers(req, res);
}));
// Get single user
router.get('/:id', (0, common_1.validateParams)(user_1.userIdSchema), (0, requestHandler_1.handleRequest)(async (req, res) => {
    await userController.getUserById(req, res);
}));
// Create user
router.post('/', (0, common_1.validateRequest)(user_1.createUserSchema), (0, requestHandler_1.handleRequest)(async (req, res) => {
    await userController.register(req, res);
}));
// Update user
router.put('/:id', (0, common_1.validateParams)(user_1.userIdSchema), (0, common_1.validateRequest)(user_1.updateUserSchema), (0, requestHandler_1.handleRequest)(async (req, res) => {
    await userController.updateUser(req, res);
}));
// Delete user
router.delete('/:id', (0, common_1.validateParams)(user_1.userIdSchema), (0, requestHandler_1.handleRequest)(async (req, res) => {
    await userController.deleteUser(req, res);
}));
exports.default = router;
//# sourceMappingURL=userRoutes.js.map