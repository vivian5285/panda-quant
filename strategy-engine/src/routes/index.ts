import { Router } from 'express';
import AuthRoutes from './AuthRoutes';
import UserRoutes from './UserRoutes';
import StrategyRoutes from './StrategyRoutes';
import CommissionRoutes from './CommissionRoutes';
import WithdrawalRoutes from './WithdrawalRoutes';
import SettlementRoutes from './Settlement.routes';
import HealthRoutes from './Health';
import AdminRoutes from './Admin';
import BlacklistRoutes from './BlacklistRoutes';
import UserLevelRoutes from './UserLevelRoutes';
import ProfitRoutes from './ProfitRoutes';

const router = Router();

// 健康检查
router.use('/health', HealthRoutes);

// 认证相关
router.use('/auth', AuthRoutes);

// 用户相关
router.use('/users', UserRoutes);

// 策略相关
router.use('/strategies', StrategyRoutes);

// 佣金相关
router.use('/commissions', CommissionRoutes);

// 提现相关
router.use('/withdrawals', WithdrawalRoutes);

// 结算相关
router.use('/settlements', SettlementRoutes);

// 管理员相关
router.use('/admin', AdminRoutes);

// 黑名单相关
router.use('/blacklist', BlacklistRoutes);

// 用户等级相关
router.use('/user-levels', UserLevelRoutes);

// 收益相关
router.use('/profits', ProfitRoutes);

export default router; 