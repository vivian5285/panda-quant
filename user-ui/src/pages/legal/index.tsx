import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import GlobalBackground from '@/components/common/GlobalBackground';
import { GradientTitle } from '@/components/common/GradientTitle';
import PandaCard from '@/components/common/PandaCard';

const LegalPage: React.FC = () => {
  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <GlobalBackground />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <GradientTitle
          title="法律声明"
          subtitle="了解我们的服务条款和隐私政策"
          sx={{ mb: 6 }}
        />
        
        <PandaCard>
          <Box sx={{ p: 4 }}>
            <Typography variant="h5" gutterBottom>
              服务条款
            </Typography>
            <Typography variant="body1" paragraph>
              使用我们的服务前，请仔细阅读服务条款。这些条款规定了您使用我们服务的权利和义务。
            </Typography>
            <Typography variant="h5" gutterBottom>
              隐私政策
            </Typography>
            <Typography variant="body1" paragraph>
              我们重视您的隐私，我们的隐私政策说明了我们如何收集、使用和保护您的个人信息。
            </Typography>
          </Box>
        </PandaCard>
      </Container>
    </Box>
  );
};

export default LegalPage; 