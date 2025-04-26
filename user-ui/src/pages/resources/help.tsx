import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Accordion, AccordionSummary, AccordionDetails } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { GradientTitle } from '@/components/common/GradientTitle';
import PandaCard from '@/components/common/PandaCard';

const HelpPage: React.FC = () => {
  const faqs = [
    {
      question: '如何开始使用量化交易？',
      answer: '首先需要注册账号并完成实名认证，然后选择适合的交易策略，设置参数后即可开始交易。'
    },
    {
      question: '支持哪些交易所？',
      answer: '目前支持币安、OKX、Gate、Bitget等主流交易所，未来会支持更多交易所。'
    },
    {
      question: '如何选择交易策略？',
      answer: '我们提供多种交易策略，您可以根据自己的风险偏好和投资目标选择合适的策略。'
    },
    {
      question: '如何设置交易参数？',
      answer: '每个策略都有详细的参数说明，您可以根据自己的需求调整参数。'
    },
    {
      question: '如何查看交易记录？',
      answer: '在个人中心可以查看所有的交易记录，包括交易时间、交易对、交易方向、交易价格等信息。'
    },
    {
      question: '如何提现？',
      answer: '在个人中心的钱包页面可以进行提现操作，提现需要完成实名认证。'
    }
  ];

  const categories = [
    {
      title: '入门指南',
      description: '了解量化交易的基本概念和操作流程',
      icon: '📚'
    },
    {
      title: '交易策略',
      description: '学习各种交易策略的原理和使用方法',
      icon: '📊'
    },
    {
      title: '风险管理',
      description: '掌握风险控制的方法和技巧',
      icon: '🛡️'
    },
    {
      title: '常见问题',
      description: '解答用户常见的问题和疑惑',
      icon: '❓'
    }
  ];

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <GradientTitle
          title="帮助中心"
          subtitle="常见问题与使用指南"
          sx={{ mb: 6 }}
        />

        <Grid container spacing={4} sx={{ mb: 8 }}>
          {categories.map((category, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <PandaCard>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Typography variant="h3" sx={{ mb: 2 }}>
                      {category.icon}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      {category.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {category.description}
                    </Typography>
                  </CardContent>
                </Card>
              </PandaCard>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h5" sx={{ mb: 4 }}>
          常见问题
        </Typography>
        
        <Box sx={{ mb: 8 }}>
          {faqs.map((faq, index) => (
            <Accordion key={index} sx={{ mb: 2 }}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{
                  bgcolor: 'background.paper',
                  '&:hover': {
                    bgcolor: 'action.hover',
                  },
                }}
              >
                <Typography variant="subtitle1">
                  {faq.question}
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography variant="body2" color="text.secondary">
                  {faq.answer}
                </Typography>
              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Container>
    </Box>
  );
};

export default HelpPage; 