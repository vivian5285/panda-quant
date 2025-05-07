"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const logger_1 = require("./utils/logger");
const db_1 = require("./db");
const port = process.env.PORT || 3005;
const startServer = async () => {
    try {
        await (0, db_1.connectDB)();
        app_1.default.listen(port, () => {
            logger_1.logger.info(`Server is running on port ${port}`);
        });
    }
    catch (error) {
        logger_1.logger.error('Error starting server:', error);
        process.exit(1);
    }
};
startServer();
//# sourceMappingURL=index.js.map