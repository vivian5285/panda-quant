import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  Switch,
  InputAdornment,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  AttachMoney as AttachMoneyIcon,
  Build as BuildIcon,
} from '@mui/icons-material';

const SystemSettings: React.FC = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState({
    maintenanceMode: false,
    commissionRate: 0.1,
  });

  const handleSave = async () => {
    try {
      // TODO: Implement save settings
      console.log('Settings saved:', settings);
    } catch (err) {
      console.error('Failed to save settings:', err);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <BuildIcon sx={{ color: '#00FFB8', mr: 1 }} />
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  color: '#333333',
                }}
              >
                {t('systemSettings')}
              </Typography>
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                {t('maintenanceMode')}
              </Typography>
              <Switch
                checked={settings.maintenanceMode}
                onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                sx={{
                  '& .MuiSwitch-thumb': {
                    bgcolor: settings.maintenanceMode ? '#00FFB8' : '#fff',
                  },
                  '& .MuiSwitch-track': {
                    bgcolor: settings.maintenanceMode ? 'rgba(0, 255, 184, 0.3)' : 'rgba(0, 0, 0, 0.1)',
                  },
                }}
              />
            </Box>
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" sx={{ mb: 1 }}>
                {t('commissionRate')}
              </Typography>
              <TextField
                type="number"
                value={settings.commissionRate}
                onChange={(e) => setSettings({ ...settings, commissionRate: parseFloat(e.target.value) })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AttachMoneyIcon sx={{ color: '#00FFB8' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&:hover fieldset': {
                      borderColor: '#00FFB8',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#00FFB8',
                    },
                  },
                }}
              />
            </Box>
            <Button
              variant="contained"
              onClick={handleSave}
              sx={{
                bgcolor: '#00FFB8',
                color: '#000000',
                '&:hover': {
                  bgcolor: '#00CC93',
                  transform: 'translateY(-2px)',
                },
                transition: 'all 0.3s ease',
              }}
            >
              {t('save')}
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </Box>
  );
};

export default SystemSettings; 