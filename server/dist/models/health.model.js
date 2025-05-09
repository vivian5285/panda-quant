"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.Health = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const healthSchema = new mongoose_1.Schema({
    networkStatus: {
        _id: { type: mongoose_1.Schema.Types.ObjectId, required: true },
        network: { type: String, required: true },
        status: { type: String, enum: ['online', 'offline', 'error', 'checking'], required: true },
        lastChecked: { type: Date, required: true },
        latency: { type: Number, required: true },
        type: { type: String, enum: ['database', 'api', 'redis', 'websocket'], required: true },
        responseTime: { type: Number, required: true },
        error: { type: String },
        createdAt: { type: Date, required: true },
        updatedAt: { type: Date, required: true }
    },
    lastChecked: { type: Date, required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});
healthSchema.index({ status: 1 });
healthSchema.index({ lastChecked: -1 });
healthSchema.index({ createdAt: -1 });
exports.Health = mongoose_1.default.model('Health', healthSchema);
exports.default = exports.Health;
//# sourceMappingURL=health.model.js.map