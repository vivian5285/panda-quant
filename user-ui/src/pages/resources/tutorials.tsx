import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  Button,
  useTheme
} from '@mui/material';
import ArticleIcon from '@mui/icons-material/Article';
import GlobalBackground from '@/components/common/GlobalBackground';
import { GradientTitle } from '@/components/common/GradientTitle';
import { motion } from 'framer-motion';

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
      id={`tutorial-tabpanel-${index}`}
      aria-labelledby={`tutorial-tab-${index}`}
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

const TutorialsPage: React.FC = () => {
  const theme = useTheme();
  const [value, setValue] = useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const tutorials = [
    {
      title: '入门指南',
      description: '了解熊猫量化的基本功能和使用方法',
      content: [
        '1. 注册并登录您的账户',
        '2. 完成身份验证和风险评估',
        '3. 选择适合您的交易策略',
        '4. 设置交易参数和风险控制',
        '5. 开始自动化交易'
      ]
    },
    {
      title: '策略选择',
      description: '如何选择最适合您的交易策略',
      content: [
        '1. 了解不同策略的特点和适用场景',
        '2. 根据您的风险承受能力选择策略',
        '3. 查看策略的历史表现和风险指标',
        '4. 设置合理的资金分配比例',
        '5. 定期评估和调整策略组合'
      ]
    },
    {
      title: '风险控制',
      description: '如何有效控制交易风险',
      content: [
        '1. 设置止损和止盈点位',
        '2. 控制单笔交易的最大仓位',
        '3. 分散投资，避免过度集中',
        '4. 定期检查账户风险状况',
        '5. 及时调整风险控制参数'
      ]
    },
    {
      title: '收益管理',
      description: '如何最大化您的投资收益',
      content: [
        '1. 了解收益分成机制',
        '2. 设置合理的收益目标',
        '3. 定期提取收益',
        '4. 复利投资，加速财富增长',
        '5. 关注市场动态，及时调整策略'
      ]
    }
  ];

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <GlobalBackground />
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <GradientTitle
          title="使用教程"
          subtitle="快速掌握熊猫量化的使用方法"
          sx={{ mb: 6 }}
        />

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs
            value={value}
            onChange={handleTabChange}
            aria-label="tutorial tabs"
            sx={{
              '& .MuiTab-root': {
                color: theme.palette.text.primary,
                '&.Mui-selected': {
                  color: '#00FFB8',
                },
              },
              '& .MuiTabs-indicator': {
                backgroundColor: '#00FFB8',
              },
            }}
          >
            {tutorials.map((tutorial, index) => (
              <Tab
                key={index}
                label={tutorial.title}
                id={`tutorial-tab-${index}`}
                aria-controls={`tutorial-tabpanel-${index}`}
              />
            ))}
          </Tabs>
        </Box>

        {tutorials.map((tutorial, index) => (
          <TabPanel key={index} value={value} index={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card
                sx={{
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
                }}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <ArticleIcon sx={{ fontSize: 40, color: '#00FFB8', mr: 2 }} />
                    <Box>
                      <Typography variant="h5" component="h2" gutterBottom>
                        {tutorial.title}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        {tutorial.description}
                      </Typography>
                    </Box>
                  </Box>
                  <Box sx={{ mt: 3 }}>
                    {tutorial.content.map((item, itemIndex) => (
                      <Typography
                        key={itemIndex}
                        variant="body1"
                        sx={{ mb: 1, display: 'flex', alignItems: 'flex-start' }}
                      >
                        <Box
                          component="span"
                          sx={{
                            color: '#00FFB8',
                            mr: 1,
                            mt: '2px',
                          }}
                        >
                          •
                        </Box>
                        {item}
                      </Typography>
                    ))}
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </TabPanel>
        ))}
      </Container>
    </Box>
  );
};

export default TutorialsPage; 