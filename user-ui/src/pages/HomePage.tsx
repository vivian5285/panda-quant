import React from 'react';
import { Box } from '@mui/material';
import { motion, Variants } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { themeUtils } from '../theme';
import HeroSection from '../components/home/HeroSection';
import PandaCharacter from '../components/home/PandaCharacter';
import CoreAdvantages from '../components/home/CoreAdvantages';
import StrategySection from '../components/home/StrategySection';
import ProfitSection from '../components/home/ProfitSection';
import SecuritySection from '../components/home/SecuritySection';
import InviteSection from '../components/home/InviteSection';
import SupportSection from '../components/home/SupportSection';
import UserReviews from '../components/home/UserReviews';
import HowItWorks from '../components/home/HowItWorks';

const fadeIn: Variants = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

const HomePage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Box
      component={motion.div}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={fadeIn}
      sx={{
        minHeight: '100vh',
        background: themeUtils.createGradient('background.default', 'background.paper'),
        overflow: 'hidden',
      }}
    >
      <HeroSection />
      <PandaCharacter />
      <CoreAdvantages />
      <StrategySection />
      <ProfitSection />
      <SecuritySection />
      <InviteSection />
      <SupportSection />
      <UserReviews />
      <HowItWorks />
    </Box>
  );
};

export default HomePage; 