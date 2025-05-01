import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActionArea,
  Chip,
  Tabs,
  Tab,
  useTheme
} from '@mui/material';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TimelineIcon from '@mui/icons-material/Timeline';
import ShowChartIcon from '@mui/icons-material/ShowChart';
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
      id={`case-study-tabpanel-${index}`}
      aria-labelledby={`case-study-tab-${index}`}
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

const CaseStudiesPage: React.FC = () => {
  const theme = useTheme();
  const [tabValue, setTabValue] = useState(0);
  const { t } = useTranslation();

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const caseStudies = [
    {
      title: '高频交易策略优化',
      description: '通过优化算法和参数调整，将交易频率提升30%，同时保持稳定的收益',
      image: '/case-studies/hft-optimization.jpg',
      category: '策略优化',
      tags: ['高频交易', '算法优化', '参数调优'],
      link: '/case-studies/hft-optimization'
    },
    {
      title: '多策略组合管理',
      description: '通过多策略组合和动态权重调整，实现更稳定的收益曲线',
      image: '/case-studies/multi-strategy.jpg',
      category: '策略组合',
      tags: ['多策略', '动态权重', '风险控制'],
      link: '/case-studies/multi-strategy'
    },
    {
      title: '机器学习策略开发',
      description: '利用机器学习算法开发交易策略，实现超额收益',
      image: '/case-studies/ml-strategy.jpg',
      category: 'AI策略',
      tags: ['机器学习', '深度学习', '特征工程'],
      link: '/case-studies/ml-strategy'
    },
    {
      title: '风险控制体系优化',
      description: '建立完善的风险控制体系，有效控制回撤',
      image: '/case-studies/risk-control.jpg',
      category: '风险管理',
      tags: ['风险控制', '回撤管理', '止损策略'],
      link: '/case-studies/risk-control'
    }
  ];

  const successStories = [
    {
      title: '个人交易者成长历程',
      description: '从零开始学习量化交易，最终实现稳定盈利的成长故事',
      image: '/case-studies/personal-growth.jpg',
      category: '成长故事',
      tags: ['个人交易', '学习历程', '经验分享'],
      link: '/case-studies/personal-growth'
    },
    {
      title: '机构交易团队建设',
      description: '如何组建和管理高效的量化交易团队',
      image: '/case-studies/team-building.jpg',
      category: '团队建设',
      tags: ['团队管理', '人才培养', '协作模式'],
      link: '/case-studies/team-building'
    }
  ];

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <GlobalBackground />
      <Navbar />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <motion.div variants={slideUp}>
          <GradientTitle 
            title={t('caseStudies.title', '案例研究')} 
            variant="h2" 
            align="center" 
            sx={{ mb: 6 }}
          >
            {t('caseStudies.title', '案例研究')}
          </GradientTitle>
        </motion.div>

        {/* 分类标签 */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 4 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            aria-label="case study types"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab icon={<TrendingUpIcon />} label="技术案例" />
            <Tab icon={<TimelineIcon />} label="成功故事" />
          </Tabs>
        </Box>

        {/* 技术案例 */}
        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={4}>
            {caseStudies.map((study, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: `0 8px 24px rgba(0, 0, 0, 0.2)`,
                      },
                    }}
                  >
                    <CardActionArea component="a" href={study.link}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={study.image}
                        alt={study.title}
                        sx={{
                          objectFit: 'cover',
                          position: 'relative',
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0, 0, 0, 0.3)',
                          },
                        }}
                      />
                      <CardContent>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          {study.category}
                        </Typography>
                        <Typography variant="h6" component="h3" gutterBottom>
                          {study.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {study.description}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {study.tags.map((tag, tagIndex) => (
                            <Chip
                              key={tagIndex}
                              label={tag}
                              size="small"
                              sx={{
                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                color: 'text.secondary',
                              }}
                            />
                          ))}
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </TabPanel>

        {/* 成功故事 */}
        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={4}>
            {successStories.map((story, index) => (
              <Grid item xs={12} sm={6} key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: `0 8px 24px rgba(0, 0, 0, 0.2)`,
                      },
                    }}
                  >
                    <CardActionArea component="a" href={story.link}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={story.image}
                        alt={story.title}
                        sx={{
                          objectFit: 'cover',
                          position: 'relative',
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0, 0, 0, 0.3)',
                          },
                        }}
                      />
                      <CardContent>
                        <Typography variant="subtitle2" color="primary" gutterBottom>
                          {story.category}
                        </Typography>
                        <Typography variant="h6" component="h3" gutterBottom>
                          {story.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                          {story.description}
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {story.tags.map((tag, tagIndex) => (
                            <Chip
                              key={tagIndex}
                              label={tag}
                              size="small"
                              sx={{
                                bgcolor: 'rgba(255, 255, 255, 0.1)',
                                color: 'text.secondary',
                              }}
                            />
                          ))}
                        </Box>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </TabPanel>
      </Container>

      <Footer />
    </Box>
  );
};

export default CaseStudiesPage; 