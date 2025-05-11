#!/bin/bash

# 修复 types 目录下的文件名
mv src/types/Api.ts src/types/api.ts
mv src/types/Exchange.ts src/types/exchange.ts
mv src/types/Mt4.ts src/types/mt4.ts
mv src/types/Network.ts src/types/network.ts
mv src/types/Position.ts src/types/position.ts
mv src/types/Risk.ts src/types/risk.ts
mv src/types/StrategyReview.ts src/types/strategyReview.ts
mv src/types/Trade.ts src/types/trade.ts
mv src/types/Alert.ts src/types/alert.ts
mv src/types/Deposit.ts src/types/deposit.ts
mv src/types/Transaction.ts src/types/transaction.ts
mv src/types/CommissionWithdrawal.ts src/types/commissionWithdrawal.ts
mv src/types/Enums.ts src/types/enums.ts
mv src/types/User.ts src/types/user.ts
mv src/types/Performance.ts src/types/performance.ts
mv src/types/Express.ts src/types/express.ts
mv src/types/Strategy.ts src/types/strategy.ts
mv src/types/Auth.ts src/types/auth.ts
mv src/types/Commission.ts src/types/commission.ts
mv src/types/Withdrawal.ts src/types/withdrawal.ts
mv src/types/Health.ts src/types/health.ts
mv src/types/Backtest.ts src/types/backtest.ts
mv src/types/WALLET.ts src/types/wallet.ts

# 修复 controllers 目录下的文件名
mv src/controllers/AdminController.ts src/controllers/adminController.ts
mv src/controllers/AuthController.ts src/controllers/authController.ts
mv src/controllers/BlacklistController.ts src/controllers/blacklistController.ts
mv src/controllers/CommissionController.ts src/controllers/commissionController.ts
mv src/controllers/SettlementController.ts src/controllers/settlementController.ts
mv src/controllers/StrategyController.ts src/controllers/strategyController.ts
mv src/controllers/StrategyRatingController.ts src/controllers/strategyRatingController.ts
mv src/controllers/UserLevelController.ts src/controllers/userLevelController.ts
mv src/controllers/WithdrawalController.ts src/controllers/withdrawalController.ts
mv src/controllers/HealthController.ts src/controllers/healthController.ts
mv src/controllers/ProfitController.ts src/controllers/profitController.ts
mv src/controllers/UserController.ts src/controllers/userController.ts

# 修复 services 目录下的文件名
mv src/services/AdminService.ts src/services/adminService.ts
mv src/services/AuthService.ts src/services/authService.ts
mv src/services/BlacklistService.ts src/services/blacklistService.ts
mv src/services/CommissionService.ts src/services/commissionService.ts
mv src/services/SettlementService.ts src/services/settlementService.ts
mv src/services/StrategyService.ts src/services/strategyService.ts
mv src/services/StrategyRatingService.ts src/services/strategyRatingService.ts
mv src/services/UserLevelService.ts src/services/userLevelService.ts
mv src/services/WithdrawalService.ts src/services/withdrawalService.ts
mv src/services/HealthService.ts src/services/healthService.ts
mv src/services/BacktestService.ts src/services/backtestService.ts
mv src/services/STRATEGYSERVICE.ts src/services/strategyService.ts
mv src/services/SETTLEMENTSERVICE.ts src/services/settlementService.ts

# 修复 routes 目录下的文件名
mv src/routes/Index.ts src/routes/index.ts
mv src/routes/Health.ts src/routes/health.ts
mv src/routes/Admin.ts src/routes/admin.ts

# 修复 middleware 目录下的文件名
mv src/middleware/Auth.ts src/middleware/auth.ts
mv src/middleware/Admin.ts src/middleware/admin.ts

# 修复 validations 目录下的文件名
mv src/validations/schemas/Index.ts src/validations/schemas/index.ts
mv src/validations/schemas/Order.ts src/validations/schemas/order.ts
mv src/validations/schemas/Strategy.ts src/validations/schemas/strategy.ts
mv src/validations/schemas/User.ts src/validations/schemas/user.ts
mv src/validations/common/Auth.ts src/validations/common/auth.ts

# 更新所有导入语句
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/Api"/from "..\/types\/api"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/Exchange"/from "..\/types\/exchange"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/Mt4"/from "..\/types\/mt4"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/Network"/from "..\/types\/network"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/Position"/from "..\/types\/position"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/Risk"/from "..\/types\/risk"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/StrategyReview"/from "..\/types\/strategyReview"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/Trade"/from "..\/types\/trade"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/Alert"/from "..\/types\/alert"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/Deposit"/from "..\/types\/deposit"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/Transaction"/from "..\/types\/transaction"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/CommissionWithdrawal"/from "..\/types\/commissionWithdrawal"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/Enums"/from "..\/types\/enums"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/User"/from "..\/types\/user"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/Performance"/from "..\/types\/performance"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/Express"/from "..\/types\/express"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/Strategy"/from "..\/types\/strategy"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/Auth"/from "..\/types\/auth"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/Commission"/from "..\/types\/commission"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/Withdrawal"/from "..\/types\/withdrawal"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/Health"/from "..\/types\/health"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/Backtest"/from "..\/types\/backtest"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/types\/WALLET"/from "..\/types\/wallet"/g' {} +

# 更新其他导入路径
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/controllers\/AdminController"/from "..\/controllers\/adminController"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/controllers\/AuthController"/from "..\/controllers\/authController"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/controllers\/BlacklistController"/from "..\/controllers\/blacklistController"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/controllers\/CommissionController"/from "..\/controllers\/commissionController"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/controllers\/SettlementController"/from "..\/controllers\/settlementController"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/controllers\/StrategyController"/from "..\/controllers\/strategyController"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/controllers\/StrategyRatingController"/from "..\/controllers\/strategyRatingController"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/controllers\/UserLevelController"/from "..\/controllers\/userLevelController"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/controllers\/WithdrawalController"/from "..\/controllers\/withdrawalController"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/controllers\/HealthController"/from "..\/controllers\/healthController"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/controllers\/ProfitController"/from "..\/controllers\/profitController"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/controllers\/UserController"/from "..\/controllers\/userController"/g' {} +

find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/services\/AdminService"/from "..\/services\/adminService"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/services\/AuthService"/from "..\/services\/authService"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/services\/BlacklistService"/from "..\/services\/blacklistService"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/services\/CommissionService"/from "..\/services\/commissionService"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/services\/SettlementService"/from "..\/services\/settlementService"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/services\/StrategyService"/from "..\/services\/strategyService"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/services\/StrategyRatingService"/from "..\/services\/strategyRatingService"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/services\/UserLevelService"/from "..\/services\/userLevelService"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/services\/WithdrawalService"/from "..\/services\/withdrawalService"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/services\/HealthService"/from "..\/services\/healthService"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/services\/BacktestService"/from "..\/services\/backtestService"/g' {} +

find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/routes\/Index"/from "..\/routes\/index"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/routes\/Health"/from "..\/routes\/health"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/routes\/Admin"/from "..\/routes\/admin"/g' {} +

find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/middleware\/Auth"/from "..\/middleware\/auth"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/middleware\/Admin"/from "..\/middleware\/admin"/g' {} +

find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/validations\/schemas\/Index"/from "..\/validations\/schemas\/index"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/validations\/schemas\/Order"/from "..\/validations\/schemas\/order"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/validations\/schemas\/Strategy"/from "..\/validations\/schemas\/strategy"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/validations\/schemas\/User"/from "..\/validations\/schemas\/user"/g' {} +
find src -type f -name "*.ts" -exec sed -i 's/from "\.\.\/validations\/common\/Auth"/from "..\/validations\/common\/auth"/g' {} + 