# User Interface - 用户界面

## 📋 简介

用户界面是 PandaQuant 平台的前端部分，为用户提供直观、易用的交易策略管理和监控界面。采用现代化的设计风格，支持多语言，并针对移动端和桌面端进行了优化。

## 🎯 核心功能

### 1. 用户管理
- 注册/登录
- 个人资料管理
- 安全设置
- 通知中心

### 2. 策略管理
- 策略创建和配置
- 策略参数调整
- 策略启动/停止
- 策略性能监控

### 3. 收益管理
- 收益统计和图表
- 佣金记录
- 团队返佣
- 提现管理

### 4. 团队管理
- 邀请好友
- 团队收益
- 团队统计
- 返佣记录

### 5. 市场分析
- 实时行情
- 技术指标
- 市场趋势
- 交易信号

## 📁 目录结构

```
user-ui/
├── public/                # 静态资源
└── src/
    ├── components/        # 组件
    │   ├── home/         # 首页组件
    │   │   ├── HeroBanner.tsx        # 首页横幅
    │   │   ├── CoreAdvantages.tsx    # 核心优势
    │   │   ├── ProfitSection.tsx     # 收益展示
    │   │   ├── StrategySection.tsx   # 策略展示
    │   │   ├── SecuritySection.tsx   # 安全保障
    │   │   ├── InviteSection.tsx     # 邀请返佣
    │   │   ├── FAQSection.tsx        # 常见问题
    │   │   ├── ContactSection.tsx    # 联系方式
    │   │   ├── PandaCharacter.tsx    # 熊猫角色
    │   │   └── HomePage.tsx          # 首页布局
    │   └── layout/       # 布局组件
    │       ├── Header.tsx            # 导航栏
    │       └── Footer.tsx            # 页脚
    ├── pages/            # 页面
    ├── styles/           # 样式
    ├── utils/            # 工具函数
    ├── hooks/            # 自定义钩子
    ├── context/          # 上下文
    ├── services/         # API 服务
    ├── types/            # 类型定义
    ├── i18n/             # 国际化
    ├── App.tsx           # 应用入口
    └── index.tsx         # 渲染入口
```

## 🎨 设计规范

### 1. 颜色系统
- 主色：熊猫绿 (#00FFB8)
- 背景色：深黑 (#121212)
- 文字色：纯白 (#FFFFFF)
- 强调色：亮蓝 (#00B8FF)
- 警告色：红色 (#FF3B30)

### 2. 排版
- 标题：Poppins Bold
- 正文：Poppins Regular
- 中文：阿里巴巴普惠体
- 代码：JetBrains Mono

### 3. 组件规范
- 卡片：玻璃拟态效果
- 按钮：渐变色 + 悬停动画
- 表单：圆角 + 阴影
- 图表：暗色主题

## 🔧 开发指南

### 1. 环境设置
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build
```

### 2. 组件开发
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

### 3. 样式开发
```typescript
// 使用 Material-UI 主题
import { createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#00FFB8',
    },
    background: {
      default: '#121212',
    },
  },
});
```

### 4. 国际化
```typescript
// 添加翻译
{
  "home": {
    "title": "熊猫量化交易平台",
    "subtitle": "智能交易，稳定收益"
  }
}

// 使用翻译
const { t } = useTranslation();
<h1>{t('home.title')}</h1>
```

## 📱 响应式设计

### 断点设置
```typescript
const breakpoints = {
  xs: 0,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
};
```

### 媒体查询
```typescript
const styles = {
  container: {
    [theme.breakpoints.down('sm')]: {
      padding: '1rem',
    },
    [theme.breakpoints.up('md')]: {
      padding: '2rem',
    },
  },
};
```

## 🧪 测试

### 单元测试
```bash
npm test
```

### E2E 测试
```bash
npm run test:e2e
```

## 📈 性能优化

- 代码分割
- 懒加载
- 图片优化
- 缓存策略
- 预加载关键资源

## 🔒 安全措施

- XSS 防护
- CSRF 防护
- 输入验证
- 敏感数据加密
- 安全头部设置

## 📝 文档

- [组件文档](docs/components.md)
- [API 文档](docs/api.md)
- [设计规范](docs/design.md)
- [部署指南](docs/deployment.md)

## 🤝 贡献

欢迎提交 Pull Request 或创建 Issue。

## 📄 许可证

MIT 