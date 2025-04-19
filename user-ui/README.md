# 熊猫量化用户界面 (PandaQuant User Interface)

熊猫量化是一个专业的量化交易平台，提供智能交易策略、实时市场分析和用户友好的界面。本仓库包含平台的前端用户界面代码。

## 目录结构

```
user-ui/
├── public/                 # 静态资源
├── src/
│   ├── assets/            # 图片、字体等资源
│   ├── components/        # 可复用组件
│   │   ├── common/       # 通用组件
│   │   ├── home/         # 首页相关组件
│   │   └── layout/       # 布局组件
│   ├── hooks/            # 自定义 React Hooks
│   ├── pages/            # 页面组件
│   ├── services/         # API 服务
│   ├── store/            # 状态管理
│   ├── theme/            # 主题配置
│   ├── types/            # TypeScript 类型定义
│   ├── utils/            # 工具函数
│   ├── App.tsx           # 应用入口
│   └── index.tsx         # 渲染入口
├── .eslintrc.js          # ESLint 配置
├── .prettierrc           # Prettier 配置
├── package.json          # 项目依赖
├── tsconfig.json         # TypeScript 配置
└── vite.config.ts        # Vite 配置
```

## 技术栈

- **框架**: React 18
- **语言**: TypeScript
- **构建工具**: Vite
- **UI 库**: Material-UI (MUI)
- **状态管理**: Redux Toolkit
- **路由**: React Router
- **动画**: Framer Motion
- **图表**: MUI X Charts
- **样式**: Tailwind CSS
- **代码规范**: ESLint + Prettier

## 开发环境要求

- Node.js >= 16.0.0
- npm >= 7.0.0
- TypeScript >= 4.5.0

## 安装与运行

1. 安装依赖：
```bash
npm install
```

2. 启动开发服务器：
```bash
npm run dev
```

3. 构建生产版本：
```bash
npm run build
```

4. 预览生产版本：
```bash
npm run preview
```

## 主要功能

### 1. 首页展示
- 动态熊猫角色
- 用户收益展示
- 策略优势介绍
- 用户评价轮播

### 2. 主题系统
- 支持亮色/暗色主题切换
- 自定义熊猫主题效果
- 响应式设计适配

### 3. 组件库
- 通用组件（按钮、卡片、输入框等）
- 业务组件（收益展示、策略卡片等）
- 动画组件（过渡效果、交互反馈）

### 4. 工具函数
- 主题工具（渐变、玻璃效果等）
- 动画工具（预设动画配置）
- 格式化工具（数字、日期等）

## 开发指南

### 组件开发规范

1. **文件命名**：
   - 组件文件使用 PascalCase（如 `UserProfile.tsx`）
   - 样式文件使用 kebab-case（如 `user-profile.css`）

2. **组件结构**：
```typescript
import React from 'react';
import { useTheme } from '@mui/material';
import { themeUtils } from '../../theme';

interface ComponentProps {
  // 类型定义
}

const Component: React.FC<ComponentProps> = ({ /* props */ }) => {
  // 组件逻辑
  return (
    // JSX
  );
};

export default Component;
```

3. **样式规范**：
   - 优先使用 MUI 的 `sx` prop
   - 使用主题工具函数（`themeUtils`）
   - 遵循响应式设计原则

### 主题使用

1. **主题工具**：
```typescript
import { themeUtils } from '../../theme';

// 渐变文字
themeUtils.gradientText(color1, color2)

// 玻璃效果
themeUtils.glassEffect(opacity)

// 熊猫特效
themeUtils.pandaEffect.glow()
```

2. **动画配置**：
```typescript
import { animations } from '../../theme';

// 使用预设动画
<motion.div
  initial={animations.fadeIn.initial}
  animate={animations.fadeIn.animate}
  transition={animations.fadeIn.transition}
>
```

### 状态管理

1. **Redux Store 结构**：
```typescript
{
  user: {
    profile: UserProfile;
    preferences: UserPreferences;
  },
  theme: {
    mode: 'light' | 'dark';
  },
  // 其他状态...
}
```

2. **异步操作**：
```typescript
// 使用 createAsyncThunk
export const fetchUserData = createAsyncThunk(
  'user/fetchData',
  async (userId: string) => {
    const response = await api.getUserData(userId);
    return response.data;
  }
);
```

## 部署

1. 构建生产版本：
```bash
npm run build
```

2. 部署到服务器：
   - 将 `dist` 目录下的文件部署到 Web 服务器
   - 配置适当的缓存策略
   - 确保 HTTPS 支持

## 贡献指南

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建 Pull Request

## 许可证

本项目采用 MIT 许可证 - 详见 [LICENSE](LICENSE) 文件

## 联系方式

- 项目维护者：[维护者名称]
- 邮箱：[邮箱地址]
- 项目链接：[项目地址]

## 更新日志

### v1.0.0 (2024-04-15)
- 初始版本发布
- 实现基础用户界面
- 添加主题系统
- 集成核心功能组件 