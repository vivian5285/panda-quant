const fs = require('fs');
const path = require('path');

// 要处理的目录
const directories = [
    'src/controllers',
    'src/services',
    'src/types'
];

// 文件映射关系
const fileMappings = {
    // Controllers
    'admincontroller.ts': 'ADMINCONTROLLER.ts',
    'authcontroller.ts': 'AUTHCONTROLLER.ts',
    'blacklistcontroller.ts': 'BLACKLISTCONTROLLER.ts',
    'chainaddresscontroller.ts': 'CHAINADDRESSCONTROLLER.ts',
    'commissioncontroller.ts': 'COMMISSIONCONTROLLER.ts',
    'depositcontroller.ts': 'DEPOSITCONTROLLER.ts',
    'exchangeapicontroller.ts': 'EXCHANGEAPICONTROLLER.ts',
    'exchangeconfigcontroller.ts': 'EXCHANGECONFIGCONTROLLER.ts',
    'healthcontroller.ts': 'HEALTHCONTROLLER.ts',
    'profitcontroller.ts': 'PROFITCONTROLLER.ts',
    'settlementcontroller.ts': 'SETTLEMENTCONTROLLER.ts',
    'strategycontroller.ts': 'STRATEGYCONTROLLER.ts',
    'strategyratingcontroller.ts': 'STRATEGYRATINGCONTROLLER.ts',
    'usercontroller.ts': 'USERCONTROLLER.ts',
    'userlevelcontroller.ts': 'USERLEVELCONTROLLER.ts',
    'withdrawalcontroller.ts': 'WITHDRAWALCONTROLLER.ts',

    // Services
    'adminservice.ts': 'ADMINSERVICE.ts',
    'authservice.ts': 'AUTHSERVICE.ts',
    'backtestservice.ts': 'BACKTESTSERVICE.ts',
    'blacklistservice.ts': 'BLACKLISTSERVICE.ts',
    'commissionservice.ts': 'COMMISSIONSERVICE.ts',
    'healthservice.ts': 'HEALTHSERVICE.ts',
    'orderqueueservice.ts': 'ORDERQUEUESERVICE.ts',
    'orderservice.ts': 'ORDERSERVICE.ts',
    'profitservice.ts': 'PROFITSERVICE.ts',
    'redisservice.ts': 'REDISSERVICE.ts',
    'settlementservice.ts': 'SETTLEMENTSERVICE.ts',
    'strategyratingservice.ts': 'STRATEGYRATINGSERVICE.ts',
    'strategyservice.ts': 'STRATEGYSERVICE.ts',
    'userlevelservice.ts': 'USERLEVELSERVICE.ts',
    'userservice.ts': 'USERSERVICE.ts',
    'withdrawalservice.ts': 'WITHDRAWALSERVICE.ts',

    // Types
    'alert.ts': 'ALERT.TS',
    'api.ts': 'API.TS',
    'auth.ts': 'AUTH.TS',
    'backtest.ts': 'BACKTEST.TS',
    'blacklist.ts': 'BLACKLIST.TS',
    'commission.ts': 'COMMISSION.TS',
    'commissionrecord.ts': 'COMMISSIONRECORD.TS',
    'commissionwithdrawal.ts': 'COMMISSIONWITHDRAWAL.TS',
    'deposit.ts': 'DEPOSIT.TS',
    'depositnotification.ts': 'DEPOSITNOTIFICATION.TS',
    'enums.ts': 'ENUMS.TS',
    'exchange.ts': 'EXCHANGE.TS',
    'express.d.ts': 'EXPRESS.D.TS',
    'express.ts': 'EXPRESS.TS',
    'health.ts': 'HEALTH.TS',
    'imonitoring.ts': 'IMONITORING.TS',
    'index.ts': 'INDEX.TS',
    'mt4.ts': 'MT4.TS',
    'network.ts': 'NETWORK.TS',
    'order.ts': 'ORDER.TS',
    'performance.ts': 'PERFORMANCE.TS',
    'position.ts': 'POSITION.TS',
    'risk.ts': 'RISK.TS',
    'router.d.ts': 'ROUTER.D.TS',
    'settings.ts': 'SETTINGS.TS',
    'settlement.ts': 'SETTLEMENT.TS',
    'strategy.ts': 'STRATEGY.TS',
    'strategyperformance.ts': 'STRATEGYPERFORMANCE.TS',
    'strategyrating.ts': 'STRATEGYRATING.TS',
    'strategyreview.ts': 'STRATEGYREVIEW.TS',
    'trade.ts': 'TRADE.TS',
    'trading.ts': 'TRADING.TS',
    'transaction.ts': 'TRANSACTION.TS',
    'user.ts': 'USER.TS',
    'userlevel.ts': 'USERLEVEL.TS',
    'wallet.ts': 'WALLET.TS',
    'withdrawal.ts': 'WITHDRAWAL.TS'
};

// 创建反向映射
const reverseMappings = {};
Object.entries(fileMappings).forEach(([key, value]) => {
    reverseMappings[value.toLowerCase()] = value;
});

// 更新导入路径
function updateImportPaths(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    let updatedContent = content;

    // 更新相对路径导入
    Object.entries(fileMappings).forEach(([oldName, newName]) => {
        const oldNameWithoutExt = oldName.replace('.ts', '');
        const newNameWithoutExt = newName.replace('.ts', '');
        
        // 更新相对路径导入（包括 .ts 扩展名）
        const importRegex1 = new RegExp(`from ['"]\\.\\.?/([^'"]*?)(?:/|\\\\)${oldNameWithoutExt}\\.ts['"]`, 'g');
        updatedContent = updatedContent.replace(importRegex1, `from '../$1/${newNameWithoutExt}.ts'`);

        // 更新相对路径导入（不包括 .ts 扩展名）
        const importRegex2 = new RegExp(`from ['"]\\.\\.?/([^'"]*?)(?:/|\\\\)${oldNameWithoutExt}['"]`, 'g');
        updatedContent = updatedContent.replace(importRegex2, `from '../$1/${newNameWithoutExt}'`);
    });

    if (updatedContent !== content) {
        fs.writeFileSync(filePath, updatedContent, 'utf8');
        console.log(`Updated imports in: ${filePath}`);
    }
}

// 处理目录中的文件
function processDirectory(dir) {
    console.log(`\nProcessing directory: ${dir}`);
    const files = fs.readdirSync(dir);

    // 收集所有文件
    const fileGroups = {};
    files.forEach(file => {
        const lowerName = file.toLowerCase();
        if (!fileGroups[lowerName]) {
            fileGroups[lowerName] = [];
        }
        fileGroups[lowerName].push(file);
    });

    // 处理重复文件
    Object.entries(fileGroups).forEach(([lowerName, versions]) => {
        if (versions.length > 1) {
            console.log(`\nFound duplicate files for ${lowerName}:`);
            versions.forEach(version => console.log(`  - ${version}`));

            // 确定要保留的文件
            const targetName = reverseMappings[lowerName] || versions[0];
            const targetPath = path.join(dir, targetName);

            // 删除其他版本
            versions.forEach(version => {
                if (version !== targetName) {
                    const filePath = path.join(dir, version);
                    fs.unlinkSync(filePath);
                    console.log(`Deleted: ${version}`);
                }
            });
        }
    });

    // 更新所有 TypeScript 文件中的导入路径
    files.forEach(file => {
        if (file.endsWith('.ts')) {
            updateImportPaths(path.join(dir, file));
        }
    });
}

// 处理所有目录
directories.forEach(dir => {
    processDirectory(dir);
});

console.log('\nFile cleanup and import path updates completed!'); 