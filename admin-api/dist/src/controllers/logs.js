"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LogController = exports.getLogStats = exports.getLogs = void 0;
const logs_1 = require("../services/logs");
const logService = new logs_1.LogService();
const getLogs = async (req, res) => {
    try {
        const { level, source, startDate, endDate } = req.query;
        const logs = await logService.getLogs(level, source, startDate ? new Date(startDate) : undefined, endDate ? new Date(endDate) : undefined);
        res.json(logs);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get logs' });
    }
};
exports.getLogs = getLogs;
const getLogStats = async (req, res) => {
    try {
        const stats = await logService.getLogStats();
        res.json(stats);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to get log stats' });
    }
};
exports.getLogStats = getLogStats;
class LogController {
    async createLog(req, res) {
        try {
            const { level, message, source, details } = req.body;
            if (!level || !message || !source) {
                return res.status(400).json({ error: 'Missing required fields' });
            }
            const log = await logService.createLog(level, message, source, details);
            res.status(201).json(log);
        }
        catch (error) {
            console.error('Error creating log:', error);
            res.status(500).json({ error: 'Failed to create log' });
        }
    }
}
exports.LogController = LogController;
