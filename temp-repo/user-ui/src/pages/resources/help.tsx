import React, { useState } from 'react';
import { Box, Container, Typography, Grid, Accordion, AccordionSummary, AccordionDetails, TextField, InputAdornment, Stepper, Step, StepLabel, Paper } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import { GlobalBackground } from '@/components/common/GlobalBackground';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { GradientTitle } from '@/components/common/GradientTitle';
import { PandaCard } from '@/components/common/PandaCard';

const HelpPage: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  const usageSteps = [
    {
      title: '注册账户',
      description: '完成邮箱验证和身份认证',
      details: [
        '访问官网并点击注册按钮',
        '填写邮箱、密码等基本信息',
        '完成邮箱验证',
        '进行身份认证'
      ]
    },
    {
      title: '选择策略',
      description: '根据风险偏好选择适合的策略',
      details: [
        '查看策略介绍和收益表现',
        '了解策略的风险等级',
        '选择符合自己风险偏好的策略',
        '查看策略的详细参数'
      ]
    },
    {
      title: '设置参数',
      description: '自定义交易参数和风险控制',
      details: [
        '设置交易金额',
        '配置止损止盈',
        '调整风险参数',
        '设置交易时间'
      ]
    },
    {
      title: '开始交易',
      description: '启动自动交易系统',
      details: [
        '确认参数设置',
        '启动策略',
        '监控交易状态',
        '查看收益情况'
      ]
    }
  ];

  const faqCategories = [
    {
      title: '账户管理',
      questions: [
        {
          question: '如何注册账户？',
          answer: '点击首页右上角的"注册"按钮，填写邮箱、密码等信息，完成验证后即可注册成功。',
        },
        {
          question: '如何修改密码？',
          answer: '登录后进入"账户设置"，点击"安全设置"，选择"修改密码"，按照提示操作即可。',
        },
        {
          question: '如何开启双重认证？',
          answer: '在"账户设置"的"安全设置"中，找到"双重认证"选项，按照提示绑定Google Authenticator即可。',
        },
      ],
    },
    {
      title: '充值提现',
      questions: [
        {
          question: '支持哪些充值方式？',
          answer: '目前支持USDT（TRC20/ERC20）、BTC、ETH等主流加密货币充值。',
        },
        {
          question: '提现需要多长时间？',
          answer: '提现审核通常在1-2个工作日内完成，具体到账时间取决于区块链网络状况。',
        },
        {
          question: '充值提现是否有手续费？',
          answer: '充值免费，提现收取少量手续费，具体费率请查看费率说明。',
        },
      ],
    },
    {
      title: '策略使用',
      questions: [
        {
          question: '如何选择适合自己的策略？',
          answer: '平台提供多种策略，您可以根据风险偏好、投资期限等因素选择。建议先使用模拟交易测试。',
        },
        {
          question: '策略收益如何计算？',
          answer: '策略收益按日计算，包含交易收益和分红收益，具体计算公式请查看收益说明。',
        },
        {
          question: '如何调整策略参数？',
          answer: '在策略详情页面，点击"参数设置"，可以根据市场情况调整策略参数。',
        },
      ],
    },
    {
      title: '常见问题',
      questions: [
        {
          question: '平台是否安全？',
          answer: '我们采用多重安全措施，包括SSL加密、双重认证、冷热钱包分离等，确保用户资产安全。',
        },
        {
          question: '如何联系客服？',
          answer: '您可以通过在线客服、邮件（support@pandaquant.com）或Telegram（@pandaquant）联系我们。',
        },
        {
          question: '是否有移动端应用？',
          answer: '目前支持网页版和移动端网页，APP正在开发中，敬请期待。',
        },
      ],
    },
  ];

  const filteredCategories = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(q => 
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    ),
  })).filter(category => category.questions.length > 0);

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <GlobalBackground />
      <Navbar />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <GradientTitle
          title="帮助中心"
          subtitle="常见问题解答"
          sx={{ mb: 6 }}
        />
        
        <PandaCard sx={{ mb: 4 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="搜索问题..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#00FFB8' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(0, 255, 184, 0.5)',
                },
                '&:hover fieldset': {
                  borderColor: '#00FFB8',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#00FFB8',
                },
              },
            }}
          />
        </PandaCard>

        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" gutterBottom align="center">
            使用流程
          </Typography>
          <Stepper orientation="vertical" sx={{ mt: 4 }}>
            {usageSteps.map((step, index) => (
              <Step key={index} active={true}>
                <StepLabel>
                  <Typography variant="h6">{step.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {step.description}
                  </Typography>
                  <Box sx={{ mt: 1, ml: 4 }}>
                    {step.details.map((detail, idx) => (
                      <Typography key={idx} variant="body2" sx={{ mb: 1 }}>
                        • {detail}
                      </Typography>
                    ))}
                  </Box>
                </StepLabel>
              </Step>
            ))}
          </Stepper>
        </Box>

        <Grid container spacing={4}>
          {filteredCategories.map((category, index) => (
            <Grid item xs={12} key={index}>
              <PandaCard>
                <Typography variant="h6" sx={{ mb: 2, color: '#00FFB8' }}>
                  {category.title}
                </Typography>
                {category.questions.map((faq, idx) => (
                  <Accordion
                    key={idx}
                    sx={{
                      bgcolor: 'transparent',
                      boxShadow: 'none',
                      '&:before': {
                        display: 'none',
                      },
                    }}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon sx={{ color: '#00FFB8' }} />}
                      sx={{
                        borderBottom: '1px solid rgba(0, 255, 184, 0.1)',
                        '& .MuiAccordionSummary-content': {
                          margin: '12px 0',
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
              </PandaCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Footer />
    </Box>
  );
};

export default HelpPage; 