# PandaQuant - 熊猫量化交易平台

## 🚀 项目简介

PandaQuant 是一个专业的量化交易平台，提供智能交易策略和自动化交易服务。我们通过先进的算法和专业的团队，帮助用户实现稳定的投资收益。

## 🎯 核心特点

- 🧠 智能策略：剥头皮 / 超级趋势 / 网格套利
- 🏦 托管灵活：支持 API 托管 / USDT 充值托管
- 💰 收益保障：支持低中高风险策略，动态调节
- 🔒 安全保障：多重风控机制，API 只读授权
- 🌐 多语言支持：支持 30+ 种语言
- 📱 响应式设计：完美适配移动端和桌面端

## 🛠️ 技术栈

- **前端**：
  - React 18
  - TypeScript
  - Material-UI
  - Framer Motion
  - Chart.js
  - i18next

- **后端**：
  - Node.js
  - Express
  - MongoDB
  - Redis
  - WebSocket

## 📁 项目结构

```
panda-quant/
├── user-ui/                 # 用户界面
│   ├── public/             # 静态资源
│   └── src/
│       ├── components/     # 组件
│       │   ├── home/      # 首页组件
│       │   │   ├── HeroBanner.tsx        # 首页横幅
│       │   │   ├── CoreAdvantages.tsx    # 核心优势
│       │   │   ├── ProfitSection.tsx     # 收益展示
│       │   │   ├── StrategySection.tsx   # 策略展示
│       │   │   ├── SecuritySection.tsx   # 安全保障
│       │   │   ├── InviteSection.tsx     # 邀请返佣
│       │   │   ├── FAQSection.tsx        # 常见问题
│       │   │   ├── ContactSection.tsx    # 联系方式
│       │   │   ├── PandaCharacter.tsx    # 熊猫角色
│       │   │   └── HomePage.tsx          # 首页布局
│       │   └── layout/    # 布局组件
│       │       ├── Header.tsx            # 导航栏
│       │       └── Footer.tsx            # 页脚
│       ├── pages/         # 页面
│       ├── styles/        # 样式
│       ├── utils/         # 工具函数
│       ├── hooks/         # 自定义钩子
│       ├── context/       # 上下文
│       ├── services/      # API 服务
│       ├── types/         # 类型定义
│       ├── i18n/          # 国际化
│       ├── App.tsx        # 应用入口
│       └── index.tsx      # 渲染入口
│
├── admin-ui/              # 管理界面
│   └── ...
│
├── server/                # 后端服务
│   ├── src/
│   │   ├── controllers/   # 控制器
│   │   ├── models/        # 数据模型
│   │   ├── routes/        # 路由
│   │   ├── services/      # 业务逻辑
│   │   ├── utils/         # 工具函数
│   │   ├── config/        # 配置文件
│   │   └── app.ts         # 应用入口
│   └── ...
│
└── shared/                # 共享代码
    └── ...
```

## 🎨 设计风格

- **主色调**：黑 + 熊猫绿（#00FFB8）+ 纯白补光
- **字体**：英文：Poppins，中文：阿里巴巴普惠体
- **卡片**：玻璃拟态 + 阴影 hover 效果
- **动画**：Framer Motion 动画熊猫元素，渐入渐出
- **特效**：背景星光点点流动 / 波动图展示 / 放大按钮

## 🚀 快速开始

1. 克隆项目
```bash
git clone https://github.com/your-username/panda-quant.git
cd panda-quant
```

2. 安装依赖
```bash
# 安装用户界面依赖
cd user-ui
npm install

# 安装管理界面依赖
cd ../admin-ui
npm install

# 安装后端依赖
cd ../server
npm install
```

3. 配置环境变量
```bash
# 复制示例环境变量文件
cp .env.example .env

# 编辑 .env 文件，填入必要的配置
```

4. 启动开发服务器
```bash
# 启动用户界面
cd user-ui
npm run dev

# 启动管理界面
cd admin-ui
npm run dev

# 启动后端服务
cd server
npm run dev
```

## 📝 开发指南

### 组件开发规范

1. **命名规范**
   - 组件文件使用 PascalCase
   - 工具函数使用 camelCase
   - 常量使用 UPPER_SNAKE_CASE

2. **代码风格**
   - 使用 TypeScript
   - 遵循 ESLint 规则
   - 使用 Prettier 格式化代码

3. **组件结构**
   ```typescript
   import React from 'react';
   import { Box, Typography } from '@mui/material';
   import { motion } from 'framer-motion';
   import { useTranslation } from 'react-i18next';

   interface ComponentProps {
     // 属性定义
   }

   const Component: React.FC<ComponentProps> = ({ /* 属性 */ }) => {
     // 状态和逻辑
     return (
       // JSX
     );
   };

   export default Component;
   ```

### 国际化开发

1. 在 `src/i18n/locales` 目录下添加新的语言文件
2. 使用 `useTranslation` hook 获取翻译
3. 遵循翻译键命名规范：`组件名.功能名`

### 样式开发

1. 使用 Material-UI 的主题系统
2. 遵循设计规范中的颜色和字体
3. 使用 Framer Motion 添加动画效果

## 🤝 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 📞 联系方式

- 邮箱：support@pandaquant.com
- Telegram：@pandaquant
- Discord：PandaQuant 