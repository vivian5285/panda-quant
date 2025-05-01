import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  TextField,
  InputAdornment,
  Tabs,
  Tab,
  useTheme
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import GlobalBackground from '@/components/common/GlobalBackground';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/common/Footer';
import { GradientTitle } from '@/components/common/GradientTitle';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { slideUp } from '../../animations';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`faq-tabpanel-${index}`}
      aria-labelledby={`faq-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const FAQPage: React.FC = () => {
  const theme = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const { t } = useTranslation();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const faqCategories = [
    {
      title: '账户与安全',
      faqs: [
        {
          question: '如何注册账户？',
          answer: '您可以通过以下步骤注册账户：1) 访问官网首页；2) 点击"注册"按钮；3) 填写必要信息；4) 完成邮箱验证；5) 设置安全密码。'
        },
        {
          question: '如何保护账户安全？',
          answer: '我们建议您：1) 使用强密码；2) 开启双重认证；3) 定期更换密码；4) 不在公共设备登录；5) 及时更新安全设置。'
        },
        {
          question: '忘记密码怎么办？',
          answer: '您可以通过以下方式找回密码：1) 点击登录页面的"忘记密码"；2) 输入注册邮箱；3) 查收重置密码邮件；4) 按照邮件指引重置密码。'
        }
      ]
    },
    {
      title: '交易与策略',
      faqs: [
        {
          question: '如何开始量化交易？',
          answer: '开始量化交易的步骤：1) 完成账户注册和认证；2) 选择适合的交易策略；3) 设置交易参数；4) 进行资金充值；5) 启动交易。'
        },
        {
          question: '如何选择合适的交易策略？',
          answer: '选择策略时考虑：1) 风险承受能力；2) 投资期限；3) 市场环境；4) 策略历史表现；5) 资金规模。'
        },
        {
          question: '交易费用如何计算？',
          answer: '我们的收费模式：1) 只收取收益的10%作为服务费；2) 无其他隐藏费用；3) 交易手续费由交易所收取；4) 提现费用根据网络情况而定。'
        }
      ]
    },
    {
      title: 'API与开发',
      faqs: [
        {
          question: '如何获取API密钥？',
          answer: '获取API密钥的步骤：1) 登录账户；2) 进入API管理页面；3) 创建新的API密钥；4) 设置权限范围；5) 保存密钥信息。'
        },
        {
          question: 'API调用频率限制是多少？',
          answer: 'API调用限制：1) 普通用户：每分钟60次；2) VIP用户：每分钟120次；3) 企业用户：每分钟300次。超出限制将暂时封禁。'
        },
        {
          question: '如何开发自己的交易策略？',
          answer: '开发策略的步骤：1) 学习API文档；2) 使用策略开发工具；3) 进行回测验证；4) 提交审核；5) 上线运行。'
        }
      ]
    }
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // 这里可以添加搜索逻辑
  };

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <GlobalBackground />
      <Navbar />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div variants={slideUp}>
          <GradientTitle
            title={t('faq.title', '常见问题')}
            variant="h2"
            align="center"
            sx={{ mb: 6 }}
          >
            {t('faq.title', '常见问题')}
          </GradientTitle>
        </motion.div>

        {/* 搜索框 */}
        <Box sx={{ mb: 6 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="搜索问题..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                bgcolor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 2,
                '&:hover': {
                  bgcolor: 'rgba(255, 255, 255, 0.1)',
                },
              },
            }}
          />
        </Box>

        {/* 分类标签 */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="FAQ categories"
            variant="scrollable"
            scrollButtons="auto"
          >
            {faqCategories.map((category, index) => (
              <Tab
                key={index}
                label={category.title}
                id={`faq-tab-${index}`}
                aria-controls={`faq-tabpanel-${index}`}
              />
            ))}
          </Tabs>
        </Box>

        {/* FAQ内容 */}
        {faqCategories.map((category, index) => (
          <TabPanel key={index} value={tabValue} index={index}>
            <Grid container spacing={3}>
              {category.faqs.map((faq, faqIndex) => (
                <Grid item xs={12} key={faqIndex}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: faqIndex * 0.1 }}
                  >
                    <Accordion
                      sx={{
                        bgcolor: 'rgba(255, 255, 255, 0.05)',
                        '&:before': {
                          display: 'none',
                        },
                        '&:hover': {
                          bgcolor: 'rgba(255, 255, 255, 0.1)',
                        },
                      }}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        sx={{
                          '& .MuiAccordionSummary-content': {
                            my: 1,
                          },
                        }}
                      >
                        <Typography variant="subtitle1" sx={{ fontWeight: 500 }}>
                          {faq.question}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography variant="body1" color="text.secondary">
                          {faq.answer}
                        </Typography>
                      </AccordionDetails>
                    </Accordion>
                  </motion.div>
                </Grid>
              ))}
            </Grid>
          </TabPanel>
        ))}
      </Container>

      <Footer />
    </Box>
  );
};

export default FAQPage; 