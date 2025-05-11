import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

const projectRoot = path.resolve(__dirname, '../..');
const targetDir = path.resolve(__dirname, '../src/models');

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

const files = glob.sync('**/*.model.ts', {
  cwd: projectRoot,
  ignore: ['node_modules/**', 'dist/**', 'server/src/models/**']
});

files.forEach(relPath => {
  const absPath = path.join(projectRoot, relPath);
  const baseName = path.basename(relPath);
  // 首字母大写
  const newName = baseName.charAt(0).toUpperCase() + baseName.slice(1);
  const targetPath = path.join(targetDir, newName);
  fs.copyFileSync(absPath, targetPath);
  console.log(`Copied: ${relPath} -> src/models/${newName}`);
}); 