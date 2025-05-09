import * as fs from 'fs';
import * as path from 'path';

async function fixServiceImports() {
  const servicesDir = path.join(__dirname, '../src/services');
  const files = fs.readdirSync(servicesDir);

  for (const file of files) {
    if (!file.endsWith('.ts')) continue;

    const filePath = path.join(servicesDir, file);
    let content = fs.readFileSync(filePath, 'utf-8');

    // 修复模型导入路径
    content = content.replace(
      /from ['"]\.\.\/models\/([A-Z][a-zA-Z]+)['"]/g,
      (match, modelName) => {
        const modelFileName = modelName.charAt(0).toLowerCase() + modelName.slice(1) + '.model';
        return `from '../models/${modelFileName}'`;
      }
    );

    // 修复默认导入
    content = content.replace(
      /import ([A-Z][a-zA-Z]+) from ['"]\.\.\/models\/([a-z-]+)['"]/g,
      (match, modelName, modelPath) => {
        return `import ${modelName} from '../models/${modelPath}.model'`;
      }
    );

    // 修复命名导入
    content = content.replace(
      /import { ([A-Z][a-zA-Z]+) } from ['"]\.\.\/models\/([a-z-]+)['"]/g,
      (match, modelName, modelPath) => {
        return `import { ${modelName} } from '../models/${modelPath}.model'`;
      }
    );

    // 修复类型导入
    content = content.replace(
      /import type { ([A-Z][a-zA-Z]+) } from ['"]\.\.\/models\/([a-z-]+)['"]/g,
      (match, typeName, modelPath) => {
        return `import type { ${typeName} } from '../models/${modelPath}.model'`;
      }
    );

    fs.writeFileSync(filePath, content);
    console.log(`Fixed ${file}`);
  }
}

fixServiceImports().catch(console.error); 