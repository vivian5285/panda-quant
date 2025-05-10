import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

const srcDir = path.join(__dirname, '..');

// 获取所有 TypeScript 文件
const files = glob.sync('**/*.ts', {
  cwd: srcDir,
  ignore: ['**/node_modules/**', '**/dist/**', '**/scripts/**']
});

// 创建文件名映射
const fileMap = new Map(
  files.map(file => [
    file.toLowerCase(),
    file
  ])
);

// 修复导入路径
files.forEach(file => {
  const filePath = path.join(srcDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // 修复文件导入
  fileMap.forEach((correctCase, lowerCase) => {
    const regex = new RegExp(`from ['"]\\.\\./([^'"]*?)/${lowerCase}['"]`, 'gi');
    content = content.replace(regex, (match, dir) => {
      return `from '../${dir}/${correctCase}'`;
    });
  });

  fs.writeFileSync(filePath, content);
  console.log(`Fixed imports in ${file}`);
});

console.log('File imports have been fixed!'); 