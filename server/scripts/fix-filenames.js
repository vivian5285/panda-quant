const fs = require('fs');
const path = require('path');

const directories = [
  'src/controllers',
  'src/services',
  'src/types'
];

const fileMappings = {
  // Controllers
  'authController.ts': 'AuthController.ts',
  'blacklistController.ts': 'BlacklistController.ts',
  'commissionController.ts': 'CommissionController.ts',
  'healthController.ts': 'HealthController.ts',
  'profitController.ts': 'ProfitController.ts',
  'settlementController.ts': 'SettlementController.ts',
  'strategyRatingController.ts': 'StrategyRatingController.ts',
  'userController.ts': 'UserController.ts',
  'userLevelController.ts': 'UserLevelController.ts',
  'withdrawalController.ts': 'WithdrawalController.ts',

  // Services
  'authService.ts': 'AuthService.ts',
  'blacklistService.ts': 'BlacklistService.ts',
  'commissionService.ts': 'CommissionService.ts',
  'profitService.ts': 'ProfitService.ts',
  'strategyRatingService.ts': 'StrategyRatingService.ts',
  'userLevelService.ts': 'UserLevelService.ts',
  'withdrawalService.ts': 'WithdrawalService.ts',

  // Types
  'alert.ts': 'Alert.ts',
  'api.ts': 'Api.ts',
  'auth.ts': 'Auth.ts',
  'backtest.ts': 'Backtest.ts',
  'commission.ts': 'Commission.ts',
  'commissionRecord.ts': 'CommissionRecord.ts',
  'commissionWithdrawal.ts': 'CommissionWithdrawal.ts',
  'deposit.ts': 'Deposit.ts',
  'depositNotification.ts': 'DepositNotification.ts',
  'enums.ts': 'Enums.ts',
  'exchange.ts': 'Exchange.ts',
  'health.ts': 'Health.ts',
  'index.ts': 'Index.ts',
  'mt4.ts': 'Mt4.ts',
  'network.ts': 'Network.ts',
  'order.ts': 'Order.ts',
  'performance.ts': 'Performance.ts',
  'position.ts': 'Position.ts',
  'risk.ts': 'Risk.ts',
  'router.d.ts': 'Router.d.ts',
  'settings.ts': 'Settings.ts',
  'strategy.ts': 'Strategy.ts',
  'strategyPerformance.ts': 'StrategyPerformance.ts',
  'strategyReview.ts': 'StrategyReview.ts',
  'trade.ts': 'Trade.ts',
  'transaction.ts': 'Transaction.ts',
  'user.ts': 'User.ts',
  'userLevel.ts': 'UserLevel.ts',
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