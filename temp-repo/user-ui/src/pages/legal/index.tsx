import React from 'react';
import { Box, Container, Typography } from '@mui/material';
import { GlobalBackground } from '@/components/common/GlobalBackground';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { GradientTitle } from '@/components/common/GradientTitle';
import { PandaCard } from '@/components/common/PandaCard';

const LegalPage: React.FC = () => {
  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <GlobalBackground />
      <Navbar />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <GradientTitle
          title="法律声明"
          subtitle="了解我们的服务条款和隐私政策"
          sx={{ mb: 6 }}
        />
        
        <Box sx={{ display: 'grid', gap: 4 }}>
          <PandaCard>
            <Typography variant="h5" gutterBottom>
              服务条款
            </Typography>
            <Typography variant="body1" color="text.secondary">
              本服务条款规定了您使用熊猫量化平台的条件。通过使用我们的服务，您同意遵守这些条款。我们保留随时修改这些条款的权利。
            </Typography>
          </PandaCard>

          <PandaCard>
            <Typography variant="h5" gutterBottom>
              隐私政策
            </Typography>
            <Typography variant="body1" color="text.secondary">
              我们非常重视您的隐私。本隐私政策说明了我们如何收集、使用和保护您的个人信息。我们承诺保护您的数据安全。
            </Typography>
          </PandaCard>

          <PandaCard>
            <Typography variant="h5" gutterBottom>
              风险提示
            </Typography>
            <Typography variant="body1" color="text.secondary">
              量化交易存在风险，过去的业绩不代表未来的表现。投资前请仔细阅读相关风险提示，并根据自身情况做出投资决策。
            </Typography>
          </PandaCard>
        </Box>
      </Container>

      <Footer />
    </Box>
  );
};

export default LegalPage; 