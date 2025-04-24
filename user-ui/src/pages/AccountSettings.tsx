import React, { useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  FormControlLabel,
  Switch,
  Tabs,
  Tab,
  Container,
} from '@mui/material';
import {
  Person as PersonIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import PandaCard from '../components/common/PandaCard';
import PandaButton from '../components/common/PandaButton';
import { PandaAlert } from '../components/common/PandaAlert';
import { fadeIn, slideUp, staggerChildren } from '../animations';

interface UserProfile {
  email: string;
  name: string;
  phone: string;
  language: string;
  timezone: string;
}

interface SecuritySettings {
  twoFactorEnabled: boolean;
  emailNotifications: boolean;
  smsNotifications: boolean;
  apiKey: string;
}

interface UserSettings {
  language: string;
  theme: string;
  notifications: {
    email: boolean;
    push: boolean;
    trade: boolean;
  };
  security: {
    twoFactor: boolean;
    sessionTimeout: number;
  };
}

type SettingsCategory = 'notifications' | 'security';

const AccountSettings: React.FC = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState(0);
  const [profile, setProfile] = useState<UserProfile>({
    email: '',
    name: '',
    phone: '',
    language: 'en',
    timezone: 'UTC',
  });
  const [security, setSecurity] = useState<SecuritySettings>({
    twoFactorEnabled: false,
    emailNotifications: true,
    smsNotifications: false,
    apiKey: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    language: 'en',
    theme: 'light',
    notifications: {
      email: true,
      push: true,
      trade: true,
    },
    security: {
      twoFactor: false,
      sessionTimeout: 30,
    },
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleProfileChange = (field: keyof UserProfile) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setProfile({ ...profile, [field]: event.target.value });
  };

  const handleSecurityChange = (field: keyof SecuritySettings) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setSecurity({
      ...security,
      [field]: event.target.checked,
    });
  };

  const handleSaveProfile = async () => {
    setIsLoading(true);
    try {
      // TODO: Call API to save profile
      setSuccess(t('accountSettings.profileSaved'));
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(t('accountSettings.errorSavingProfile'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveSecurity = async () => {
    setIsLoading(true);
    try {
      // TODO: Call API to save security settings
      setSuccess(t('accountSettings.securitySaved'));
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(t('accountSettings.errorSavingSecurity'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsLoading(true);
    try {
      // TODO: Call API to delete account
      setIsDeleteDialogOpen(false);
      // TODO: Redirect to login page
    } catch (err) {
      setError(t('accountSettings.errorDeletingAccount'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSettingChange = (category: SettingsCategory, field: string, value: any) => {
    setSettings(prev => {
      const newSettings = { ...prev };
      if (category === 'notifications') {
        newSettings.notifications = {
          ...prev.notifications,
          [field]: value,
        };
      } else if (category === 'security') {
        newSettings.security = {
          ...prev.security,
          [field]: value,
        };
      }
      return newSettings;
    });
  };

  const handleSave = () => {
    // TODO: Implement save functionality
    setSnackbar({
      open: true,
      message: t('accountSettings.saved'),
      severity: 'success',
    });
    setIsEditing(false);
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, rgba(0, 255, 184, 0.03) 0%, rgba(0, 0, 0, 0) 100%)',
        py: 4,
      }}
    >
      <Container maxWidth="lg">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={staggerChildren}
        >
          <motion.div variants={fadeIn}>
            <Typography
              variant="h2"
              sx={{
                color: '#00FFB8',
                fontWeight: 700,
                mb: 2,
                fontSize: { xs: '2rem', md: '2.5rem' },
                fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
              }}
            >
              {t('accountSettings.title')}
            </Typography>
          </motion.div>

          {error && (
            <PandaAlert severity="error" sx={{ mb: 2 }}>
              {error}
            </PandaAlert>
          )}

          {success && (
            <PandaAlert severity="success" sx={{ mb: 2 }}>
              {success}
            </PandaAlert>
          )}

          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              mb: 3,
              '& .MuiTab-root': {
                color: '#00FFB8',
                '&.Mui-selected': {
                  color: '#00FFB8',
                },
              },
            }}
          >
            <Tab icon={<PersonIcon />} label={t('accountSettings.profile')} />
            <Tab icon={<SecurityIcon />} label={t('accountSettings.security')} />
            <Tab icon={<NotificationsIcon />} label={t('accountSettings.notifications')} />
            <Tab icon={<LanguageIcon />} label={t('accountSettings.preferences')} />
          </Tabs>

          {activeTab === 0 && (
            <motion.div variants={slideUp}>
              <PandaCard
                title={t('accountSettings.profile')}
                gradient
                animation
              >
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('accountSettings.name')}
                      value={profile.name}
                      onChange={handleProfileChange('name')}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('accountSettings.email')}
                      value={profile.email}
                      onChange={handleProfileChange('email')}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('accountSettings.phone')}
                      value={profile.phone}
                      onChange={handleProfileChange('phone')}
                    />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <TextField
                      fullWidth
                      label={t('accountSettings.timezone')}
                      value={profile.timezone}
                      onChange={handleProfileChange('timezone')}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <PandaButton
                    variant="contained"
                    onClick={handleSaveProfile}
                    disabled={isLoading}
                  >
                    {t('common.save')}
                  </PandaButton>
                </Box>
              </PandaCard>
            </motion.div>
          )}

          {activeTab === 1 && (
            <motion.div variants={slideUp}>
              <PandaCard
                title={t('accountSettings.security')}
                gradient
                animation
              >
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={security.twoFactorEnabled}
                          onChange={handleSecurityChange('twoFactorEnabled')}
                        />
                      }
                      label={t('accountSettings.twoFactorAuth')}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label={t('accountSettings.apiKey')}
                      value={security.apiKey}
                      disabled
                    />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <PandaButton
                    variant="contained"
                    onClick={handleSaveSecurity}
                    disabled={isLoading}
                  >
                    {t('common.save')}
                  </PandaButton>
                </Box>
              </PandaCard>
            </motion.div>
          )}

          {activeTab === 2 && (
            <motion.div variants={slideUp}>
              <PandaCard
                title={t('accountSettings.notifications')}
                gradient
                animation
              >
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={security.emailNotifications}
                          onChange={handleSecurityChange('emailNotifications')}
                        />
                      }
                      label={t('accountSettings.emailNotifications')}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={security.smsNotifications}
                          onChange={handleSecurityChange('smsNotifications')}
                        />
                      }
                      label={t('accountSettings.smsNotifications')}
                    />
                  </Grid>
                </Grid>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
                  <PandaButton
                    variant="contained"
                    onClick={handleSave}
                    disabled={isLoading}
                  >
                    {t('common.save')}
                  </PandaButton>
                </Box>
              </PandaCard>
            </motion.div>
          )}
        </motion.div>
      </Container>
    </Box>
  );
};

export default AccountSettings; 