import React from 'react';
import { Box, Container, Typography, List, ListItem } from '@mui/material';
import GlobalBackground from '@/components/common/GlobalBackground';
import Navbar from '@/components/common/Navbar';
import { GradientTitle } from '@/components/common/GradientTitle';
import PandaCard from '@/components/common/PandaCard';

const PrivacyPage: React.FC = () => {
  const privacyPoints = [
    {
      title: '信息收集',
      content: '我们收集的信息包括但不限于：注册信息、交易记录、设备信息、IP地址等。这些信息用于提供服务和改进用户体验。',
    },
    {
      title: '信息使用',
      content: '收集的信息用于：账户管理、交易处理、安全验证、客户服务、产品改进等。我们不会将您的信息用于未经授权的目的。',
    },
    {
      title: '信息保护',
      content: '我们采用行业标准的安全措施保护您的信息，包括加密传输、安全存储、访问控制等。',
    },
    {
      title: '信息共享',
      content: '我们不会在未经您同意的情况下与第三方共享您的个人信息，除非法律要求或保护我们的合法权益。',
    },
    {
      title: 'Cookie使用',
      content: '我们使用Cookie来改善用户体验、分析网站使用情况、提供个性化服务。您可以通过浏览器设置管理Cookie。',
    },
    {
      title: '用户权利',
      content: '您有权访问、更正、删除您的个人信息，以及撤回同意、投诉等。如需行使这些权利，请联系我们的客服。',
    },
  ];

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <GlobalBackground />
      <Navbar />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ mb: 6 }}>
          <GradientTitle>
            隐私政策
          </GradientTitle>
          <Typography variant="subtitle1" color="text.secondary" sx={{ mt: 1 }}>
            保护您的隐私是我们的首要任务
          </Typography>
        </Box>
        
        <PandaCard>
          <Box sx={{ p: 4 }}>
            <Typography variant="body1" paragraph>
              本隐私政策说明了我们如何收集、使用、存储和保护您的个人信息。请仔细阅读本政策，了解我们对您个人信息的处理方式。
            </Typography>
            
            <List>
              {privacyPoints.map((point, index) => (
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
    </Box>
  );
};

export default PrivacyPage; 