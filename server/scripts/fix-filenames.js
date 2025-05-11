const fs = require('fs');
const path = require('path');

const directories = [
  'src/controllers',
  'src/services',
  'src/types'
];

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
  'alert.ts': 'Alert.ts',
  'api.ts': 'Api.ts',
  'auth.ts': 'Auth.ts',
  'backtest.ts': 'Backtest.ts',
  'commission.ts': 'Commission.ts',
  'commissionrecord.ts': 'CommissionRecord.ts',
  'commissionwithdrawal.ts': 'CommissionWithdrawal.ts',
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
  'router.d.ts': 'Router.d.ts',
  'strategy.ts': 'Strategy.ts',
  'strategyperformance.ts': 'StrategyPerformance.ts',
  'strategyreview.ts': 'StrategyReview.ts',
  'trade.ts': 'Trade.ts',
  'transaction.ts': 'Transaction.ts',
  'user.ts': 'User.ts',
  'userlevel.ts': 'UserLevel.ts',
  'withdrawal.ts': 'Withdrawal.ts'
};

function renameFiles(dir) {
  const fullPath = path.join(process.cwd(), dir);
  const files = fs.readdirSync(fullPath);

  files.forEach(file => {
    const oldPath = path.join(fullPath, file);
    const newName = fileMappings[file.toLowerCase()];
    
    if (newName && file !== newName) {
      const newPath = path.join(fullPath, newName);
      try {
        // 如果目标文件已存在，先删除它
        if (fs.existsSync(newPath)) {
          fs.unlinkSync(newPath);
          console.log(`Deleted existing file: ${newName}`);
        }
        fs.renameSync(oldPath, newPath);
        console.log(`Renamed: ${file} -> ${newName}`);
      } catch (error) {
        console.error(`Error renaming ${file}:`, error);
      }
    }
  });
}

// Execute the renaming
directories.forEach(dir => {
  console.log(`\nProcessing directory: ${dir}`);
  renameFiles(dir);
}); 