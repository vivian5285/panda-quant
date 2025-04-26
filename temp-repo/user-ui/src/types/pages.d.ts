declare module '@/pages/StrategyList' {
  import { FC } from 'react';
  const StrategyList: FC;
  export default StrategyList;
}

declare module '@/pages/StrategyDetail' {
  import { FC } from 'react';
  const StrategyDetail: FC;
  export default StrategyDetail;
}

declare module '@/pages/BacktestConfig' {
  import { FC } from 'react';
  const BacktestConfig: FC;
  export default BacktestConfig;
}

declare module '@/pages/BacktestResults' {
  import { FC } from 'react';
  import { StrategyStats } from './strategy';
  
  interface BacktestResultsProps {
    result: StrategyStats;
  }
  
  const BacktestResults: FC<BacktestResultsProps>;
  export default BacktestResults;
}

declare module '@/pages/PortfolioManager' {
  import { FC } from 'react';
  const PortfolioManager: FC;
  export default PortfolioManager;
}

declare module '@/pages/StrategyOptimizer' {
  import { FC } from 'react';
  const StrategyOptimizer: FC;
  export default StrategyOptimizer;
}

declare module '@/pages/ReferralLink' {
  import { FC } from 'react';
  const ReferralLink: FC;
  export default ReferralLink;
}

declare module '@/pages/NotFound' {
  import { FC } from 'react';
  const NotFound: FC;
  export default NotFound;
}

declare module '@/pages/Home' {
  import { FC } from 'react';
  const Home: FC;
  export default Home;
}

declare module '@/pages/Login' {
  import { FC } from 'react';
  const Login: FC;
  export default Login;
}

declare module '@/pages/Register' {
  import { FC } from 'react';
  const Register: FC;
  export default Register;
}

declare module '@/pages/Dashboard' {
  import { FC } from 'react';
  const Dashboard: FC;
  export default Dashboard;
} 