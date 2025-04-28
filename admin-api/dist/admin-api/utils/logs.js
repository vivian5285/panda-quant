"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLog = void 0;
const logService_1 = require("../services/logService");
const createLog = async (level, message, source, details) => {
    try {
        await logService_1.logService.createLog(level, message, source, details);
    }
    catch (error) {
        console.error('Failed to create log:', error);
    }
};
exports.createLog = createLog;
