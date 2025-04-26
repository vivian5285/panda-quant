import React from 'react';
import { Box, Container, Typography, List, ListItem } from '@mui/material';
import GlobalBackground from '@/components/common/GlobalBackground';
import Navbar from '@/components/common/Navbar';
import { GradientTitle } from '@/components/common/GradientTitle';
import PandaCard from '@/components/common/PandaCard';

const DisclaimerPage: React.FC = () => {
  const disclaimerPoints = [
    {
      title: '平台服务',
      content: '熊猫量化平台提供的所有服务均按"现状"提供，不提供任何形式的明示或暗示的保证。平台不对服务的及时性、安全性、准确性或可靠性做出任何保证。',
    },
    {
      title: '用户责任',
      content: '用户应自行承担使用平台服务的所有风险。用户应确保其使用平台服务的行为符合相关法律法规，并对其账户下的所有操作负责。',
    },
    {
      title: '知识产权',
      content: '平台上的所有内容，包括但不限于文字、图片、图表、数据、软件等，均受知识产权法保护。未经授权，不得复制、传播或用于商业目的。',
    },
    {
      title: '第三方服务',
      content: '平台可能包含指向第三方网站或服务的链接。这些链接仅供参考，熊猫量化不对第三方网站或服务的内容、准确性或可用性负责。',
    },
    {
      title: '服务中断',
      content: '平台可能因系统维护、升级或其他原因暂时中断服务。对于因服务中断导致的任何损失，熊猫量化不承担责任。',
    },
    {
      title: '责任限制',
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
            如果您对本免责声明有任何疑问，请联系我们的客服团队。
          </Typography>
        </PandaCard>
      </Container>
    </Box>
  );
};

export default DisclaimerPage; 