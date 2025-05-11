import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

const srcDir = path.join(__dirname, '../src');
const modelsDir = path.join(srcDir, 'models');

// 获取所有模型文件
const modelFiles = glob.sync('**/*.model.ts', { cwd: modelsDir });

// 创建模型文件映射
const modelMap = new Map(
  modelFiles.map(file => {
    const baseName = path.basename(file, '.model.ts');
    return [baseName.toLowerCase(), file];
  })
);

// 修复导入路径
function fixImportPaths(filePath: string) {
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // 修复模型导入
  const importRegex = /from ['"](\.\.\/)*models\/([^'"]+)['"]/g;
  content = content.replace(importRegex, (match, dots, importPath) => {
    const baseName = path.basename(importPath, '.model');
    const lowerBaseName = baseName.toLowerCase();
    
    if (modelMap.has(lowerBaseName)) {
      const correctPath = modelMap.get(lowerBaseName);
      modified = true;
      return `from '${dots || ''}models/${correctPath}'`;
    }
    return match;
  });

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed imports in: ${filePath}`);
  }
}

// 处理所有 TypeScript 文件
const files = glob.sync('**/*.ts', {
  cwd: srcDir,
  ignore: ['**/node_modules/**', '**/dist/**', '**/scripts/**']
});

files.forEach(file => {
  const filePath = path.join(srcDir, file);
  fixImportPaths(filePath);
}); 