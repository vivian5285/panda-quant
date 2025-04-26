import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button, Chip } from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const CareersPage: React.FC = () => {
  const { t } = useTranslation();

  const jobOpenings = [
    {
      title: '高级量化交易策略师',
      department: '量化交易部',
      location: '远程',
      type: '全职',
      description: '负责开发和优化量化交易策略，包括高频交易、套利策略等。',
      requirements: [
        '5年以上量化交易经验',
        '精通Python/C++编程',
        '熟悉机器学习算法',
        '有高频交易经验者优先'
      ],
      tags: ['量化交易', 'Python', '机器学习', '高频交易']
    },
    {
      title: '区块链开发工程师',
      department: '技术部',
      location: '远程',
      type: '全职',
      description: '负责区块链底层技术开发和智能合约编写。',
      requirements: [
        '3年以上区块链开发经验',
        '精通Solidity/Rust',
        '熟悉以太坊生态',
        '有DeFi项目经验者优先'
      ],
      tags: ['区块链', 'Solidity', 'Rust', 'DeFi']
    },
    {
      title: '产品经理',
      department: '产品部',
      location: '远程',
      type: '全职',
      description: '负责量化交易平台的产品规划和功能设计。',
      requirements: [
        '3年以上金融科技产品经验',
        '熟悉量化交易流程',
        '优秀的沟通能力',
        '有交易系统设计经验者优先'
      ],
      tags: ['产品经理', '金融科技', '量化交易', '用户体验']
    },
    {
      title: '量化交易策略研究员',
      department: '量化交易部',
      location: '远程',
      type: '全职',
      description: '负责开发和优化量化交易策略，进行市场分析和回测。',
      requirements: [
        '金融、数学、计算机等相关专业硕士及以上学历',
        '熟悉Python、R等编程语言',
        '有量化交易或金融分析经验',
        '良好的数学和统计学基础'
      ],
      tags: ['量化交易', 'Python', 'R', '数据分析']
    },
    {
      title: '前端开发工程师',
      department: '技术部',
      location: '远程',
      type: '全职',
      description: '负责平台前端开发和优化，提升用户体验。',
      requirements: [
        '计算机相关专业本科及以上学历',
        '精通React、TypeScript等前端技术',
        '有大型项目开发经验',
        '良好的代码规范和团队协作能力'
      ],
      tags: ['前端', 'React', 'TypeScript', 'Web3']
    },
    {
      title: '后端开发工程师',
      department: '技术部',
      location: '远程',
      type: '全职',
      description: '负责平台后端系统开发和维护，确保系统稳定运行。',
      requirements: [
        '计算机相关专业本科及以上学历',
        '精通Node.js、Python等后端技术',
        '熟悉数据库设计和优化',
        '有高并发系统开发经验'
      ],
      tags: ['后端', 'Node.js', 'Python', '数据库']
    }
  ];

  return (
    <Box sx={{ py: 8 }}>
      <Container maxWidth="lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography
            variant="h2"
            component="h1"
            align="center"
            gutterBottom
            sx={{ fontWeight: 'bold', mb: 4 }}
          >
            加入我们
          </Typography>
          <Typography
            variant="h5"
            align="center"
            color="text.secondary"
            sx={{ mb: 8 }}
          >
            与行业精英一起，共同打造量化交易的未来
          </Typography>
        </motion.div>

        <Box sx={{ mb: 8, textAlign: 'center' }}>
          <Typography variant="h4" gutterBottom>
            为什么选择熊猫量化？
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Typography variant="h6" gutterBottom>
                  创新文化
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  鼓励创新思维，支持新技术探索
                </Typography>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Typography variant="h6" gutterBottom>
                  专业成长
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  提供持续学习和职业发展机会
                </Typography>
              </motion.div>
            </Grid>
            <Grid item xs={12} md={4}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Typography variant="h6" gutterBottom>
                  优厚待遇
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  具有竞争力的薪资和福利
                </Typography>
              </motion.div>
            </Grid>
          </Grid>
        </Box>

        <Typography variant="h4" align="center" gutterBottom sx={{ mb: 4 }}>
          职位空缺
        </Typography>

        <Grid container spacing={4}>
          {jobOpenings.map((job, index) => (
            <Grid item xs={12} key={index}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card
                  sx={{
                    '&:hover': {
                      transform: 'translateY(-4px)',
                      transition: 'transform 0.3s ease-in-out'
                    }
                  }}
                >
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box>
                        <Typography variant="h5" component="h2" gutterBottom>
                          {job.title}
                        </Typography>
                        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
                          {job.department} | {job.location} | {job.type}
                        </Typography>
                      </Box>
                      <Button
                        variant="contained"
                        color="primary"
                        sx={{
                          borderRadius: '20px',
                          textTransform: 'none',
                          px: 3
                        }}
                      >
                        立即申请
                      </Button>
                    </Box>
                    <Typography variant="body1" paragraph>
                      {job.description}
                    </Typography>
                    <Typography variant="h6" gutterBottom>
                      任职要求：
                    </Typography>
                    <Box component="ul" sx={{ pl: 2, mb: 2 }}>
                      {job.requirements.map((req, i) => (
                        <Typography component="li" key={i} variant="body1" color="text.secondary">
                          {req}
                        </Typography>
                      ))}
                    </Box>
                    <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                      {job.tags.map((tag, i) => (
                        <Chip
                          key={i}
                          label={tag}
                          size="small"
                          sx={{
                            bgcolor: 'rgba(0, 255, 184, 0.1)',
                            color: 'primary.main',
                            '&:hover': {
                              bgcolor: 'rgba(0, 255, 184, 0.2)'
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 8, textAlign: 'center' }}>
          <Typography variant="h5" gutterBottom>
            没有找到合适的职位？
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            我们随时欢迎优秀的人才加入，请将您的简历发送至 careers@pandaquant.com
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default CareersPage; 