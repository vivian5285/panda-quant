#!/bin/bash

# 进入项目根目录
cd "$(dirname "$0")/.."

# 修复 services 目录下的文件名
mv src/services/backtestService.ts src/services/backtestService.ts.tmp
mv src/services/backtestService.ts.tmp src/services/BacktestService.ts

mv src/services/healthService.ts src/services/healthService.ts.tmp
mv src/services/healthService.ts.tmp src/services/HealthService.ts

mv src/services/orderService.ts src/services/orderService.ts.tmp
mv src/services/orderService.ts.tmp src/services/OrderService.ts

mv src/services/userService.ts src/services/userService.ts.tmp
mv src/services/userService.ts.tmp src/services/UserService.ts

mv src/services/adminService.ts src/services/adminService.ts.tmp
mv src/services/adminService.ts.tmp src/services/AdminService.ts

mv src/services/authService.ts src/services/authService.ts.tmp
mv src/services/authService.ts.tmp src/services/AuthService.ts

mv src/services/commissionService.ts src/services/commissionService.ts.tmp
mv src/services/commissionService.ts.tmp src/services/CommissionService.ts

mv src/services/settlementService.ts src/services/settlementService.ts.tmp
mv src/services/settlementService.ts.tmp src/services/SettlementService.ts

mv src/services/strategyService.ts src/services/strategyService.ts.tmp
mv src/services/strategyService.ts.tmp src/services/StrategyService.ts

# 修复 controllers 目录下的文件名
mv src/controllers/adminController.ts src/controllers/adminController.ts.tmp
mv src/controllers/adminController.ts.tmp src/controllers/AdminController.ts

mv src/controllers/strategyController.ts src/controllers/strategyController.ts.tmp
mv src/controllers/strategyController.ts.tmp src/controllers/StrategyController.ts

# 修复 types 目录下的文件名
mv src/types/order.ts src/types/order.ts.tmp
mv src/types/order.ts.tmp src/types/Order.ts

mv src/types/settlement.ts src/types/settlement.ts.tmp
mv src/types/settlement.ts.tmp src/types/Settlement.ts

mv src/types/trading.ts src/types/trading.ts.tmp
mv src/types/trading.ts.tmp src/types/Trading.ts

mv src/types/withdrawal.ts src/types/withdrawal.ts.tmp
mv src/types/withdrawal.ts.tmp src/types/Withdrawal.ts

mv src/types/auth.ts src/types/auth.ts.tmp
mv src/types/auth.ts.tmp src/types/Auth.ts

mv src/types/commission.ts src/types/commission.ts.tmp
mv src/types/commission.ts.tmp src/types/Commission.ts

mv src/types/commissionWithdrawal.ts src/types/commissionWithdrawal.ts.tmp
mv src/types/commissionWithdrawal.ts.tmp src/types/CommissionWithdrawal.ts

mv src/types/health.ts src/types/health.ts.tmp
mv src/types/health.ts.tmp src/types/Health.ts

mv src/types/performance.ts src/types/performance.ts.tmp
mv src/types/performance.ts.tmp src/types/Performance.ts

mv src/types/strategy.ts src/types/strategy.ts.tmp
mv src/types/strategy.ts.tmp src/types/Strategy.ts

mv src/types/user.ts src/types/user.ts.tmp
mv src/types/user.ts.tmp src/types/User.ts

mv src/types/wallet.ts src/types/wallet.ts.tmp
mv src/types/wallet.ts.tmp src/types/Wallet.ts

# 修复 routes 目录下的文件名
mv src/routes/index.ts src/routes/index.ts.tmp
mv src/routes/index.ts.tmp src/routes/Index.ts

# 修复 validations 目录下的文件名
mv src/validations/common/index.ts src/validations/common/index.ts.tmp
mv src/validations/common/index.ts.tmp src/validations/common/Index.ts

echo "文件名大小写修复完成！" 