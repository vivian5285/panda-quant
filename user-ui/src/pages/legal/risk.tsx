import React from 'react';
import { Box, Container, Typography, List, ListItem, ListItemText } from '@mui/material';
import GlobalBackground from '@/components/common/GlobalBackground';
import Navbar from '@/components/common/Navbar';
import { GradientTitle } from '@/components/common/GradientTitle';
import PandaCard from '@/components/common/PandaCard';

const RiskPage: React.FC = () => {
  const riskPoints = [
    {
      title: '市场风险',
      description: '加密货币市场具有高度波动性，价格可能在短时间内发生剧烈变化。市场风险包括但不限于：价格波动、流动性风险、市场操纵等。投资者应充分了解市场风险，并根据自身风险承受能力进行投资。',
    },
    {
      title: '技术风险',
      description: '量化交易依赖于技术系统和网络连接。技术风险包括：系统故障、网络延迟、黑客攻击、数据泄露等。这些风险可能导致交易执行延迟、失败或资金损失。',
    },
    {
      title: '策略风险',
      description: '量化交易策略的表现受多种因素影响，包括市场环境、参数设置、数据质量等。历史表现不代表未来收益，策略可能因市场变化而失效。投资者应谨慎评估策略风险，定期监控策略表现。',
    },
    {
      title: '操作风险',
      description: '操作风险包括：参数设置错误、资金管理不当、过度交易等。这些风险可能导致不必要的损失。投资者应严格遵守交易纪律，合理控制仓位。',
    },
    {
      title: '监管风险',
      description: '加密货币和量化交易的监管环境不断变化，各国政策可能存在差异。监管变化可能影响平台的运营和用户的交易活动，甚至导致服务中断。',
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
    </Box>
  );
};

export default RiskPage; 