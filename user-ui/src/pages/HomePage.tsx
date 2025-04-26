import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';
import {
  HeroSection,
  PandaCharacter,
  CoreAdvantages,
  FeaturesSection,
  StrategySection,
  ProfitSection,
  HowItWorks,
  SecuritySection,
  UserReviews,
  InviteSection,
  SupportSection
} from '../components/home';

const HomePage: React.FC = () => {
  return (
    <Box
      component={motion.div}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      sx={{
        width: '100%',
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* 首页顶部展示区域 */}
      <HeroSection />
      
      {/* 熊猫角色展示 */}
      <PandaCharacter />
      
      {/* 核心优势展示 */}
      <CoreAdvantages />
      
      {/* 功能特点展示 */}
      <FeaturesSection />
      
      {/* 策略展示 */}
      <StrategySection />
      
      {/* 收益展示 */}
      <ProfitSection />
      
      {/* 工作原理说明 */}
      <HowItWorks />
      
      {/* 安全特性展示 */}
      <SecuritySection />
      
      {/* 用户评价展示 */}
      <UserReviews />
      
      {/* 邀请功能展示 */}
      <InviteSection />
      
      {/* 支持服务展示 */}
      <SupportSection />
    </Box>
  );
};

export default HomePage; 