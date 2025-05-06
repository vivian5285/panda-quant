"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const error_1 = require("./middleware/error");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const verification_routes_1 = __importDefault(require("./routes/verification.routes"));
const sync_service_1 = require("./services/sync.service");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use('/api', routes_1.default);
app.use('/api/auth', auth_routes_1.default);
app.use('/api/verification', verification_routes_1.default);
app.use((err, _req, res, _next) => {
    (0, error_1.errorHandler)(err, _req, res, _next);
});
async function startServer() {
    try {
        await mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/panda-quant');
        console.log('Connected to MongoDB');
        await sync_service_1.syncService.startSync();
        console.log('Sync service started');
        const PORT = process.env.PORT || 3000;
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}
startServer();
exports.default = app;
//# sourceMappingURL=app.js.map