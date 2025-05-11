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

# 修复 types 目录下的文件名
mv src/types/order.ts src/types/order.ts.tmp
mv src/types/order.ts.tmp src/types/Order.ts

echo "文件名大小写修复完成！" 