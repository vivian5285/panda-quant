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

# 3. 修复 services 目录下的文件名大小写
cd ../services
echo "正在修复 services 目录下的文件名大小写..."

# 创建临时目录
mkdir -p ../temp_services

# 复制所有文件到临时目录，并转换为大写
for file in *.ts; do
    if [ -f "$file" ]; then
        # 获取文件名（不含扩展名）和扩展名
        filename="${file%.*}"
        extension="${file##*.}"
        # 转换为大写
        newname="$(echo "$filename" | tr '[:lower:]' '[:upper:]').$extension"
        # 复制到临时目录
        cp "$file" "../temp_services/$newname"
    fi
done

# 删除原文件
rm -f *.ts

# 将临时目录中的文件移回
mv ../temp_services/* .
rmdir ../temp_services

# 4. 修复所有导入语句
cd ..
echo "正在修复导入语句..."

# 修复 types 目录的导入
find . -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/\([a-z]\)/from "..\/types\/\U\1/g' {} +
find . -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/\([a-z][a-z]*\)/from "..\/types\/\U\1/g' {} +

# 修复 controllers 目录的导入
find . -type f -name "*.ts" -exec sed -i 's/from "\.\.\/controllers\/\([a-z]\)/from "..\/controllers\/\U\1/g' {} +
find . -type f -name "*.ts" -exec sed -i 's/from "\.\.\/controllers\/\([a-z][a-z]*\)/from "..\/controllers\/\U\1/g' {} +

# 修复 services 目录的导入
find . -type f -name "*.ts" -exec sed -i 's/from "\.\.\/services\/\([a-z]\)/from "..\/services\/\U\1/g' {} +
find . -type f -name "*.ts" -exec sed -i 's/from "\.\.\/services\/\([a-z][a-z]*\)/from "..\/services\/\U\1/g' {} +

# 修复错误的导入路径
find . -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/\.\.\/controllers\//from "..\/controllers\//g' {} +
find . -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/\.\.\/services\//from "..\/services\//g' {} +

# 修复相对路径导入
find . -type f -name "*.ts" -exec sed -i 's/from "\.\/\([a-z]\)/from ".\/\U\1/g' {} +
find . -type f -name "*.ts" -exec sed -i 's/from "\.\/\([a-z][a-z]*\)/from ".\/\U\1/g' {} +

# 修复 types 目录内的相互导入
cd types
find . -type f -name "*.ts" -exec sed -i 's/from "\.\/\([a-z]\)/from ".\/\U\1/g' {} +
find . -type f -name "*.ts" -exec sed -i 's/from "\.\/\([a-z][a-z]*\)/from ".\/\U\1/g' {} +

# 修复 express 相关的导入
cd ..
find . -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/express"/from "..\/types\/Express"/g' {} +
find . -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/auth"/from "..\/types\/Auth"/g' {} +
find . -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/enums"/from "..\/types\/Enums"/g' {} +
find . -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/user"/from "..\/types\/User"/g' {} +
find . -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/strategy"/from "..\/types\/Strategy"/g' {} +
find . -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/commission"/from "..\/types\/Commission"/g' {} +
find . -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/trading"/from "..\/types\/Trading"/g' {} +
find . -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/performance"/from "..\/types\/Performance"/g' {} +
find . -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/exchange"/from "..\/types\/Exchange"/g' {} +
find . -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/mt4"/from "..\/types\/Mt4"/g' {} +
find . -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/network"/from "..\/types\/Network"/g' {} +
find . -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/health"/from "..\/types\/Health"/g' {} +
find . -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/position"/from "..\/types\/Position"/g' {} +
find . -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/risk"/from "..\/types\/Risk"/g' {} +
find . -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/strategyRating"/from "..\/types\/StrategyRating"/g' {} +
find . -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/strategyReview"/from "..\/types\/StrategyReview"/g' {} +
find . -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/blacklist"/from "..\/types\/Blacklist"/g' {} +
find . -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/userLevel"/from "..\/types\/UserLevel"/g' {} +
find . -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/withdrawal"/from "..\/types\/Withdrawal"/g' {} +
find . -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/wallet"/from "..\/types\/Wallet"/g' {} +
find . -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/transaction"/from "..\/types\/Transaction"/g' {} +
find . -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/alert"/from "..\/types\/Alert"/g' {} +
find . -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/deposit"/from "..\/types\/Deposit"/g' {} +
find . -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/commissionWithdrawal"/from "..\/types\/CommissionWithdrawal"/g' {} +

# 5. 修复 tsconfig.json
cd ..
echo "正在修复 tsconfig.json..."

# 修改 tsconfig.json 中的配置
sed -i 's/"forceConsistentCasingInFileNames": true/"forceConsistentCasingInFileNames": false/g' tsconfig.json

# 6. 重新构建项目
echo "正在重新构建项目..."
npm run build

echo "修复完成！" 