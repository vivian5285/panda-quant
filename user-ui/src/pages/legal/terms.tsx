import React from 'react';
import { Box, Container, Typography, List, ListItem } from '@mui/material';
import { GradientTitle } from '@/components/common/GradientTitle';
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
      title: '风险提示',
      content: '量化交易存在风险，过往业绩不代表未来表现。用户应充分了解风险，审慎决策。',
    },
    {
      title: '知识产权',
      content: '平台所有内容，包括但不限于文字、图片、软件、策略等，均受知识产权法保护。',
    },
  ];

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <GradientTitle 
          title="服务条款" 
          variant="h2" 
          align="center" 
          sx={{ mb: 6 }}
        >
          服务条款
        </GradientTitle>
        <PandaCard>
          <Box sx={{ p: 4 }}>
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
          </Box>
        </PandaCard>
      </Container>
    </Box>
  );
};

export default TermsPage; 