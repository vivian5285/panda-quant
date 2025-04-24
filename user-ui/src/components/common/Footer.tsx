import React from 'react';
import {
  Box,
  Typography,
  Container,
  useTheme,
  Grid,
  Link,
} from '@mui/material';

const Footer: React.FC = () => {
  const theme = useTheme();

  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        backgroundColor: 'background.paper',
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              关于我们
            </Typography>
            <Typography variant="body2" color="text.secondary">
              我们提供专业的量化交易服务，月化收益50%-300%，只收取收益的10%。
            </Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              快速链接
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <Link href="/product/strategies" color="inherit" underline="hover">
                交易策略
              </Link>
              <Link href="/product/pricing" color="inherit" underline="hover">
                收费标准
              </Link>
              <Link href="/about/team" color="inherit" underline="hover">
                团队介绍
              </Link>
              <Link href="/resources/help" color="inherit" underline="hover">
                帮助中心
              </Link>
            </Box>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              联系我们
            </Typography>
            <Typography variant="body2" color="text.secondary">
              邮箱：support@panda-quant.com
            </Typography>
            <Typography variant="body2" color="text.secondary">
              电话：400-123-4567
            </Typography>
          </Grid>
        </Grid>
        <Box sx={{ mt: 4, pt: 4, borderTop: '1px solid', borderColor: 'divider' }}>
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Panda Quant. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer; 