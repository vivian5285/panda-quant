# Admin Interface - 管理界面

## 📋 简介

管理界面是 PandaQuant 平台的后台管理系统，为管理员提供全面的平台管理功能，包括用户管理、策略监控、收益统计和系统配置等。

## 🎯 核心功能

### 1. 用户管理
- 用户列表和详情
- 用户状态管理
- 用户权限控制
- 用户行为日志

### 2. 策略管理
- 策略列表和详情
- 策略状态监控
- 策略参数调整
- 策略性能分析

### 3. 收益管理
- 平台收益统计
- 用户收益明细
- 佣金记录管理
- 提现审核

### 4. 团队管理
- 团队结构查看
- 团队收益统计
- 返佣记录管理
- 团队分析报告

### 5. 系统管理
- 系统配置
- 日志管理
- 数据备份
- 系统监控

## 📁 目录结构

```
admin-ui/
├── public/                # 静态资源
└── src/
    ├── components/        # 组件
    │   ├── dashboard/    # 仪表盘组件
    │   │   ├── Overview.tsx          # 总览
    │   │   ├── UserStats.tsx         # 用户统计
    │   │   ├── RevenueStats.tsx      # 收益统计
    │   │   ├── StrategyStats.tsx     # 策略统计
    │   │   └── SystemStats.tsx       # 系统统计
    │   ├── users/        # 用户管理组件
    │   │   ├── UserList.tsx          # 用户列表
    │   │   ├── UserDetail.tsx        # 用户详情
    │   │   └── UserEdit.tsx          # 用户编辑
    │   ├── strategies/   # 策略管理组件
    │   │   ├── StrategyList.tsx      # 策略列表
    │   │   ├── StrategyDetail.tsx    # 策略详情
    │   │   └── StrategyEdit.tsx      # 策略编辑
    │   └── layout/       # 布局组件
    │       ├── Sidebar.tsx           # 侧边栏
    │       ├── Header.tsx            # 顶部栏
    │       └── MainLayout.tsx        # 主布局
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
- 主色：深蓝 (#1A237E)
- 背景色：浅灰 (#F5F5F5)
- 文字色：深灰 (#212121)
- 强调色：红色 (#D32F2F)
- 成功色：绿色 (#388E3C)

### 2. 排版
- 标题：Roboto Bold
- 正文：Roboto Regular
- 中文：思源黑体
- 代码：Consolas

### 3. 组件规范
- 表格：固定表头 + 分页
- 表单：验证 + 错误提示
- 图表：响应式 + 交互
- 卡片：阴影 + 圆角

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
      main: '#1A237E',
    },
    background: {
      default: '#F5F5F5',
    },
  },
});
```

### 4. 国际化
```typescript
// 添加翻译
{
  "admin": {
    "dashboard": {
      "title": "管理控制台",
      "welcome": "欢迎回来"
    }
  }
}

// 使用翻译
const { t } = useTranslation();
<h1>{t('admin.dashboard.title')}</h1>
```

## 📊 数据可视化

### 1. 图表类型
- 折线图：趋势分析
- 柱状图：数据对比
- 饼图：比例分布
- 散点图：相关性分析

### 2. 数据更新
- 实时更新：WebSocket
- 定时刷新：轮询
- 手动刷新：按钮触发

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

- 虚拟滚动：大数据列表
- 懒加载：图片和组件
- 缓存策略：API 响应
- 代码分割：路由级别
- 预加载：关键资源

## 🔒 安全措施

- 权限控制：RBAC
- 数据加密：敏感信息
- 操作审计：日志记录
- 输入验证：表单数据
- 防 XSS/CSRF：安全头部

## 📝 文档

- [组件文档](docs/components.md)
- [API 文档](docs/api.md)
- [权限说明](docs/permissions.md)
- [部署指南](docs/deployment.md)

## 🤝 贡献

欢迎提交 Pull Request 或创建 Issue。

## 📄 许可证

MIT 