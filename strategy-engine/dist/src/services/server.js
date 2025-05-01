"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.app = void 0;
exports.startServer = startServer;
exports.stopServer = stopServer;
exports.checkServerHealth = checkServerHealth;
const express_1 = __importDefault(require("express"));
const config_1 = require("../config");
exports.app = (0, express_1.default)();
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        exports.app.listen(config_1.config.server.port, () => {
            console.log(`Server running on port ${config_1.config.server.port}`);
        });
    });
}
function stopServer() {
    return __awaiter(this, void 0, void 0, function* () {
        // TODO: Implement graceful shutdown
        process.exit(0);
    });
}
function checkServerHealth() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // TODO: Implement actual server health check
            return true;
        }
        catch (error) {
            console.error('Server health check failed:', error);
            return false;
        }
    });
}
