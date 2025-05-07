"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const requestHandler_1 = require("../utils/requestHandler");
const ensureAuthenticated_1 = require("../middleware/ensureAuthenticated");
const BlacklistController_1 = require("../controllers/BlacklistController");
const router = express_1.default.Router();
// Protected routes
router.use(ensureAuthenticated_1.ensureAuthenticated);
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
exports.default = router;
//# sourceMappingURL=blacklistRoutes.js.map