import React from 'react';
import { Box, Container, Typography, Grid, Card, CardContent, Button } from '@mui/material';
import { 
  Group as GroupIcon,
  AttachMoney as AttachMoneyIcon,
  CardGiftcard as CardGiftcardIcon,
} from '@mui/icons-material';

const rewards = [
  {
    icon: <GroupIcon sx={{ fontSize: 40, color: '#00bfae' }} />,
    title: '邀请好友',
    description: '邀请好友注册并完成托管',
    reward: '$50 抵扣券',
  },
  {
    icon: <AttachMoneyIcon sx={{ fontSize: 40, color: '#00bfae' }} />,
    title: '好友消费',
    description: '好友完成托管并产生消费',
    reward: '10% 佣金',
  },
  {
    icon: <CardGiftcardIcon sx={{ fontSize: 40, color: '#00bfae' }} />,
    title: '额外奖励',
    description: '邀请满 5 位好友',
    reward: '$100 现金奖励',
  },
];

const InviteSystem: React.FC = () => {
  return (
    <Box sx={{ py: 8, bgcolor: '#f8f9fa' }}>
      <Container maxWidth="lg">
        <Typography
          variant="h3"
          component="h2"
          sx={{
            textAlign: 'center',
            mb: 6,
            fontWeight: 'bold',
            color: '#004d2d',
          }}
        >
          推荐奖励
        </Typography>
        <Grid container spacing={4}>
          {rewards.map((reward, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'translateY(-8px)',
                  },
                }}
              >
                <CardContent sx={{ flexGrow: 1, textAlign: 'center' }}>
                  <Box sx={{ mb: 2 }}>{reward.icon}</Box>
                  <Typography
                    variant="h5"
                    component="h3"
                    sx={{ mb: 2, fontWeight: 'bold', color: '#004d2d' }}
                  >
                    {reward.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    {reward.description}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#00bfae',
                      fontWeight: 'bold',
                      mb: 3,
                    }}
                  >
                    {reward.reward}
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{
                      bgcolor: '#00bfae',
                      '&:hover': {
                        bgcolor: '#009688',
                      },
                    }}
                  >
                    立即邀请
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box sx={{ mt: 6, textAlign: 'center' }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            分享您的专属邀请链接给好友,双方都能获得丰厚奖励
          </Typography>
          <Button
            variant="outlined"
            sx={{
              color: '#00bfae',
              borderColor: '#00bfae',
              '&:hover': {
                borderColor: '#009688',
                bgcolor: 'rgba(0, 191, 174, 0.04)',
              },
            }}
          >
            复制邀请链接
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default InviteSystem; 