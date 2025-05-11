#!/bin/bash

# 进入项目根目录
cd "$(dirname "$0")/.."

# 清理构建缓存
rm -rf dist tsconfig.tsbuildinfo

# 进入 src 目录
cd src

# 1. 修复 types 目录下的文件名大小写
cd types
echo "正在修复 types 目录下的文件名大小写..."

# 创建临时目录
mkdir -p ../temp_types

# 复制所有文件到临时目录，并转换为大写
for file in *.ts *.d.ts; do
    if [ -f "$file" ]; then
        # 获取文件名（不含扩展名）和扩展名
        filename="${file%.*}"
        extension="${file##*.}"
        # 转换为大写
        newname="$(echo "$filename" | tr '[:lower:]' '[:upper:]').$extension"
        # 复制到临时目录
        cp "$file" "../temp_types/$newname"
    fi
done

# 删除原文件
rm -f *.ts *.d.ts

# 将临时目录中的文件移回
mv ../temp_types/* .
rmdir ../temp_types

# 2. 修复 controllers 目录下的文件名大小写
cd ../controllers
echo "正在修复 controllers 目录下的文件名大小写..."

# 创建临时目录
mkdir -p ../temp_controllers

# 复制所有文件到临时目录，并转换为大写
for file in *.ts; do
    if [ -f "$file" ]; then
        # 获取文件名（不含扩展名）和扩展名
        filename="${file%.*}"
        extension="${file##*.}"
        # 转换为大写
        newname="$(echo "$filename" | tr '[:lower:]' '[:upper:]').$extension"
        # 复制到临时目录
        cp "$file" "../temp_controllers/$newname"
    fi
done

# 删除原文件
rm -f *.ts

# 将临时目录中的文件移回
mv ../temp_controllers/* .
rmdir ../temp_controllers

# 3. 修复所有导入语句
cd ..
echo "正在修复导入语句..."

# 修复 types 目录的导入
find . -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/\([a-z]\)/from "..\/types\/\U\1/g' {} +
find . -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/\([a-z][a-z]*\)/from "..\/types\/\U\1/g' {} +

# 修复 controllers 目录的导入
find . -type f -name "*.ts" -exec sed -i 's/from "\.\.\/controllers\/\([a-z]\)/from "..\/controllers\/\U\1/g' {} +
find . -type f -name "*.ts" -exec sed -i 's/from "\.\.\/controllers\/\([a-z][a-z]*\)/from "..\/controllers\/\U\1/g' {} +

# 修复错误的导入路径
find . -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/\.\.\/controllers\//from "..\/controllers\//g' {} +

# 4. 修复 tsconfig.json
cd ..
echo "正在修复 tsconfig.json..."

# 修改 tsconfig.json 中的配置
sed -i 's/"forceConsistentCasingInFileNames": true/"forceConsistentCasingInFileNames": false/g' tsconfig.json

# 5. 重新构建项目
echo "正在重新构建项目..."
npm run build

echo "修复完成！" 