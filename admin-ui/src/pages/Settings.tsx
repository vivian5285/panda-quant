import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
} from '@mui/material';
import { useTranslation } from 'react-i18next';

interface Settings {
  apiKey: string;
  apiSecret: string;
  theme: string;
}

const Settings: React.FC = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<Settings>({
    apiKey: '',
    apiSecret: '',
    theme: 'light',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      const data = await response.json();
      setSettings({
        apiKey: data.apiKey || '',
        apiSecret: data.apiSecret || '',
        theme: data.theme || 'light',
      });
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
  };

  const handleSave = async () => {
    try {
      await fetch('/api/settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {t('settings.title')}
      </Typography>
      <Paper sx={{ p: 3 }}>
        <TextField
          fullWidth
          label={t('settings.apiKey')}
          value={settings.apiKey}
          onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
          margin="normal"
        />
        <TextField
          fullWidth
          label={t('settings.apiSecret')}
          value={settings.apiSecret}
          onChange={(e) => setSettings({ ...settings, apiSecret: e.target.value })}
          margin="normal"
        />
        <Button
          variant="contained"
          onClick={handleSave}
          sx={{ mt: 2 }}
        >
          {t('common.save')}
        </Button>
      </Paper>
    </Box>
  );
};

export default Settings; 