"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const authController_1 = require("./controllers/authController");
const app = (0, express_1.default)();
// 中间件
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// 路由
app.use('/api/auth', authRoutes_1.default);
// 连接数据库
mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/panda-quant')
    .then(async () => {
    console.log('Connected to MongoDB');
    // 初始化管理员账号
    await (0, authController_1.initAdmin)();
})
    .catch((error) => {
    console.error('MongoDB connection error:', error);
});
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
