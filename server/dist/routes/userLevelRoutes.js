"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const requestHandler_1 = require("../utils/requestHandler");
const ensureAuthenticated_1 = require("../middleware/ensureAuthenticated");
const UserLevelController_1 = require("../types/../controllers/UserLevelController");
const router = express_1.default.Router();
const userLevelController = new UserLevelController_1.UserLevelController();
// Protected routes
router.use(ensureAuthenticated_1.ensureAuthenticated);
// Get all user levels
router.get('/', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await userLevelController.getAllLevels(req, res);
}));
// Get single user level
router.get('/:id', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await userLevelController.getUserLevel(req, res);
}));
// Create user level
router.post('/', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await userLevelController.createLevel(req, res);
}));
// Update user level
router.put('/:id', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await userLevelController.updateLevel(req, res);
}));
// Delete user level
router.delete('/:id', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await userLevelController.deleteLevel(req, res);
}));
exports.default = router;
//# sourceMappingURL=userLevelRoutes.js.map