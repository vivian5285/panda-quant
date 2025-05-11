import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

// 需要检查的目录
const directories = [
  'src/controllers',
  'src/routes',
  'src/services',
  'src/models',
  'src/types',
  'src/middleware',
  'src/clients',
  'src/engine'
];

// 获取所有 TypeScript 文件
function getAllFiles(): string[] {
  return directories.flatMap(dir => 
    glob.sync(`${dir}/**/*.ts`, { ignore: ['**/node_modules/**', '**/dist/**'] })
  );
}

// 修复导入路径
function fixImportPaths(filePath: string): boolean {
  const content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;
  
  // 修复 ../types/../services/XXX 为 ../services/XXX
  let newContent = content.replace(
    /from ['"]\.\.\/types\/\.\.\/(services|controllers)\/([^'"]+)['"]/g,
    (match, type, name) => `from '../${type}/${name}'`
  );

  // 修复导入路径中的大小写问题
  const importRegex = /from ['"]([^'"]+)['"]/g;
  newContent = newContent.replace(importRegex, (match, importPath) => {
    if (importPath.startsWith('.')) {
      const dir = path.dirname(filePath);
      const fullPath = path.resolve(dir, importPath);
      const ext = path.extname(fullPath);
      const dirPath = path.dirname(fullPath);
      const baseName = path.basename(fullPath, ext);
      
      // 检查文件是否存在
      if (fs.existsSync(fullPath)) {
        return match;
      }
      
      // 尝试查找正确大小写的文件
      const files = fs.readdirSync(dirPath);
      const correctFile = files.find(f => 
        f.toLowerCase() === (baseName + ext).toLowerCase()
      );
      
      if (correctFile) {
        const relativePath = path.relative(
          dir,
          path.join(dirPath, correctFile)
        ).replace(/\\/g, '/');
        modified = true;
        return `from '${relativePath}'`;
      }
    }
    return match;
  });

  if (newContent !== content) {
    fs.writeFileSync(filePath, newContent, 'utf-8');
    modified = true;
  }

  return modified;
}

// 主函数
async function main() {
  console.log('开始修复导入路径和文件名大小写问题...');
  
  const files = getAllFiles();
  let modifiedCount = 0;
  
  for (const file of files) {
    if (fixImportPaths(file)) {
      console.log(`修复文件: ${file}`);
      modifiedCount++;
    }
  }
  
  console.log(`\n修复完成，共修复 ${modifiedCount} 个文件。`);
}

main().catch(console.error); 