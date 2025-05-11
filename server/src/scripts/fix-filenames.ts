import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

// 获取所有 TypeScript 文件
const files = glob.sync('src/**/*.{ts,tsx}', {
    ignore: ['src/scripts/**', 'node_modules/**', 'dist/**']
});

// 类型文件映射
const typeFiles = {
    'Api': 'Api',
    'Auth': 'Auth',
    'Enums': 'Enums',
    'Exchange': 'Exchange',
    'Mt4': 'Mt4',
    'Network': 'Network',
    'Strategy': 'Strategy',
    'User': 'User',
    'Commission': 'Commission',
    'CommissionWithdrawal': 'CommissionWithdrawal',
    'Position': 'Position',
    'Risk': 'Risk',
    'StrategyReview': 'StrategyReview',
    'Health': 'Health',
    'Performance': 'Performance',
    'Alert': 'Alert',
    'Deposit': 'Deposit',
    'Transaction': 'Transaction',
    'Wallet': 'Wallet',
    'Withdrawal': 'Withdrawal',
    'Blacklist': 'Blacklist',
    'Backtest': 'Backtest',
    'Order': 'Order',
    'Settlement': 'Settlement',
    'Trading': 'Trading',
    'Trade': 'Trade',
    'UserLevel': 'UserLevel',
    'StrategyRating': 'StrategyRating',
    'StrategyPerformance': 'StrategyPerformance',
    'Settings': 'Settings',
    'Notification': 'Notification',
    'DepositNotification': 'DepositNotification',
    'CommissionRecord': 'CommissionRecord'
};

// 控制器文件映射
const controllerFiles = {
    'AuthController': 'AuthController',
    'BlacklistController': 'BlacklistController',
    'CommissionController': 'CommissionController',
    'HealthController': 'HealthController',
    'ProfitController': 'ProfitController',
    'SettlementController': 'SettlementController',
    'StrategyController': 'StrategyController',
    'StrategyRatingController': 'StrategyRatingController',
    'UserController': 'UserController',
    'UserLevelController': 'UserLevelController',
    'WithdrawalController': 'WithdrawalController'
};

// 服务文件映射
const serviceFiles = {
    'AuthService': 'AuthService',
    'BlacklistService': 'BlacklistService',
    'CommissionService': 'CommissionService',
    'StrategyRatingService': 'StrategyRatingService',
    'UserLevelService': 'UserLevelService',
    'WithdrawalService': 'WithdrawalService',
    'SettlementService': 'SettlementService',
    'OrderQueueService': 'OrderQueueService'
};

// 收集需要重命名的文件
function collectFilesToRename() {
    const filesToRename = [];

    // 收集类型文件
    for (const [typeName, correctName] of Object.entries(typeFiles)) {
        const typeDir = path.join('src', 'types');
        const possibleFiles = [
            path.join(typeDir, `${typeName}.ts`),
            path.join(typeDir, `${typeName.toLowerCase()}.ts`),
            path.join(typeDir, `${typeName.toUpperCase()}.ts`)
        ];

        for (const file of possibleFiles) {
            if (fs.existsSync(file) && path.basename(file, '.ts') !== correctName) {
                const newPath = path.join(typeDir, `${correctName}.ts`);
                filesToRename.push({ oldPath: file, newPath });
            }
        }
    }

    // 收集控制器文件
    for (const [controllerName, correctName] of Object.entries(controllerFiles)) {
        const controllerDir = path.join('src', 'controllers');
        const possibleFiles = [
            path.join(controllerDir, `${controllerName}.ts`),
            path.join(controllerDir, `${controllerName.toLowerCase()}.ts`),
            path.join(controllerDir, `${controllerName.toUpperCase()}.ts`)
        ];

        for (const file of possibleFiles) {
            if (fs.existsSync(file) && path.basename(file, '.ts') !== correctName) {
                const newPath = path.join(controllerDir, `${correctName}.ts`);
                filesToRename.push({ oldPath: file, newPath });
            }
        }
    }

    // 收集服务文件
    for (const [serviceName, correctName] of Object.entries(serviceFiles)) {
        const serviceDir = path.join('src', 'services');
        const possibleFiles = [
            path.join(serviceDir, `${serviceName}.ts`),
            path.join(serviceDir, `${serviceName.toLowerCase()}.ts`),
            path.join(serviceDir, `${serviceName.toUpperCase()}.ts`),
            path.join(serviceDir, `${serviceName.toLowerCase()}.service.ts`)
        ];

        for (const file of possibleFiles) {
            if (fs.existsSync(file) && path.basename(file, '.ts') !== correctName) {
                const newPath = path.join(serviceDir, `${correctName}.ts`);
                filesToRename.push({ oldPath: file, newPath });
            }
        }
    }

    return filesToRename;
}

// 修复导入路径
function fixImports(filePath: string) {
    if (!fs.existsSync(filePath)) {
        console.log(`Skipping non-existent file: ${filePath}`);
        return;
    }

    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 计算相对路径
    const fileDir = path.dirname(filePath);
    const relativePath = path.relative(fileDir, path.join('src', 'types')).replace(/\\/g, '/');

    // 修复类型导入
    for (const [typeName, correctName] of Object.entries(typeFiles)) {
        const patterns = [
            new RegExp(`from ['"]\\.\\.?/types/${typeName}['"]`, 'g'),
            new RegExp(`from ['"]\\.\\.?/types/${typeName.toLowerCase()}['"]`, 'g'),
            new RegExp(`from ['"]\\.\\.?/types/${typeName.toUpperCase()}['"]`, 'g')
        ];

        for (const pattern of patterns) {
            const newContent = content.replace(pattern, `from '${relativePath}/${correctName}'`);
            if (newContent !== content) {
                content = newContent;
                modified = true;
            }
        }
    }

    // 修复控制器导入
    for (const [controllerName, correctName] of Object.entries(controllerFiles)) {
        const patterns = [
            new RegExp(`from ['"]\\.\\.?/controllers/${controllerName}['"]`, 'g'),
            new RegExp(`from ['"]\\.\\.?/controllers/${controllerName.toLowerCase()}['"]`, 'g'),
            new RegExp(`from ['"]\\.\\.?/controllers/${controllerName.toUpperCase()}['"]`, 'g')
        ];

        for (const pattern of patterns) {
            const newContent = content.replace(pattern, `from '${relativePath}/../controllers/${correctName}'`);
            if (newContent !== content) {
                content = newContent;
                modified = true;
            }
        }
    }

    // 修复服务导入
    for (const [serviceName, correctName] of Object.entries(serviceFiles)) {
        const patterns = [
            new RegExp(`from ['"]\\.\\.?/services/${serviceName}['"]`, 'g'),
            new RegExp(`from ['"]\\.\\.?/services/${serviceName.toLowerCase()}['"]`, 'g'),
            new RegExp(`from ['"]\\.\\.?/services/${serviceName.toUpperCase()}['"]`, 'g')
        ];

        for (const pattern of patterns) {
            const newContent = content.replace(pattern, `from '${relativePath}/../services/${correctName}'`);
            if (newContent !== content) {
                content = newContent;
                modified = true;
            }
        }
    }

    if (modified) {
        console.log(`Fixing imports in ${filePath}`);
        fs.writeFileSync(filePath, content, 'utf8');
    }
}

// 执行修复
console.log('Collecting files to rename...');
const filesToRename = collectFilesToRename();

console.log('Renaming files...');
for (const { oldPath, newPath } of filesToRename) {
    console.log(`Renaming ${oldPath} to ${newPath}`);
    try {
        fs.renameSync(oldPath, newPath);
    } catch (error) {
        console.error(`Error renaming ${oldPath}:`, error);
    }
}

console.log('Fixing imports...');
// 重新获取文件列表，因为文件名已经改变
const updatedFiles = glob.sync('src/**/*.{ts,tsx}', {
    ignore: ['src/scripts/**', 'node_modules/**', 'dist/**']
});
updatedFiles.forEach(fixImports);

console.log('All fixes completed.'); 