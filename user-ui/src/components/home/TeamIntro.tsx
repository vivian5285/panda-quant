import React from 'react';
import { Box, Typography, Card, CardContent, CardMedia } from '@mui/material';
import Grid2 from '@mui/material/Grid2';
import { motion } from 'framer-motion';

const teamMembers = [
  {
    name: '张博士',
    role: '首席算法专家',
    description: '前谷歌AI研究员，专注于深度学习与量化交易',
    image: '/images/team/zhang.jpg',
  },
  {
    name: '李教授',
    role: '金融工程专家',
    description: '华尔街量化交易经验，精通高频交易策略',
    image: '/images/team/li.jpg',
  },
  {
    name: '王工程师',
    role: '系统架构师',
    description: '分布式系统专家，确保交易系统稳定可靠',
    image: '/images/team/wang.jpg',
  },
];

const TeamIntro: React.FC = () => {
  return (
    <Box sx={{ py: 4 }}>
      <Typography
        variant="h4"
        component="h2"
        align="center"
        sx={{ mb: 4, fontWeight: 'bold' }}
      >
        专业团队与算法
      </Typography>
      <Grid2 container spacing={4}>
        {teamMembers.map((member, index) => (
          <Grid2 xs={12} sm={6} md={4} key={index}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRadius: 2,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={member.image}
                  alt={member.name}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="h6" component="h3" sx={{ mb: 1 }}>
                    {member.name}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="primary"
                    sx={{ mb: 1 }}
                  >
                    {member.role}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {member.description}
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          </Grid2>
        ))}
      </Grid2>
      <Box sx={{ mt: 4, textAlign: 'center' }}>
        <Typography variant="body1" sx={{ mb: 2 }}>
          我们的团队由来自全球顶尖科技公司和金融机构的专家组成，
          拥有丰富的AI算法研发和量化交易经验。
        </Typography>
        <Typography variant="body1">
          核心算法经过多年市场验证，持续优化迭代，
          确保为用户提供最优质的量化交易服务。
        </Typography>
      </Box>
    </Box>
  );
};

export default TeamIntro; 