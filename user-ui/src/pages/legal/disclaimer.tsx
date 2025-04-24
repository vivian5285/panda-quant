import React from 'react';
import { Box, Container, Typography, List, ListItem } from '@mui/material';
import { GlobalBackground } from '@/components/common/GlobalBackground';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { GradientTitle } from '@/components/common/GradientTitle';
import { PandaCard } from '@/components/common/PandaCard';

const DisclaimerPage: React.FC = () => {
  const disclaimerPoints = [
    {
      title: '信息准确性',
      content: '熊猫量化平台提供的所有信息仅供参考，不构成投资建议。我们尽力确保信息的准确性，但不保证所有信息的完整性和及时性。',
    },
    {
      title: '投资风险',
      content: '量化交易涉及高风险，可能导致资金损失。投资者应充分了解相关风险，并根据自身情况谨慎决策。熊猫量化不对任何投资决策或结果负责。',
    },
    {
      title: '第三方链接',
      content: '平台可能包含指向第三方网站的链接。这些链接仅供参考，熊猫量化不对第三方网站的内容、准确性或可用性负责。',
    },
    {
      title: '服务可用性',
      content: '我们尽力确保平台的稳定运行，但不保证服务不会中断或出现错误。对于因服务中断或错误导致的任何损失，熊猫量化不承担责任。',
    },
    {
      title: '知识产权',
      content: '平台上的所有内容，包括但不限于文字、图片、图表、数据等，均受知识产权法保护。未经授权，不得复制、传播或用于商业目的。',
    },
    {
      title: '免责范围',
      content: '在法律允许的最大范围内，熊猫量化不对因使用平台服务导致的任何直接、间接、偶然、特殊或后果性损失承担责任。',
    },
  ];

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <GlobalBackground />
      <Navbar />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <GradientTitle
          title="免责声明"
          subtitle="请仔细阅读以下内容"
          sx={{ mb: 6 }}
        />
        
        <PandaCard>
          <Typography variant="h5" gutterBottom>
            重要提示
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            在使用熊猫量化平台之前，请仔细阅读并理解本免责声明。继续使用本平台即表示您同意接受本免责声明的所有条款。
          </Typography>

          <List>
            {disclaimerPoints.map((point, index) => (
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

          <Typography variant="body1" color="text.secondary" sx={{ mt: 4 }}>
            本免责声明可能会不时更新，请定期查看。如果您对本免责声明有任何疑问，请联系我们的客服团队。
          </Typography>
        </PandaCard>
      </Container>

      <Footer />
    </Box>
  );
};

export default DisclaimerPage; 