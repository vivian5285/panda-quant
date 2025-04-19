"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const error_middleware_1 = require("./middleware/error.middleware");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const verification_routes_1 = __importDefault(require("./routes/verification.routes"));
const app = (0, express_1.default)();
// 中间件
app.use((0, cors_1.default)());
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// 路由
app.use('/api/auth', auth_routes_1.default);
app.use('/api/verification', verification_routes_1.default);
// 错误处理
app.use(error_middleware_1.errorHandler);
// 启动服务器
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
exports.default = app;
