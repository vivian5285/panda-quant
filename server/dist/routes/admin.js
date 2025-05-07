"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const requestHandler_1 = require("../utils/requestHandler");
const ensureAuthenticated_1 = require("../middleware/ensureAuthenticated");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const AdminController_1 = require("../controllers/AdminController");
const router = express_1.default.Router();
const adminController = new AdminController_1.AdminController();
// All admin routes require authentication and admin privileges
router.use(ensureAuthenticated_1.ensureAuthenticated);
router.use(adminMiddleware_1.adminMiddleware);
// User management
router.get('/users', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await adminController.getAllUsers(req, res);
}));
router.get('/users/:id', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await adminController.getUserById(req, res);
}));
router.put('/users/:id', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await adminController.updateUser(req, res);
}));
router.delete('/users/:id', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await adminController.deleteUser(req, res);
}));
// System settings
router.get('/settings', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await adminController.getSettings(req, res);
}));
router.put('/settings', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await adminController.updateSettings(req, res);
}));
// System logs
router.get('/logs', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await adminController.getLogs(req, res);
}));
router.get('/logs/:id', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await adminController.getLogById(req, res);
}));
exports.default = router;
//# sourceMappingURL=admin.js.map