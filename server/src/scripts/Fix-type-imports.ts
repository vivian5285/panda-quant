import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

const typesDir = path.join(__dirname, '../types');
const srcDir = path.join(__dirname, '..');

// 获取所有类型文件名（首字母大写）
const typeFiles = fs.readdirSync(typesDir)
  .filter((file: string) => file.endsWith('.ts') && !file.endsWith('.d.ts'))
  .map((file: string) => path.basename(file, '.ts'));

// 创建类型文件映射（小写 => 首字母大写）
const typeMap = new Map(
  typeFiles.map((file: string) => [file.toLowerCase(), file])
);

// 获取所有 TypeScript 文件
const files = glob.sync('**/*.ts', {
  cwd: srcDir,
  ignore: ['**/node_modules/**', '**/dist/**', '**/scripts/**']
});

files.forEach((file: string) => {
  const filePath = path.join(srcDir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // 修复所有 ../types/xxx、../../types/xxx、./types/xxx
  typeMap.forEach((correctCase, lowerCase) => {
    // ../types/xxx
    content = content.replace(new RegExp(`(from ['"]\.\./types/)${lowerCase}(['"])`, 'g'), `$1${correctCase}$2`);
    // ../../types/xxx
    content = content.replace(new RegExp(`(from ['"]\.\./\.\./types/)${lowerCase}(['"])`, 'g'), `$1${correctCase}$2`);
    // ./types/xxx
    content = content.replace(new RegExp(`(from ['"]\./types/)${lowerCase}(['"])`, 'g'), `$1${correctCase}$2`);
    // ./xxx（用于 types 目录下的相互引用）
    content = content.replace(new RegExp(`(from ['"]\./)${lowerCase}(['"])`, 'g'), `$1${correctCase}$2`);
  });

  fs.writeFileSync(filePath, content);
  console.log(`Fixed type imports in ${file}`);
});

console.log('All type imports have been fixed!'); 