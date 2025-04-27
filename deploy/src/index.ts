import express from 'express';
import rateLimit from 'express-rate-limit';

const app = express();

// 配置速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100 // 限制每个IP在windowMs内最多100个请求
});

app.use(limiter);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
}); 