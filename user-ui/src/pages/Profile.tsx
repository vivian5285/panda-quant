import React, { useState } from 'react';
import { Box, Container, Typography, TextField, Button, Avatar, Grid, Paper } from '@mui/material';
import { useAuth } from '../hooks/useAuth';
import { GradientTitle } from '../components/common/GradientTitle';
import { useTranslation } from 'react-i18next';
import { User } from '../types/user';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const { t } = useTranslation();
  const [profile, setProfile] = useState({
    username: user?.username || '',
    email: user?.email || '',
    avatar: user?.avatar || '',
    bio: user?.bio || '',
    walletAddress: user?.walletAddress || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // TODO: Implement profile update logic
      console.log('Profile updated:', profile);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <Box sx={{ mb: 6, textAlign: 'center' }}>
        <GradientTitle 
          title={t('profile.title', '个人资料')} 
          variant="h4" 
          align="center" 
          gutterBottom
        >
          {t('profile.title', '个人资料')}
        </GradientTitle>
      </Box>

      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              src={profile.avatar}
              sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
            />
            <Typography variant="h6" gutterBottom>
              {profile.username}
            </Typography>
            <Typography color="text.secondary">
              {profile.email}
            </Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <form onSubmit={handleSubmit}>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('profile.name', '姓名')}
                    value={profile.username}
                    onChange={(e) => setProfile({ ...profile, username: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('profile.email', '邮箱')}
                    value={profile.email}
                    disabled
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label={t('profile.bio', '个人简介')}
                    value={profile.bio}
                    onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    fullWidth
                  >
                    {t('profile.save', '保存更改')}
                  </Button>
                </Grid>
              </Grid>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Profile; 