import React from 'react';
import { Box, Container, Typography, List, ListItem, ListItemText } from '@mui/material';
import { GlobalBackground } from '@/components/common/GlobalBackground';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { GradientTitle } from '@/components/common/GradientTitle';
import { PandaCard } from '@/components/common/PandaCard';

const RiskPage: React.FC = () => {
  const riskPoints = [
    {
      title: '市场风险',
      description: '加密货币市场具有高度波动性，价格可能在短时间内发生剧烈变化。投资者应充分了解市场风险，并根据自身风险承受能力进行投资。',
    },
    {
      title: '技术风险',
      description: '量化交易依赖于技术系统和网络连接。系统故障、网络延迟或黑客攻击可能导致交易执行延迟或失败。',
    },
    {
      title: '策略风险',
      description: '量化交易策略的表现受多种因素影响，包括市场环境、参数设置等。历史表现不代表未来收益，投资者应谨慎评估策略风险。',
    },
    {
      title: '流动性风险',
      description: '在市场流动性不足的情况下，可能难以以期望的价格执行交易，导致滑点或无法及时平仓。',
    },
    {
      title: '监管风险',
      description: '加密货币和量化交易的监管环境不断变化，可能影响平台的运营和用户的交易活动。',
    },
  ];

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <GlobalBackground />
      <Navbar />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <GradientTitle
          title="风险提示"
          subtitle="投资有风险，入市需谨慎"
          sx={{ mb: 6 }}
        />
        
        <PandaCard>
          <Typography variant="h5" gutterBottom>
            重要提示
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            在开始使用熊猫量化平台之前，请仔细阅读并理解以下风险提示。量化交易涉及高风险，可能导致资金损失。我们建议您在充分了解相关风险后，根据自身情况谨慎决策。
          </Typography>

          <List>
            {riskPoints.map((point, index) => (
              <ListItem key={index} sx={{ display: 'block', mb: 3 }}>
                <Typography variant="h6" gutterBottom>
                  {point.title}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {point.description}
                </Typography>
              </ListItem>
            ))}
          </List>

          <Typography variant="body1" color="text.secondary" sx={{ mt: 4 }}>
            本风险提示不构成投资建议，投资者应自行承担投资风险。熊猫量化不对任何投资决策或结果负责。
          </Typography>
        </PandaCard>
      </Container>

      <Footer />
    </Box>
  );
};

export default RiskPage; 