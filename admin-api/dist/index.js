"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const user_1 = __importDefault(require("./routes/user"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// 中间件
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// 数据库连接
mongoose_1.default.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/panda-quant')
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));
// 路由
app.use('/api/admin/users', user_1.default);
// 健康检查端点
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        message: 'Panda Quant Admin API is running'
    });
});
// 错误处理中间件
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});
const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
    console.log(`Admin API server is running on port ${PORT}`);
});
