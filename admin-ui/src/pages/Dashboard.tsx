import React from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  LinearProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  AccountBalance as AccountBalanceIcon,
  TrendingUp as TrendingUpIcon,
  People as PeopleIcon,
  Settings as SettingsIcon,
} from '@mui/icons-material';

const Dashboard: React.FC = () => {
  const { t } = useTranslation();

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('dashboard.title')}
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AccountBalanceIcon color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">{t('dashboard.totalBalance')}</Typography>
              </Box>
              <Typography variant="h4">$0.00</Typography>
              <LinearProgress variant="determinate" value={0} sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <TrendingUpIcon color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">{t('dashboard.totalProfit')}</Typography>
              </Box>
              <Typography variant="h4">$0.00</Typography>
              <LinearProgress variant="determinate" value={0} sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <PeopleIcon color="info" sx={{ mr: 1 }} />
                <Typography variant="h6">{t('dashboard.totalUsers')}</Typography>
              </Box>
              <Typography variant="h4">0</Typography>
              <LinearProgress variant="determinate" value={0} sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SettingsIcon color="action" sx={{ mr: 1 }} />
                <Typography variant="h6">{t('dashboard.settings')}</Typography>
              </Box>
              <Typography variant="h4">0</Typography>
              <LinearProgress variant="determinate" value={0} sx={{ mt: 2 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard; 