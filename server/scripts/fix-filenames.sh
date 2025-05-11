#!/bin/bash

# 进入项目根目录
cd "$(dirname "$0")/.."

# 函数：安全地重命名文件
safe_rename() {
    local source=$1
    local target=$2
    
    if [ -f "$source" ]; then
        echo "重命名: $source -> $target"
        mv "$source" "$source.tmp"
        mv "$source.tmp" "$target"
    else
        echo "警告: 文件不存在 $source"
    fi
}

# 修复 services 目录下的文件名
safe_rename "src/services/backtestService.ts" "src/services/BacktestService.ts"
safe_rename "src/services/healthService.ts" "src/services/HealthService.ts"
safe_rename "src/services/orderService.ts" "src/services/OrderService.ts"
safe_rename "src/services/userService.ts" "src/services/UserService.ts"
safe_rename "src/services/adminService.ts" "src/services/AdminService.ts"
safe_rename "src/services/authService.ts" "src/services/AuthService.ts"
safe_rename "src/services/commissionService.ts" "src/services/CommissionService.ts"
safe_rename "src/services/settlementService.ts" "src/services/SettlementService.ts"
safe_rename "src/services/strategyService.ts" "src/services/StrategyService.ts"
safe_rename "src/services/blacklistService.ts" "src/services/BlacklistService.ts"
safe_rename "src/services/strategyRatingService.ts" "src/services/StrategyRatingService.ts"
safe_rename "src/services/userLevelService.ts" "src/services/UserLevelService.ts"
safe_rename "src/services/withdrawalService.ts" "src/services/WithdrawalService.ts"

# 修复 controllers 目录下的文件名
safe_rename "src/controllers/adminController.ts" "src/controllers/AdminController.ts"
safe_rename "src/controllers/strategyController.ts" "src/controllers/StrategyController.ts"
safe_rename "src/controllers/authController.ts" "src/controllers/AuthController.ts"
safe_rename "src/controllers/blacklistController.ts" "src/controllers/BlacklistController.ts"
safe_rename "src/controllers/commissionController.ts" "src/controllers/CommissionController.ts"
safe_rename "src/controllers/settlementController.ts" "src/controllers/SettlementController.ts"
safe_rename "src/controllers/strategyRatingController.ts" "src/controllers/StrategyRatingController.ts"
safe_rename "src/controllers/userLevelController.ts" "src/controllers/UserLevelController.ts"
safe_rename "src/controllers/withdrawalController.ts" "src/controllers/WithdrawalController.ts"
safe_rename "src/controllers/healthController.ts" "src/controllers/HealthController.ts"
safe_rename "src/controllers/profitController.ts" "src/controllers/ProfitController.ts"
safe_rename "src/controllers/userController.ts" "src/controllers/UserController.ts"

# 修复 types 目录下的文件名
safe_rename "src/types/order.ts" "src/types/Order.ts"
safe_rename "src/types/settlement.ts" "src/types/Settlement.ts"
safe_rename "src/types/trading.ts" "src/types/Trading.ts"
safe_rename "src/types/withdrawal.ts" "src/types/Withdrawal.ts"
safe_rename "src/types/auth.ts" "src/types/Auth.ts"
safe_rename "src/types/commission.ts" "src/types/Commission.ts"
safe_rename "src/types/commissionWithdrawal.ts" "src/types/CommissionWithdrawal.ts"
safe_rename "src/types/health.ts" "src/types/Health.ts"
safe_rename "src/types/performance.ts" "src/types/Performance.ts"
safe_rename "src/types/strategy.ts" "src/types/Strategy.ts"
safe_rename "src/types/user.ts" "src/types/User.ts"
safe_rename "src/types/wallet.ts" "src/types/Wallet.ts"
safe_rename "src/types/enums.ts" "src/types/Enums.ts"
safe_rename "src/types/network.ts" "src/types/Network.ts"
safe_rename "src/types/position.ts" "src/types/Position.ts"
safe_rename "src/types/risk.ts" "src/types/Risk.ts"
safe_rename "src/types/strategyReview.ts" "src/types/StrategyReview.ts"
safe_rename "src/types/transaction.ts" "src/types/Transaction.ts"
safe_rename "src/types/alert.ts" "src/types/Alert.ts"
safe_rename "src/types/deposit.ts" "src/types/Deposit.ts"
safe_rename "src/types/exchange.ts" "src/types/Exchange.ts"
safe_rename "src/types/mt4.ts" "src/types/Mt4.ts"
safe_rename "src/types/backtest.ts" "src/types/Backtest.ts"
safe_rename "src/types/api.ts" "src/types/Api.ts"

# 修复 routes 目录下的文件名
safe_rename "src/routes/index.ts" "src/routes/Index.ts"
safe_rename "src/routes/authRoutes.ts" "src/routes/AuthRoutes.ts"
safe_rename "src/routes/blacklistRoutes.ts" "src/routes/BlacklistRoutes.ts"
safe_rename "src/routes/commissionRoutes.ts" "src/routes/CommissionRoutes.ts"
safe_rename "src/routes/health.ts" "src/routes/Health.ts"
safe_rename "src/routes/profitRoutes.ts" "src/routes/ProfitRoutes.ts"
safe_rename "src/routes/settlement.routes.ts" "src/routes/Settlement.routes.ts"
safe_rename "src/routes/strategyRoutes.ts" "src/routes/StrategyRoutes.ts"
safe_rename "src/routes/userLevelRoutes.ts" "src/routes/UserLevelRoutes.ts"
safe_rename "src/routes/userRoutes.ts" "src/routes/UserRoutes.ts"
safe_rename "src/routes/withdrawalRoutes.ts" "src/routes/WithdrawalRoutes.ts"

# 修复 validations 目录下的文件名
safe_rename "src/validations/common/index.ts" "src/validations/common/Index.ts"
safe_rename "src/validations/common/auth.ts" "src/validations/common/Auth.ts"
safe_rename "src/validations/common/request.ts" "src/validations/common/Request.ts"
safe_rename "src/validations/schemas/index.ts" "src/validations/schemas/Index.ts"
safe_rename "src/validations/schemas/strategy.ts" "src/validations/schemas/Strategy.ts"
safe_rename "src/validations/schemas/user.ts" "src/validations/schemas/User.ts"
safe_rename "src/validations/schemas/order.ts" "src/validations/schemas/Order.ts"

# 修复 middleware 目录下的文件名
safe_rename "src/middleware/auth.ts" "src/middleware/Auth.ts"
safe_rename "src/middleware/admin.ts" "src/middleware/Admin.ts"
safe_rename "src/middleware/adminMiddleware.ts" "src/middleware/AdminMiddleware.ts"
safe_rename "src/middleware/ensureAuthenticated.ts" "src/middleware/EnsureAuthenticated.ts"

echo "文件名大小写修复完成！" 