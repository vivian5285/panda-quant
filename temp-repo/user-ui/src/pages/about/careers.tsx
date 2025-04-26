import React from 'react';
import { Box, Container, Typography, Grid, Button, Chip } from '@mui/material';
import { GlobalBackground } from '@/components/common/GlobalBackground';
import { Navbar } from '@/components/common/Navbar';
import { Footer } from '@/components/common/Footer';
import { GradientTitle } from '@/components/common/GradientTitle';
import { PandaCard } from '@/components/common/PandaCard';

const CareersPage: React.FC = () => {
  const positions = [
    {
      title: '量化交易策略研究员',
      type: '全职',
      location: '上海/远程',
      description: '负责开发和优化量化交易策略，进行市场分析和回测。',
      requirements: [
        '金融、数学、计算机等相关专业硕士及以上学历',
        '熟悉Python、R等编程语言',
        '有量化交易或金融分析经验',
        '良好的数学和统计学基础'
      ]
    },
    {
      title: '前端开发工程师',
      type: '全职',
      location: '上海/远程',
      description: '负责平台前端开发和优化，提升用户体验。',
      requirements: [
        '计算机相关专业本科及以上学历',
        '精通React、TypeScript等前端技术',
        '有大型项目开发经验',
        '良好的代码规范和团队协作能力'
      ]
    },
    {
      title: '后端开发工程师',
      type: '全职',
      location: '上海/远程',
      description: '负责平台后端系统开发和维护，确保系统稳定运行。',
      requirements: [
        '计算机相关专业本科及以上学历',
        '精通Node.js、Python等后端技术',
        '熟悉数据库设计和优化',
        '有高并发系统开发经验'
      ]
    }
  ];

  const benefits = [
    {
      title: '优厚待遇',
      items: ['具有竞争力的薪资', '年终奖金', '股权激励']
    },
    {
      title: '工作环境',
      items: ['弹性工作时间', '远程办公支持', '舒适办公环境']
    },
    {
      title: '职业发展',
      items: ['技术培训', '晋升机会', '行业交流']
    },
    {
      title: '员工福利',
      items: ['五险一金', '带薪年假', '节日福利']
    }
  ];

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <GlobalBackground />
      <Navbar />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <GradientTitle
          title="加入我们"
          subtitle="一起创造金融科技的未来"
          sx={{ mb: 6 }}
        />

        <Box sx={{ mb: 6 }}>
          <Typography variant="h5" gutterBottom>
            公司文化
          </Typography>
          <Typography variant="body1" color="text.secondary" paragraph>
            我们致力于打造一个开放、创新、协作的工作环境，鼓励团队成员不断学习和成长。
            在这里，你可以充分发挥自己的才能，与优秀的同事一起创造价值。
          </Typography>
        </Box>

        <Grid container spacing={4} sx={{ mb: 6 }}>
          {benefits.map((benefit, index) => (
            <Grid item xs={12} md={6} key={index}>
              <PandaCard>
                <Typography variant="h6" gutterBottom>
                  {benefit.title}
                </Typography>
                <Box sx={{ mt: 2 }}>
                  {benefit.items.map((item, idx) => (
                    <Typography key={idx} variant="body1" sx={{ mb: 1 }}>
                      ✓ {item}
                    </Typography>
                  ))}
                </Box>
              </PandaCard>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h5" gutterBottom sx={{ mb: 4 }}>
          开放职位
        </Typography>

        <Grid container spacing={4}>
          {positions.map((position, index) => (
            <Grid item xs={12} key={index}>
              <PandaCard>
                <Box sx={{ p: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Typography variant="h6" sx={{ mr: 2 }}>
                      {position.title}
                    </Typography>
                    <Chip
                      label={position.type}
                      sx={{
                        bgcolor: '#00FFB8',
                        color: 'white',
                        mr: 1,
                      }}
                    />
                    <Chip
                      label={position.location}
                      sx={{
                        bgcolor: 'rgba(0, 255, 184, 0.1)',
                        color: '#00FFB8',
                      }}
                    />
                  </Box>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {position.description}
                  </Typography>
                  <Typography variant="subtitle1" gutterBottom>
                    任职要求：
                  </Typography>
                  <Box sx={{ pl: 2 }}>
                    {position.requirements.map((req, idx) => (
                      <Typography key={idx} variant="body1" sx={{ mb: 1 }}>
                        • {req}
                      </Typography>
                    ))}
                  </Box>
                  <Button
                    variant="contained"
                    sx={{
                      mt: 3,
                      bgcolor: '#00FFB8',
                      color: 'white',
                      '&:hover': {
                        bgcolor: '#00E6A5',
                      },
                    }}
                  >
                    立即申请
                  </Button>
                </Box>
              </PandaCard>
            </Grid>
          ))}
        </Grid>
      </Container>

      <Footer />
    </Box>
  );
};

export default CareersPage; 