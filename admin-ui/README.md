# Admin UI

管理后台前端界面

## 环境要求

- Node.js 18+
- npm 8+

## 本地开发

1. 安装依赖
```bash
npm install
```

2. 配置环境变量
创建 `.env` 文件并配置以下环境变量：
```env
REACT_APP_API_URL=http://localhost:3000/api
REACT_APP_WS_URL=ws://localhost:3000
REACT_APP_ENV=development
PORT=3002
```

3. 启动开发服务器
```bash
npm start
```

4. 访问应用
打开浏览器访问 http://localhost:3002

## 构建生产版本

```bash
npm run build
```

## 技术栈

- React 18
- TypeScript
- Material-UI
- React Router
- Axios
- WebSocket 