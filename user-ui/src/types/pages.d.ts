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

declare module '../pages/HomePage' {
  import { FC } from 'react';
  const HomePage: FC;
  export default HomePage;
}

declare module '../pages/about/team' {
  import { FC } from 'react';
  const TeamPage: FC;
  export default TeamPage;
}

declare module '../pages/about/news' {
  import { FC } from 'react';
  const NewsPage: FC;
  export default NewsPage;
}

declare module '../pages/about/contact' {
  import { FC } from 'react';
  const ContactPage: FC;
  export default ContactPage;
}

declare module '../pages/about/partners' {
  import { FC } from 'react';
  const PartnersPage: FC;
  export default PartnersPage;
}

declare module '../pages/legal/risk' {
  import { FC } from 'react';
  const RiskPage: FC;
  export default RiskPage;
}

declare module '../pages/legal/disclaimer' {
  import { FC } from 'react';
  const DisclaimerPage: FC;
  export default DisclaimerPage;
}

declare module '../pages/legal/privacy' {
  import { FC } from 'react';
  const PrivacyPage: FC;
  export default PrivacyPage;
}

declare module '../pages/resources/blog' {
  import { FC } from 'react';
  const BlogPage: FC;
  export default BlogPage;
}

declare module '../pages/resources/community' {
  import { FC } from 'react';
  const CommunityPage: FC;
  export default CommunityPage;
}

declare module '../pages/resources/help' {
  import { FC } from 'react';
  const HelpPage: FC;
  export default HelpPage;
}

declare module '../pages/product' {
  import { FC } from 'react';
  const ProductPage: FC;
  export default ProductPage;
} 