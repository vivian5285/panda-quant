import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import GlobalBackground from '@/components/common/GlobalBackground';
import { GradientTitle } from '@/components/common/GradientTitle';
import PandaCard from '@/components/common/PandaCard';
import Footer from '@/components/home/Footer';

const AboutPage: React.FC = () => {
  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <GlobalBackground />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <GradientTitle
          title="关于我们"
          subtitle="了解熊猫量化的故事和使命"
          sx={{ mb: 6 }}
        />
        
        <PandaCard>
          <Box sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              我们的故事
            </Typography>
            <Typography variant="body1" paragraph>
              熊猫量化成立于2023年，是一家专注于AI量化交易的科技公司。我们的团队由来自顶级金融机构和科技公司的专业人士组成，拥有丰富的量化交易和人工智能经验。
            </Typography>
            <Typography variant="body1" paragraph>
              我们的使命是通过人工智能技术，让量化交易变得更加简单、高效和可靠。我们相信，通过技术创新，每个人都能享受到量化交易带来的收益。
            </Typography>
          </Box>
        </PandaCard>
      </Container>
      <Footer />
    </Box>
  );
};

export default AboutPage; 