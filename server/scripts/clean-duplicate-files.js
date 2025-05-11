const fs = require('fs');
const path = require('path');

const directories = [
  'src/controllers',
  'src/services',
  'src/types'
];

function findAndRemoveDuplicates(dir) {
  const fullPath = path.join(process.cwd(), dir);
  const files = fs.readdirSync(fullPath);
  const fileMap = new Map();

  // 首先收集所有文件
  files.forEach(file => {
    const lowerFile = file.toLowerCase();
    if (!fileMap.has(lowerFile)) {
      fileMap.set(lowerFile, []);
    }
    fileMap.get(lowerFile).push(file);
  });

  // 检查并删除重复文件
  fileMap.forEach((files, lowerName) => {
    if (files.length > 1) {
      console.log(`\nFound duplicate files for ${lowerName}:`);
      files.forEach(file => console.log(`  - ${file}`));

      // 保留 PascalCase 版本，删除其他版本
      const pascalCaseFile = files.find(f => f[0] === f[0].toUpperCase());
      if (pascalCaseFile) {
        files.forEach(file => {
          if (file !== pascalCaseFile) {
            const filePath = path.join(fullPath, file);
            try {
              fs.unlinkSync(filePath);
              console.log(`Deleted: ${file}`);
            } catch (error) {
              console.error(`Error deleting ${file}:`, error);
            }
          }
        });
      } else {
        console.log(`Warning: No PascalCase version found for ${lowerName}`);
      }
    }
  });
}

// 执行清理
directories.forEach(dir => {
  console.log(`\nProcessing directory: ${dir}`);
  findAndRemoveDuplicates(dir);
}); 