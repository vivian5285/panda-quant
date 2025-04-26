import React from 'react';
import { Box, Container, Typography, Grid, Button } from '@mui/material';
import { GlobalBackground } from '@/components/common/GlobalBackground';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { GradientTitle } from '@/components/common/GradientTitle';
import { PandaCard } from '@/components/common/PandaCard';

const ResourcesPage: React.FC = () => {
  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <GlobalBackground />
      <Navbar />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <GradientTitle
          title="资源中心"
          subtitle="获取量化交易的学习资料和工具"
          sx={{ mb: 6 }}
        />
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <PandaCard>
              <Typography variant="h5" gutterBottom>
                学习资料
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                丰富的量化交易学习资料，包括入门指南、策略教程和案例分析。
              </Typography>
              <Button variant="contained" color="primary">
                查看资料
              </Button>
            </PandaCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <PandaCard>
              <Typography variant="h5" gutterBottom>
                视频教程
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                专业的视频教程，帮助您快速掌握量化交易的核心概念和操作技巧。
              </Typography>
              <Button variant="contained" color="primary">
                观看视频
              </Button>
            </PandaCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <PandaCard>
              <Typography variant="h5" gutterBottom>
                社区论坛
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                加入我们的社区，与其他量化交易爱好者交流经验，分享心得。
              </Typography>
              <Button variant="contained" color="primary">
                加入社区
              </Button>
            </PandaCard>
          </Grid>

          <Grid item xs={12} md={6}>
            <PandaCard>
              <Typography variant="h5" gutterBottom>
                工具下载
              </Typography>
              <Typography variant="body1" color="text.secondary" gutterBottom>
                获取我们提供的各种量化交易工具和插件，提升您的交易效率。
              </Typography>
              <Button variant="contained" color="primary">
                下载工具
              </Button>
            </PandaCard>
          </Grid>
        </Grid>
      </Container>

      <Footer />
    </Box>
  );
};

export default ResourcesPage; 