"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const database_1 = require("./database");
const routes_1 = __importDefault(require("./routes"));
const app = (0, express_1.default)();
const PORT = process.env['PORT'] || 3005;
// 连接数据库
(0, database_1.connectMongoDB)();
(0, database_1.connectRedis)();
// 设置中间件
app.use(express_1.default.json());
// 设置路由
app.use(routes_1.default);
// 启动服务器
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map