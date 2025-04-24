import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  LinearProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Divider,
  Switch,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Save as SaveIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  Settings as SettingsIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Storage as StorageIcon,
} from '@mui/icons-material';
import { theme } from '../theme';
import { animationConfig } from '../theme/animation';
import PageLayout from '../components/common/PageLayout';

interface SystemSetting {
  id: string;
  category: 'general' | 'security' | 'notification' | 'storage';
  name: string;
  description: string;
  value: string | number | boolean;
  type: 'string' | 'number' | 'boolean' | 'select';
  options?: string[];
}

const SystemSettings: React.FC = () => {
  const { t } = useTranslation();
  const [settings, setSettings] = useState<SystemSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSetting, setSelectedSetting] = useState<SystemSetting | null>(null);
  const [editedValue, setEditedValue] = useState<string | number | boolean>('');

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      // Mock API call
      const mockSettings: SystemSetting[] = [
        {
          id: '1',
          category: 'general',
          name: 'siteName',
          description: 'Website name',
          value: 'Panda Quant',
          type: 'string',
        },
        {
          id: '2',
          category: 'security',
          name: 'passwordPolicy',
          description: 'Password policy',
          value: 'strong',
          type: 'select',
          options: ['weak', 'medium', 'strong'],
        },
        {
          id: '3',
          category: 'notification',
          name: 'emailNotifications',
          description: 'Enable email notifications',
          value: true,
          type: 'boolean',
        },
        {
          id: '4',
          category: 'storage',
          name: 'maxStorage',
          description: 'Maximum storage per user (GB)',
          value: 10,
          type: 'number',
        },
      ];
      setSettings(mockSettings);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: SystemSetting['category']) => {
    switch (category) {
      case 'general':
        return <SettingsIcon />;
      case 'security':
        return <SecurityIcon />;
      case 'notification':
        return <NotificationsIcon />;
      case 'storage':
        return <StorageIcon />;
      default:
        return <SettingsIcon />;
    }
  };

  const getCategoryColor = (category: SystemSetting['category']) => {
    switch (category) {
      case 'general':
        return theme.palette.primary.main;
      case 'security':
        return theme.palette.error.main;
      case 'notification':
        return theme.palette.warning.main;
      case 'storage':
        return theme.palette.info.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  const handleEdit = (setting: SystemSetting) => {
    setSelectedSetting(setting);
    setEditedValue(setting.value);
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (selectedSetting) {
      const updatedSettings = settings.map((setting) =>
        setting.id === selectedSetting.id ? { ...setting, value: editedValue } : setting
      );
      setSettings(updatedSettings);
      setOpenDialog(false);
      setSelectedSetting(null);
    }
  };

  const renderSettingCard = (setting: SystemSetting) => (
    <motion.div
      key={setting.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: animationConfig.duration.medium }}
    >
      <Card
        sx={{
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[2],
          '&:hover': {
            boxShadow: theme.shadows[4],
          },
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  color: getCategoryColor(setting.category),
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {getCategoryIcon(setting.category)}
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                {setting.name}
              </Typography>
            </Box>
            <Tooltip title={t('systemSettings.edit')}>
              <IconButton onClick={() => handleEdit(setting)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {setting.description}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Typography variant="body2" color="text.secondary">
              {t('systemSettings.value')}
            </Typography>
            {setting.type === 'boolean' ? (
              <Switch
                checked={setting.value as boolean}
                disabled
                sx={{
                  '& .MuiSwitch-thumb': {
                    backgroundColor: setting.value ? theme.palette.success.main : theme.palette.error.main,
                  },
                }}
              />
            ) : (
              <Chip
                label={setting.value.toString()}
                sx={{
                  bgcolor: `${getCategoryColor(setting.category)}20`,
                  color: getCategoryColor(setting.category),
                  fontWeight: 500,
                }}
              />
            )}
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderContent = () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
      {settings.map(renderSettingCard)}
    </Box>
  );

  const renderActions = () => (
    <Button
      variant="contained"
      startIcon={<RefreshIcon />}
      onClick={fetchSettings}
      sx={{
        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        '&:hover': {
          background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
        },
      }}
    >
      {t('systemSettings.refresh')}
    </Button>
  );

  const renderSettingInput = (setting: SystemSetting) => {
    switch (setting.type) {
      case 'string':
        return (
          <TextField
            fullWidth
            value={editedValue}
            onChange={(e) => setEditedValue(e.target.value)}
            label={t('systemSettings.value')}
          />
        );
      case 'number':
        return (
          <TextField
            fullWidth
            type="number"
            value={editedValue}
            onChange={(e) => setEditedValue(Number(e.target.value))}
            label={t('systemSettings.value')}
          />
        );
      case 'boolean':
        return (
          <FormControl fullWidth>
            <InputLabel>{t('systemSettings.value')}</InputLabel>
            <Select
              value={editedValue}
              onChange={(e) => setEditedValue(e.target.value === 'true')}
              label={t('systemSettings.value')}
            >
              <MenuItem value="true">{t('common.yes')}</MenuItem>
              <MenuItem value="false">{t('common.no')}</MenuItem>
            </Select>
          </FormControl>
        );
      case 'select':
        return (
          <FormControl fullWidth>
            <InputLabel>{t('systemSettings.value')}</InputLabel>
            <Select
              value={editedValue}
              onChange={(e) => setEditedValue(e.target.value)}
              label={t('systemSettings.value')}
            >
              {setting.options?.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      default:
        return null;
    }
  };

  return (
    <PageLayout
      title={t('systemSettings.title')}
      actions={renderActions()}
      content={renderContent()}
    >
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('systemSettings.editSetting')}</DialogTitle>
        <DialogContent>
          {selectedSetting && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedSetting.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {selectedSetting.description}
              </Typography>
              {renderSettingInput(selectedSetting)}
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{
              color: theme.palette.text.secondary,
              '&:hover': {
                backgroundColor: `${theme.palette.text.secondary}10`,
              },
            }}
          >
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              '&:hover': {
                background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
              },
            }}
          >
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  );
};

export default SystemSettings; 