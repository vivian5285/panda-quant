const fs = require('fs');
const path = require('path');
const { promisify } = require('util');
const readFileAsync = promisify(fs.readFile);
const writeFileAsync = promisify(fs.writeFile);

const rootDir = path.join(__dirname, 'src');
const typesDir = path.join(rootDir, 'types');
const modelsDir = path.join(rootDir, 'models');
const controllersDir = path.join(rootDir, 'controllers');
const routesDir = path.join(rootDir, 'routes');
const middlewareDir = path.join(rootDir, 'middleware');
const servicesDir = path.join(rootDir, 'services');

// 定义文件名映射
const fileMappings = {
  // types 目录
  'strategy.ts': 'Strategy.ts',
  'commission.ts': 'Commission.ts',
  'alert.ts': 'Alert.ts',
  'deposit.ts': 'Deposit.ts',
  'notification.ts': 'Notification.ts',
  'transaction.ts': 'Transaction.ts',
  'withdrawal.ts': 'Withdrawal.ts',
  'strategyReview.ts': 'StrategyReview.ts',
  'trade.ts': 'Trade.ts',
  'wallet.ts': 'Wallet.ts',
  'position.ts': 'Position.ts',
  'backtest.ts': 'Backtest.ts',
  'performance.ts': 'Performance.ts',
  'trading.ts': 'Trading.ts',
  'enums.ts': 'Enums.ts',
  'risk.ts': 'Risk.ts',
  'network.ts': 'Network.ts',
  'settlement.ts': 'Settlement.ts',
  'user.ts': 'User.ts',
  'auth.ts': 'Auth.ts',
  'blacklist.ts': 'Blacklist.ts',
  'userLevel.ts': 'UserLevel.ts',
  'commissionWithdrawal.ts': 'CommissionWithdrawal.ts',
  'strategyRating.ts': 'StrategyRating.ts',
  'api.ts': 'Api.ts',
  'exchange.ts': 'Exchange.ts',
  'mt4.ts': 'Mt4.ts',
  'express.d.ts': 'Express.d.ts',
  'index.ts': 'Index.ts',
  
  // models 目录
  'backtest.ts': 'Backtest.ts',
  'commission.ts': 'Commission.ts',
  'commissionRule.ts': 'CommissionRule.ts',
  
  // controllers 目录
  'strategy.ts': 'Strategy.ts',
  'user.ts': 'User.ts',
  
  // routes 目录
  'strategy.ts': 'Strategy.ts',
  'settlement.ts': 'Settlement.ts',
  
  // middleware 目录
  'auth.ts': 'Auth.ts',
  
  // services 目录
  'backtestService.ts': 'BacktestService.ts',
  'commissionService.ts': 'CommissionService.ts',
  'orderService.ts': 'OrderService.ts'
};

// 获取所有 .ts 文件
async function getAllTsFiles(dir) {
  const files = [];
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...await getAllTsFiles(fullPath));
    } else if (item.endsWith('.ts')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

// 重命名文件
async function renameFiles() {
  const dirs = [typesDir, modelsDir, controllersDir, routesDir, middlewareDir, servicesDir];
  
  for (const dir of dirs) {
    if (!fs.existsSync(dir)) continue;
    
    for (const [oldName, newName] of Object.entries(fileMappings)) {
      const oldPath = path.join(dir, oldName);
      const newPath = path.join(dir, newName);
      
      if (fs.existsSync(oldPath)) {
        try {
          fs.renameSync(oldPath, newPath);
          console.log(`Renamed ${oldPath} to ${newPath}`);
        } catch (error) {
          console.error(`Error renaming ${oldPath}:`, error);
        }
      }
    }
  }
}

// 更新导入语句
async function updateImports(filePath) {
  const content = await readFileAsync(filePath, 'utf8');
  let updated = content;
  
  // 匹配所有导入语句
  const importRegex = /from ['"]([^'"]+)['"]/g;
  let match;
  
  while ((match = importRegex.exec(content)) !== null) {
    const importPath = match[1];
    if (importPath.startsWith('.')) {
      const parts = importPath.split('/');
      const lastPart = parts[parts.length - 1];
      
      // 检查是否需要更新大小写
      const oldName = lastPart.toLowerCase() + '.ts';
      if (fileMappings[oldName]) {
        const newLastPart = fileMappings[oldName].slice(0, -3);
        parts[parts.length - 1] = newLastPart;
        const newImportPath = parts.join('/');
        updated = updated.replace(
          `from '${importPath}'`,
          `from '${newImportPath}'`
        );
      }
    }
  }
  
  if (updated !== content) {
    await writeFileAsync(filePath, updated);
    console.log(`Updated imports in ${filePath}`);
  }
}

async function main() {
  // 首先重命名所有文件
  await renameFiles();
  
  // 然后更新所有文件中的导入语句
  const files = await getAllTsFiles(rootDir);
  for (const file of files) {
    await updateImports(file);
  }
}

main().catch(console.error);

function fixExpressImports(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  
  // 检查是否已经包含正确的导入
  if (content.includes("import type { Router } from 'express';")) {
    return;
  }

  // 替换导入语句
  const newContent = content.replace(
    /import express from 'express';/g,
    `import express from 'express';\nimport type { Router } from 'express';`
  );

  // 替换 Router 类型声明
  const finalContent = newContent.replace(
    /const router = express\.Router\(\);?/g,
    'const router: Router = express.Router();'
  );

  fs.writeFileSync(filePath, finalContent);
  console.log(`Fixed imports in ${filePath}`);
}

// 遍历 routes 目录下的所有 .ts 文件
fs.readdirSync(routesDir).forEach(file => {
  if (file.endsWith('.ts')) {
    fixExpressImports(path.join(routesDir, file));
  }
}); 