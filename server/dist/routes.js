"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const commissionRoutes_1 = __importDefault(require("./routes/commissionRoutes"));
const blacklistRoutes_1 = __importDefault(require("./routes/blacklistRoutes"));
const admin_1 = __importDefault(require("./routes/admin"));
const strategyRoutes_1 = __importDefault(require("./routes/strategyRoutes"));
const userLevelRoutes_1 = __importDefault(require("./routes/userLevelRoutes"));
const withdrawalRoutes_1 = __importDefault(require("./routes/withdrawalRoutes"));
const settlement_1 = __importDefault(require("./routes/settlement"));
const auth_1 = require("./middleware/auth");
const userController_1 = require("./controllers/userController");
const router = express_1.default.Router();
// Public routes (no authentication required)
router.post('/login', (req, res) => {
    const userController = new userController_1.UserController();
    return userController.login(req, res);
});
router.post('/register', (req, res) => {
    const userController = new userController_1.UserController();
    return userController.register(req, res);
});
// Protected routes (require authentication)
router.use(auth_1.authenticate);
// Setup all protected routes
(0, userRoutes_1.default)(router);
(0, commissionRoutes_1.default)(router);
(0, blacklistRoutes_1.default)(router);
(0, admin_1.default)(router);
(0, strategyRoutes_1.default)(router);
(0, userLevelRoutes_1.default)(router);
(0, withdrawalRoutes_1.default)(router);
(0, settlement_1.default)(router);
exports.default = router;
//# sourceMappingURL=routes.js.map