import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Grid,
  TextField,
  FormControlLabel,
  Switch,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Container,
} from '@mui/material';
import { Delete as DeleteIcon, Add as AddIcon } from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { motion } from 'framer-motion';
import PandaCard from '../components/common/PandaCard';
import PandaButton from '../components/common/PandaButton';
import { PandaAlert } from '../components/common/PandaAlert';
import { fadeIn, slideUp, staggerChildren } from '../animations';

interface ApiSecuritySettings {
  ipWhitelist: string[];
  enable2FA: boolean;
  apiKeyExpiry: number;
  maxRequestsPerMinute: number;
}

const ApiSecuritySettings: React.FC = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const [settings, setSettings] = useState<ApiSecuritySettings>({
    ipWhitelist: [],
    enable2FA: false,
    apiKeyExpiry: 30,
    maxRequestsPerMinute: 60,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [newIp, setNewIp] = useState('');
  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      // TODO: 调用后端API获取设置
      const response = await fetch('/api/security-settings');
      const data = await response.json();
      setSettings(data);
    } catch (err) {
      setError(t('apiSecurity.fetchError'));
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = async () => {
    try {
      setLoading(true);
      // TODO: 调用后端API保存设置
      await fetch('/api/security-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      setSuccess(t('apiSecurity.saveSuccess'));
    } catch (err) {
      setError(t('apiSecurity.saveError'));
    } finally {
      setLoading(false);
    }
  };

  const handleAddIp = () => {
    if (newIp && !settings.ipWhitelist.includes(newIp)) {
      setSettings({
        ...settings,
        ipWhitelist: [...settings.ipWhitelist, newIp],
      });
      setNewIp('');
      setOpenDialog(false);
    }
  };

  const handleRemoveIp = (ip: string) => {
    setSettings({
      ...settings,
      ipWhitelist: settings.ipWhitelist.filter((i) => i !== ip),
    });
  };

  const handleToggle2FA = () => {
    setSettings({
      ...settings,
      enable2FA: !settings.enable2FA,
    });
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
              {t('apiSecurity.title')}
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

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <motion.div variants={slideUp}>
                <PandaCard
                  title={t('apiSecurity.ipWhitelist')}
                  gradient
                  animation
                >
                  <List>
                    {settings.ipWhitelist.map((ip) => (
                      <ListItem
                        key={ip}
                        secondaryAction={
                          <IconButton edge="end" onClick={() => handleRemoveIp(ip)}>
                            <DeleteIcon />
                          </IconButton>
                        }
                      >
                        <ListItemText primary={ip} />
                      </ListItem>
                    ))}
                  </List>
                  <PandaButton
                    variant="outlined"
                    startIcon={<AddIcon />}
                    onClick={() => setOpenDialog(true)}
                    sx={{ mt: 2 }}
                  >
                    {t('apiSecurity.addIp')}
                  </PandaButton>
                </PandaCard>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={6}>
              <motion.div variants={slideUp}>
                <PandaCard
                  title={t('apiSecurity.securitySettings')}
                  gradient
                  animation
                >
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.enable2FA}
                        onChange={handleToggle2FA}
                      />
                    }
                    label={t('apiSecurity.enable2FA')}
                  />
                  <TextField
                    fullWidth
                    type="number"
                    label={t('apiSecurity.apiKeyExpiry')}
                    value={settings.apiKeyExpiry}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        apiKeyExpiry: parseInt(e.target.value),
                      })
                    }
                    sx={{ mt: 2 }}
                  />
                  <TextField
                    fullWidth
                    type="number"
                    label={t('apiSecurity.maxRequests')}
                    value={settings.maxRequestsPerMinute}
                    onChange={(e) =>
                      setSettings({
                        ...settings,
                        maxRequestsPerMinute: parseInt(e.target.value),
                      })
                    }
                    sx={{ mt: 2 }}
                  />
                </PandaCard>
              </motion.div>
            </Grid>
          </Grid>

          <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
            <PandaButton
              variant="contained"
              onClick={handleSaveSettings}
              disabled={loading}
            >
              {t('common.save')}
            </PandaButton>
          </Box>
        </motion.div>
      </Container>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('apiSecurity.addIp')}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label={t('apiSecurity.ipAddress')}
            fullWidth
            value={newIp}
            onChange={(e) => setNewIp(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <PandaButton onClick={() => setOpenDialog(false)}>
            {t('common.cancel')}
          </PandaButton>
          <PandaButton onClick={handleAddIp} variant="contained">
            {t('common.add')}
          </PandaButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ApiSecuritySettings; 