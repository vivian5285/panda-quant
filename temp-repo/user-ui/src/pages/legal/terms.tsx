import React from 'react';
import { Box, Container, Typography, List, ListItem } from '@mui/material';
import GlobalBackground from '@/components/common/GlobalBackground';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import GradientTitle from '@/components/common/GradientTitle';
import PandaCard from '@/components/common/PandaCard';

const TermsPage: React.FC = () => {
  const termsPoints = [
    {
      title: '服务说明',
      content: '本平台提供量化交易策略服务，包括但不限于策略订阅、回测、实盘交易等功能。用户需遵守相关法律法规和平台规则。',
    },
    {
      title: '用户资格',
      content: '用户必须年满18周岁，具有完全民事行为能力，并保证提供的信息真实、准确、完整。',
    },
    {
      title: '账户安全',
      content: '用户应妥善保管账户信息，对账户下的所有操作负责。如发现账户异常，应立即通知平台。',
    },
    {
      title: '服务使用',
      content: '用户应合法使用平台服务，不得从事任何违法、违规或损害平台利益的行为。',
    },
    {
      title: '知识产权',
      content: '平台的所有内容，包括但不限于文字、图片、软件、策略等，均受知识产权法保护。',
    },
    {
      title: '免责声明',
      content: '平台不对用户使用服务的结果承担责任，用户应自行承担投资风险。',
    },
  ];

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <GlobalBackground />
      <Navbar />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ mb: 6 }}>
          <GradientTitle>
            服务条款
          </GradientTitle>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
            使用我们的服务前，请仔细阅读以下条款
          </Typography>
        </Box>
        
        <PandaCard>
          <Box sx={{ p: 4 }}>
            <Typography variant="body1" paragraph>
              欢迎使用我们的服务。本服务条款是您与平台之间的法律协议，请在使用服务前仔细阅读。
            </Typography>
            
            <List>
              {termsPoints.map((point, index) => (
                <ListItem key={index} sx={{ display: 'block', mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    {point.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {point.content}
                  </Typography>
                </ListItem>
              ))}
            </List>
            
            <Typography variant="body1" sx={{ mt: 4 }}>
              最后更新日期：2024年3月20日
            </Typography>
          </Box>
        </PandaCard>
      </Container>

      <Footer />
    </Box>
  );
};

export default TermsPage; 