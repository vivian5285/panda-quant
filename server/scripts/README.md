# 脚本说明

## fix-casing.sh

这个脚本用于修复 TypeScript 项目中的文件名大小写问题，主要解决在 Linux 系统上部署时遇到的文件名大小写不一致的问题。

### 功能

1. 修复 types 目录下所有文件的大小写
2. 修复 controllers 目录下所有文件的大小写
3. 修复所有导入语句中的大小写问题
4. 修复错误的导入路径
5. 修改 tsconfig.json 配置
6. 重新构建项目

### 使用方法

1. 确保脚本有执行权限：
```bash
chmod +x scripts/fix-casing.sh
```

2. 在项目根目录下运行脚本：
```bash
./scripts/fix-casing.sh
```

### 注意事项

1. 运行脚本前请确保已提交或备份所有更改
2. 脚本会修改文件名和导入语句，请确保在运行前已备份重要文件
3. 脚本会删除 dist 目录和 tsconfig.tsbuildinfo 文件，请确保这些文件可以安全删除
4. 脚本会修改 tsconfig.json 中的 forceConsistentCasingInFileNames 选项为 false

### 故障排除

如果遇到权限问题，请确保：
1. 脚本有执行权限
2. 当前用户有足够的权限修改项目文件

如果遇到其他问题，请检查：
1. 是否在正确的目录下运行脚本
2. 项目结构是否符合预期
3. 是否有足够的磁盘空间 