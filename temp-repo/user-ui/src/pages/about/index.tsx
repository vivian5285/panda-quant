import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { GlobalBackground } from '@/components/common/GlobalBackground';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { GradientTitle } from '@/components/common/GradientTitle';
import { PandaCard } from '@/components/common/PandaCard';

const AboutPage: React.FC = () => {
  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <GlobalBackground />
      <Navbar />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <GradientTitle
          title="关于我们"
          subtitle="了解熊猫量化的故事和使命"
          sx={{ mb: 6 }}
        />
        
        <Box sx={{ display: 'grid', gap: 4 }}>
          <PandaCard>
            <Typography variant="h5" gutterBottom>
              我们的使命
            </Typography>
            <Typography variant="body1" color="text.secondary">
              熊猫量化致力于为投资者提供最先进的量化交易解决方案，通过人工智能和大数据技术，帮助用户实现更智能、更高效的投资决策。
            </Typography>
          </PandaCard>

          <PandaCard>
            <Typography variant="h5" gutterBottom>
              我们的团队
            </Typography>
            <Typography variant="body1" color="text.secondary">
              我们拥有一支由金融专家、数据科学家和软件工程师组成的专业团队，共同致力于打造最优质的量化交易平台。
            </Typography>
          </PandaCard>

          <PandaCard>
            <Typography variant="h5" gutterBottom>
              我们的愿景
            </Typography>
            <Typography variant="body1" color="text.secondary">
              成为全球领先的量化交易平台，让每个人都能享受到专业级的量化交易服务。
            </Typography>
          </PandaCard>
        </Box>
      </Container>

      <Footer />
    </Box>
  );
};

export default AboutPage; 