import React, { useState } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Switch,
  FormControlLabel,
  Divider,
  useTheme,
} from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

const SettingsPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [settings, setSettings] = useState({
    systemName: 'PandaQuant Admin',
    systemVersion: '1.0.0',
    maintenanceMode: false,
    emailNotifications: true,
    smsNotifications: false,
    apiRateLimit: 100,
    sessionTimeout: 30,
    backupFrequency: 'daily',
    logRetention: 30,
  });

  const handleChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // TODO: Implement save settings to backend
    console.log('Saving settings:', settings);
  };

  return (
    <Box
      sx={{
        py: { xs: 3, md: 4 },
        overflow: 'hidden',
        bgcolor: '#FFFFFF',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(0, 255, 184, 0.03) 0%, rgba(0, 0, 0, 0) 100%)',
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h2"
            sx={{
              color: '#00FFB8',
              fontWeight: 700,
              mb: 1,
              textAlign: 'center',
              fontSize: { xs: '1.8rem', md: '2.2rem' },
              fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
            }}
          >
            {t('settings.title')}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              textAlign: 'center',
              mb: 3,
              fontSize: '0.9rem',
              opacity: 0.8,
            }}
          >
            {t('settings.subtitle')}
          </Typography>
        </motion.div>

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: '#FFFFFF',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 32px rgba(0, 255, 184, 0.1)',
                  border: '1px solid rgba(0, 255, 184, 0.2)',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 40px rgba(0, 255, 184, 0.15)',
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {t('settings.system')}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label={t('settings.systemName')}
                        value={settings.systemName}
                        onChange={handleChange('systemName')}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        label={t('settings.systemVersion')}
                        value={settings.systemVersion}
                        onChange={handleChange('systemVersion')}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.maintenanceMode}
                            onChange={handleChange('maintenanceMode')}
                          />
                        }
                        label={t('settings.maintenanceMode')}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: '#FFFFFF',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 32px rgba(0, 255, 184, 0.1)',
                  border: '1px solid rgba(0, 255, 184, 0.2)',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 40px rgba(0, 255, 184, 0.15)',
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {t('settings.notifications')}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.emailNotifications}
                            onChange={handleChange('emailNotifications')}
                          />
                        }
                        label={t('settings.emailNotifications')}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={settings.smsNotifications}
                            onChange={handleChange('smsNotifications')}
                          />
                        }
                        label={t('settings.smsNotifications')}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: '#FFFFFF',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 32px rgba(0, 255, 184, 0.1)',
                  border: '1px solid rgba(0, 255, 184, 0.2)',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 40px rgba(0, 255, 184, 0.15)',
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {t('settings.security')}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        type="number"
                        label={t('settings.apiRateLimit')}
                        value={settings.apiRateLimit}
                        onChange={handleChange('apiRateLimit')}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        type="number"
                        label={t('settings.sessionTimeout')}
                        value={settings.sessionTimeout}
                        onChange={handleChange('sessionTimeout')}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card
                sx={{
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  background: '#FFFFFF',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 32px rgba(0, 255, 184, 0.1)',
                  border: '1px solid rgba(0, 255, 184, 0.2)',
                  borderRadius: '12px',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    transform: 'translateY(-5px)',
                    boxShadow: '0 12px 40px rgba(0, 255, 184, 0.15)',
                  },
                }}
              >
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    {t('settings.backup')}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        select
                        label={t('settings.backupFrequency')}
                        value={settings.backupFrequency}
                        onChange={handleChange('backupFrequency')}
                        SelectProps={{
                          native: true,
                        }}
                      >
                        <option value="hourly">Hourly</option>
                        <option value="daily">Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="monthly">Monthly</option>
                      </TextField>
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        type="number"
                        label={t('settings.logRetention')}
                        value={settings.logRetention}
                        onChange={handleChange('logRetention')}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid item xs={12}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                <Button
                  variant="contained"
                  onClick={handleSave}
                  sx={{
                    bgcolor: '#00FFB8',
                    color: '#000',
                    '&:hover': {
                      bgcolor: '#00E6A5',
                    },
                  }}
                >
                  {t('settings.save')}
                </Button>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default SettingsPage; 