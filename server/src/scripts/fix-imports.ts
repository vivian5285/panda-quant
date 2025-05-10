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

// 修复导入路径
function fixImports(filePath: string) {
    let content = fs.readFileSync(filePath, 'utf8');
    let modified = false;

    // 修复相对路径导入
    for (const [typeName, correctName] of Object.entries(typeFiles)) {
        const patterns = [
            new RegExp(`from ['"]\\.\\.?/types/${typeName}['"]`, 'g'),
            new RegExp(`from ['"]\\.\\.?/types/${typeName.toLowerCase()}['"]`, 'g'),
            new RegExp(`from ['"]\\.\\.?/types/${typeName.toUpperCase()}['"]`, 'g')
        ];

        for (const pattern of patterns) {
            const newContent = content.replace(pattern, `from '../types/${correctName}'`);
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

// 处理所有文件
files.forEach(fixImports);

console.log('Import paths have been fixed.'); 