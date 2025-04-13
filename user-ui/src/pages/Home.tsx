import React from 'react';
import { Box, Container, useTheme, useMediaQuery } from '@mui/material';
import { motion } from 'framer-motion';
import Header from '../components/Header';
import Banner from '../components/home/Banner';
import AiAdvantage from '../components/home/AiAdvantage';
import TeamIntro from '../components/home/TeamIntro';
import MarketSection from '../components/home/MarketSection';
import HostingIntro from '../components/home/HostingIntro';
import StrategyShowcase from '../components/home/StrategyShowcase';
import InviteSystem from '../components/home/InviteSystem';
import ExchangePartners from '../components/home/ExchangePartners';
import Footer from '../components/Footer';

const Home: React.FC = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(135deg, #1a2f1a 0%, #0d1a0d 100%)'
          : '#ffffff',
        color: theme.palette.mode === 'dark' ? '#ffffff' : '#000000',
      }}
    >
      <Header />
      <motion.div
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <Container maxWidth="lg">
          <motion.div variants={itemVariants}>
            <Banner />
          </motion.div>
          
          <Box sx={{ my: isMobile ? 2 : 4 }}>
            <motion.div variants={itemVariants}>
              <AiAdvantage />
            </motion.div>
          </Box>
          
          <Box sx={{ my: isMobile ? 2 : 4 }}>
            <motion.div variants={itemVariants}>
              <TeamIntro />
            </motion.div>
          </Box>
          
          <Box sx={{ my: isMobile ? 2 : 4 }}>
            <motion.div variants={itemVariants}>
              <MarketSection />
            </motion.div>
          </Box>
          
          <Box sx={{ my: isMobile ? 2 : 4 }}>
            <motion.div variants={itemVariants}>
              <HostingIntro />
            </motion.div>
          </Box>
          
          <Box sx={{ my: isMobile ? 2 : 4 }}>
            <motion.div variants={itemVariants}>
              <StrategyShowcase />
            </motion.div>
          </Box>
          
          <Box sx={{ my: isMobile ? 2 : 4 }}>
            <motion.div variants={itemVariants}>
              <InviteSystem />
            </motion.div>
          </Box>
          
          <Box sx={{ my: isMobile ? 2 : 4 }}>
            <motion.div variants={itemVariants}>
              <ExchangePartners />
            </motion.div>
          </Box>
        </Container>
      </motion.div>
      <Footer />
    </Box>
  );
};

export default Home; 