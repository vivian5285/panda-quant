import React from 'react';
import { Box, Container, Typography, Grid, Avatar } from '@mui/material';
import GlobalBackground from '@/components/common/GlobalBackground';
import Navbar from '@/components/common/Navbar';
import { GradientTitle } from '@/components/common/GradientTitle';
import PandaCard from '@/components/common/PandaCard';

const TeamPage: React.FC = () => {
  const teamMembers = [
    {
      name: 'Michael Johnson',
      position: '创始人兼首席执行官',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      bio: '拥有15年金融科技行业经验，曾在多家知名金融机构担任高管职务。',
      expertise: ['金融科技', '量化交易', '区块链'],
    },
    {
      name: 'David Wilson',
      position: '首席技术官',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
      bio: '人工智能专家，专注于量化交易算法开发，拥有多项技术专利。',
      expertise: ['人工智能', '机器学习', '算法设计'],
    },
    {
      name: 'Sarah Anderson',
      position: '产品总监',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=400&h=400&fit=crop',
      bio: '用户体验专家，负责产品设计和用户增长，致力于创造卓越的用户体验。',
      expertise: ['产品设计', '用户体验', '用户增长'],
    },
    {
      name: 'Kevin Taylor',
      position: '风控总监',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      bio: '风险管理专家，负责平台风控系统建设，确保用户资产安全。',
      expertise: ['风险管理', '合规', '安全'],
    },
  ];

  return (
    <Box sx={{ position: 'relative', minHeight: '100vh' }}>
      <GlobalBackground />
      <Navbar />
      
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <GradientTitle
          title="我们的团队"
          subtitle="专业、创新、值得信赖"
          sx={{ mb: 6 }}
        />
        
        <Grid container spacing={4}>
          {teamMembers.map((member) => (
            <Grid item xs={12} sm={6} md={3} key={member.name}>
              <PandaCard>
                <Box sx={{ textAlign: 'center', p: 3 }}>
                  <Avatar
                    src={member.avatar}
                    alt={member.name}
                    sx={{
                      width: 120,
                      height: 120,
                      mx: 'auto',
                      mb: 2,
                      border: '3px solid #00FFB8',
                    }}
                  />
                  <Typography variant="h6" gutterBottom>
                    {member.name}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    color="primary"
                    sx={{ mb: 2, color: '#00FFB8' }}
                  >
                    {member.position}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {member.bio}
                  </Typography>
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, justifyContent: 'center' }}>
                    {member.expertise.map((skill) => (
                      <Typography
                        key={skill}
                        variant="caption"
                        sx={{
                          bgcolor: 'rgba(0, 255, 184, 0.1)',
                          color: '#00FFB8',
                          px: 1.5,
                          py: 0.5,
                          borderRadius: '12px',
                        }}
                      >
                        {skill}
                      </Typography>
                    ))}
                  </Box>
                </Box>
              </PandaCard>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ mt: 8 }}>
          <PandaCard>
            <Typography variant="h5" gutterBottom>
              加入我们
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              我们正在寻找志同道合的伙伴，共同打造世界领先的量化交易平台。如果您对金融科技充满热情，欢迎加入我们的团队。
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Typography
                variant="body2"
                sx={{
                  color: '#00FFB8',
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                查看职位
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: '#00FFB8',
                  cursor: 'pointer',
                  '&:hover': {
                    textDecoration: 'underline',
                  },
                }}
              >
                提交简历
              </Typography>
            </Box>
          </PandaCard>
        </Box>
      </Container>
    </Box>
  );
};

export default TeamPage; 