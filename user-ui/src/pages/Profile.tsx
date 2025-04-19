import React, { useState } from 'react';
import { Box, Container, Typography, Grid, Avatar } from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { themeUtils } from '../theme';
import PandaCard from '../components/common/PandaCard';
import PandaButton from '../components/common/PandaButton';
import PandaInput from '../components/common/PandaInput';
import PandaSelect from '../components/common/PandaSelect';
import { 
  Edit as EditIcon,
  Save as SaveIcon,
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  LocationOn as LocationIcon,
  Language as LanguageIcon,
  Notifications as NotificationsIcon,
  Security as SecurityIcon
} from '@mui/icons-material';

interface ProfileData {
  username: string;
  email: string;
  phone: string;
  location: string;
  language: string;
  notificationEnabled: boolean;
  twoFactorEnabled: boolean;
  avatar: string;
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

const Profile: React.FC = () => {
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState<ProfileData>({
    username: 'PandaTrader',
    email: 'panda@example.com',
    phone: '+86 123 4567 8901',
    location: 'China',
    language: 'zh-CN',
    notificationEnabled: true,
    twoFactorEnabled: true,
    avatar: '/images/panda-avatar.png'
  });

  const handleSave = () => {
    setIsEditing(false);
    // TODO: 实现保存逻辑
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        pt: 8,
        pb: 4,
        bgcolor: 'background.default',
      }}
    >
      <Container maxWidth="lg">
        <motion.div {...fadeInUp}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 600,
                background: themeUtils.createGradient('primary'),
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              {t('profile.title')}
            </Typography>
            <PandaButton
              variant="contained"
              startIcon={isEditing ? <SaveIcon /> : <EditIcon />}
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              animate
              glow
            >
              {isEditing ? t('profile.save') : t('profile.edit')}
            </PandaButton>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <PandaCard
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    p: 4,
                    textAlign: 'center'
                  }}
                >
                  <Avatar
                    src={profileData.avatar}
                    sx={{
                      width: 120,
                      height: 120,
                      mb: 3,
                      border: '4px solid',
                      borderColor: 'primary.main'
                    }}
                  />
                  <Typography variant="h5" sx={{ mb: 1, fontWeight: 600 }}>
                    {profileData.username}
                  </Typography>
                  <Typography variant="body1" sx={{ color: 'text.secondary', mb: 3 }}>
                    {t('profile.memberSince')}: 2024-01-01
                  </Typography>
                  <PandaButton
                    variant="outlined"
                    fullWidth
                    startIcon={<PersonIcon />}
                    animate
                  >
                    {t('profile.changeAvatar')}
                  </PandaButton>
                </PandaCard>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={8}>
              <motion.div
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                <PandaCard
                  sx={{
                    height: '100%',
                    p: 4
                  }}
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6}>
                      <PandaInput
                        label={t('profile.username')}
                        value={profileData.username}
                        disabled={!isEditing}
                        startIcon={<PersonIcon />}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <PandaInput
                        label={t('profile.email')}
                        value={profileData.email}
                        disabled={!isEditing}
                        startIcon={<EmailIcon />}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <PandaInput
                        label={t('profile.phone')}
                        value={profileData.phone}
                        disabled={!isEditing}
                        startIcon={<PhoneIcon />}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <PandaInput
                        label={t('profile.location')}
                        value={profileData.location}
                        disabled={!isEditing}
                        startIcon={<LocationIcon />}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <PandaSelect
                        label={t('profile.language')}
                        value={profileData.language}
                        disabled={!isEditing}
                        startIcon={<LanguageIcon />}
                        options={[
                          { value: 'zh-CN', label: '中文' },
                          { value: 'en-US', label: 'English' }
                        ]}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <PandaSelect
                        label={t('profile.notifications')}
                        value={profileData.notificationEnabled ? 'enabled' : 'disabled'}
                        disabled={!isEditing}
                        startIcon={<NotificationsIcon />}
                        options={[
                          { value: 'enabled', label: t('profile.enabled') },
                          { value: 'disabled', label: t('profile.disabled') }
                        ]}
                        fullWidth
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <PandaSelect
                        label={t('profile.twoFactor')}
                        value={profileData.twoFactorEnabled ? 'enabled' : 'disabled'}
                        disabled={!isEditing}
                        startIcon={<SecurityIcon />}
                        options={[
                          { value: 'enabled', label: t('profile.enabled') },
                          { value: 'disabled', label: t('profile.disabled') }
                        ]}
                        fullWidth
                      />
                    </Grid>
                  </Grid>
                </PandaCard>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>
    </Box>
  );
};

export default Profile; 