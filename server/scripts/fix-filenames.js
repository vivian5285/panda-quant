const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 定义文件名映射
const fileMappings = {
    // Controllers
    'admincontroller.ts': 'AdminController.ts',
    'chainaddresscontroller.ts': 'ChainAddressController.ts',
    'depositcontroller.ts': 'DepositController.ts',
    'exchangeapicontroller.ts': 'ExchangeAPIController.ts',
    'exchangeconfigcontroller.ts': 'ExchangeConfigController.ts',
    'strategycontroller.ts': 'StrategyController.ts',
    'authcontroller.ts': 'AuthController.ts',
    'blacklistcontroller.ts': 'BlacklistController.ts',
    'commissioncontroller.ts': 'CommissionController.ts',
    'healthcontroller.ts': 'HealthController.ts',
    'profitcontroller.ts': 'ProfitController.ts',
    'settlementcontroller.ts': 'SettlementController.ts',
    'strategyratingcontroller.ts': 'StrategyRatingController.ts',
    'usercontroller.ts': 'UserController.ts',
    'userlevelcontroller.ts': 'UserLevelController.ts',
    'withdrawalcontroller.ts': 'WithdrawalController.ts',

    // Services
    'backtestservice.ts': 'BacktestService.ts',
    'healthservice.ts': 'HealthService.ts',
    'orderqueueservice.ts': 'OrderQueueService.ts',
    'orderservice.ts': 'OrderService.ts',
    'redisservice.ts': 'RedisService.ts',
    'userservice.ts': 'UserService.ts',
    'authservice.ts': 'AuthService.ts',
    'blacklistservice.ts': 'BlacklistService.ts',
    'commissionservice.ts': 'CommissionService.ts',
    'profitservice.ts': 'ProfitService.ts',
    'strategyratingservice.ts': 'StrategyRatingService.ts',
    'userlevelservice.ts': 'UserLevelService.ts',
    'withdrawalservice.ts': 'WithdrawalService.ts',

    // Types
    'depositnotification.ts': 'DepositNotification.ts',
    'imonitoring.ts': 'IMonitoring.ts',
    'order.ts': 'Order.ts',
    'settings.ts': 'Settings.ts',
    'strategyrating.ts': 'StrategyRating.ts',
    'strategyreview.ts': 'StrategyReview.ts',
    'userlevel.ts': 'UserLevel.ts',
    'commissionwithdrawal.ts': 'CommissionWithdrawal.ts',
    'commissionrecord.ts': 'CommissionRecord.ts',
    'strategyperformance.ts': 'StrategyPerformance.ts',
    'router.d.ts': 'Router.d.ts',
    'express.d.ts': 'Express.d.ts',
    'express.ts': 'Express.ts',
    'auth.ts': 'Auth.ts',
    'api.ts': 'Api.ts',
    'alert.ts': 'Alert.ts',
    'backtest.ts': 'Backtest.ts',
    'blacklist.ts': 'Blacklist.ts',
    'commission.ts': 'Commission.ts',
    'deposit.ts': 'Deposit.ts',
    'enums.ts': 'Enums.ts',
    'exchange.ts': 'Exchange.ts',
    'health.ts': 'Health.ts',
    'index.ts': 'Index.ts',
    'mt4.ts': 'Mt4.ts',
    'network.ts': 'Network.ts',
    'performance.ts': 'Performance.ts',
    'position.ts': 'Position.ts',
    'risk.ts': 'Risk.ts',
    'settlement.ts': 'Settlement.ts',
    'strategy.ts': 'Strategy.ts',
    'trade.ts': 'Trade.ts',
    'trading.ts': 'Trading.ts',
    'transaction.ts': 'Transaction.ts',
    'user.ts': 'User.ts',
    'withdrawal.ts': 'Withdrawal.ts',

    // Clients
    'api.ts': 'Api.ts',
    
    // Validations
    'common/index.ts': 'common/Index.ts',
    'schemas/index.ts': 'schemas/Index.ts'
};

// 创建一个临时目录
const tempDir = path.join(__dirname, '..', 'temp_rename');
if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
}

function fixFilenames(directory) {
    const files = fs.readdirSync(directory);
    
    files.forEach(file => {
        const fullPath = path.join(directory, file);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
            fixFilenames(fullPath);
        } else if (file.endsWith('.ts')) {
            const relativePath = path.relative(path.join(__dirname, '..'), fullPath);
            const newName = fileMappings[relativePath.toLowerCase()] || file;
            
            if (newName !== file) {
                const newPath = path.join(path.dirname(fullPath), newName);
                console.log(`Renaming ${fullPath} to ${newPath}`);
                
                try {
                    // 复制到临时目录
                    const tempPath = path.join(tempDir, newName);
                    fs.copyFileSync(fullPath, tempPath);
                    // 删除原文件
                    fs.unlinkSync(fullPath);
                    // 从临时目录复制回来
                    fs.copyFileSync(tempPath, newPath);
                    // 删除临时文件
                    fs.unlinkSync(tempPath);
                } catch (error) {
                    console.error(`Error renaming ${fullPath}:`, error);
                }
            }
        }
    });
}

// 修复所有目录
const directories = [
    'src/controllers',
    'src/services',
    'src/types',
    'src/models',
    'src/routes',
    'src/middleware',
    'src/validations',
    'src/utils',
    'src/clients',
    'src/engine'
];

directories.forEach(dir => {
    const fullPath = path.join(__dirname, '..', dir);
    if (fs.existsSync(fullPath)) {
        console.log(`\nProcessing directory: ${dir}`);
        fixFilenames(fullPath);
    }
});

// 清理临时目录
if (fs.existsSync(tempDir)) {
    fs.rmdirSync(tempDir);
}

console.log('\nFile name fixing completed!'); 