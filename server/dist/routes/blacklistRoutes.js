"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const requestHandler_1 = require("../utils/requestHandler");
const ensureAuthenticated_1 = require("../middleware/ensureAuthenticated");
const adminMiddleware_1 = require("../middleware/adminMiddleware");
const BlacklistController_1 = require("../types/../controllers/BlacklistController");
const router = express_1.default.Router();
// All blacklist routes require authentication and admin privileges
router.use(ensureAuthenticated_1.ensureAuthenticated);
router.use(adminMiddleware_1.adminMiddleware);
// Get all blacklist entries
router.get('/', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await BlacklistController_1.blacklistController.getAllEntries(req, res);
}));
// Get single blacklist entry
router.get('/:id', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await BlacklistController_1.blacklistController.getEntryById(req, res);
}));
// Create blacklist entry
router.post('/', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await BlacklistController_1.blacklistController.createEntry(req, res);
}));
// Update blacklist entry
router.put('/:id', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await BlacklistController_1.blacklistController.updateEntry(req, res);
}));
// Delete blacklist entry
router.delete('/:id', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await BlacklistController_1.blacklistController.deleteEntry(req, res);
}));
// Search blacklist entries
router.get('/search', (0, requestHandler_1.handleRequest)(async (req, res) => {
    await BlacklistController_1.blacklistController.searchEntries(req, res);
}));
exports.default = router;
//# sourceMappingURL=blacklistRoutes.js.map