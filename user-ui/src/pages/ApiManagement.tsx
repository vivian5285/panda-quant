import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Alert,
  CircularProgress,
  Paper,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  useTheme,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Snackbar,
  Tooltip,
  LinearProgress
} from '@mui/material';
import {
  Security as SecurityIcon,
  VpnKey as VpnKeyIcon,
  Settings as SettingsIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  CheckCircle as CheckCircleIcon,
  Error as ErrorIcon,
  Edit as EditIcon,
  Lock as LockIcon,
  Public as PublicIcon,
  Link as LinkIcon,
  Warning as WarningIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { themeUtils } from '../theme';
import PandaCard from '../components/common/PandaCard';
import PandaButton from '../components/common/PandaButton';
import { PandaAlert as PandaAlertComponent } from '../components/common/PandaAlert';
import { PandaProgress } from '../components/common/PandaProgress';
import PandaTable from '../components/common/PandaTable';
import { PandaChip } from '../components/common/PandaChip';
import apiService from '../services/apiService';
import { fadeIn, slideUp, staggerChildren } from '../animations';

interface ApiKey {
  id: string;
  name: string;
  exchange: string;
  apiKey: string;
  secretKey: string;
  status: 'active' | 'inactive';
  createdAt: string;
  lastUsed: string;
  permissions: string[];
}

interface SecuritySettings {
  ipWhitelist: string[];
  require2FA: boolean;
  autoDisconnect: boolean;
  sessionTimeout: number;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`api-tabpanel-${index}`}
      aria-labelledby={`api-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}

const ApiManagement: React.FC = () => {
  const theme = useTheme();
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'Binance Main',
      exchange: 'binance',
      apiKey: '********',
      secretKey: '********',
      status: 'active',
      createdAt: '2024-01-01',
      lastUsed: '2024-01-15',
      permissions: [],
    },
    {
      id: '2',
      name: 'OKX Trading',
      exchange: 'okx',
      apiKey: '********',
      secretKey: '********',
      status: 'inactive',
      createdAt: '2024-01-05',
      lastUsed: '2024-01-10',
      permissions: [],
    },
  ]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [securitySettings, setSecuritySettings] = useState<SecuritySettings>({
    ipWhitelist: ['192.168.1.1', '10.0.0.1'],
    require2FA: true,
    autoDisconnect: true,
    sessionTimeout: 30,
  });
  const [showAddApiDialog, setShowAddApiDialog] = useState(false);
  const [newApiKey, setNewApiKey] = useState<Partial<ApiKey>>({
    exchange: '',
    apiKey: '',
    secretKey: '',
    permissions: [],
  });
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentApiKey, setCurrentApiKey] = useState<Partial<ApiKey>>({});
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
  const [selectedApiKey, setSelectedApiKey] = useState<ApiKey | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      fetchApiKeys();
    }
  }, [isAuthenticated]);

  const fetchApiKeys = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/connect', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      
      if (!response.ok) {
        throw new Error(t('api.errors.fetchFailed'));
      }

      const data = await response.json();
      setApiKeys(data);
    } catch (error) {
      setError(t('api.errors.fetchFailed'));
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleAddApi = () => {
    const newApi: ApiKey = {
      id: String(apiKeys.length + 1),
      name: newApiKey.name || '',
      exchange: newApiKey.exchange || '',
      apiKey: newApiKey.apiKey || '',
      secretKey: newApiKey.secretKey || '',
      permissions: newApiKey.permissions || [],
      status: 'active',
      createdAt: new Date().toISOString(),
      lastUsed: new Date().toISOString(),
    };
    setApiKeys([...apiKeys, newApi]);
    setShowAddApiDialog(false);
    setNewApiKey({
      exchange: '',
      apiKey: '',
      secretKey: '',
      permissions: [],
    });
  };

  const handleDeleteApi = (id: string) => {
    setApiKeys(apiKeys.filter(api => api.id !== id));
  };

  const handleSecuritySettingChange = (setting: keyof SecuritySettings, value: any) => {
    setSecuritySettings(prev => ({
      ...prev,
      [setting]: value,
    }));
  };

  const getStatusColor = (status: ApiKey['status']) => {
    switch (status) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'warning';
      default:
        return 'default';
    }
  };

  const handleAddApiKey = () => {
    setIsEditMode(false);
    setCurrentApiKey({});
    setIsDialogOpen(true);
  };

  const handleEditApiKey = (apiKey: ApiKey) => {
    setIsEditMode(true);
    setCurrentApiKey(apiKey);
    setIsDialogOpen(true);
  };

  const handleSaveApiKey = () => {
    if (isEditMode) {
      setApiKeys(apiKeys.map(key => 
        key.id === currentApiKey.id ? { ...key, ...currentApiKey } : key
      ));
    } else {
      const newApiKey: ApiKey = {
        id: Date.now().toString(),
        name: currentApiKey.name || '',
        exchange: currentApiKey.exchange || '',
        apiKey: currentApiKey.apiKey || '',
        secretKey: currentApiKey.secretKey || '',
        status: 'active',
        createdAt: new Date().toISOString(),
        lastUsed: new Date().toISOString(),
        permissions: currentApiKey.permissions || [],
      };
      setApiKeys([...apiKeys, newApiKey]);
    }
    setSnackbar({
      open: true,
      message: isEditMode ? t('apiManagement.apiKeyUpdated') : t('apiManagement.apiKeyAdded'),
      severity: 'success',
    });
    handleDialogClose();
  };

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    setCurrentApiKey({});
  };

  const handleInputChange = (field: keyof ApiKey, value: string) => {
    setCurrentApiKey(prev => ({ ...prev, [field]: value }));
  };

  if (!isAuthenticated) {
    return (
      <Box sx={{ p: 3 }}>
        <PandaAlertComponent severity="warning" message={t('api.authRequired')} />
      </Box>
    );
  }

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <LinearProgress sx={{ width: '100%', maxWidth: 400 }} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <PandaAlertComponent severity="error" message={error} />
      </Box>
    );
  }

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
              {t('api.title')}
            </Typography>
          </motion.div>

          <Grid container spacing={3}>
            <Grid item xs={12}>
              <motion.div variants={slideUp}>
                <PandaCard
                  title="API Keys"
                  gradient
                  animation
                >
                  <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
                    <PandaButton
                      variant="contained"
                      onClick={() => setShowAddApiDialog(true)}
                      startIcon={<LinkIcon />}
                    >
                      {t('api.addKey')}
                    </PandaButton>
                  </Box>

                  <PandaTable
                    columns={[
                      { id: 'exchange', label: t('api.exchange'), minWidth: 170 },
                      { id: 'name', label: t('api.name'), minWidth: 100 },
                      { id: 'status', label: t('api.status'), minWidth: 170 },
                      { id: 'actions', label: t('api.actions'), minWidth: 100 }
                    ]}
                    data={apiKeys.map(key => ({
                      ...key,
                      status: (
                        <PandaChip
                          icon={key.status === 'active' ? <LinkIcon /> : <WarningIcon />}
                          label={key.status}
                          color={getStatusColor(key.status)}
                          size="small"
                        />
                      ),
                      actions: (
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedApiKey(key);
                            setIsEditMode(true);
                            setIsDialogOpen(true);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      )
                    }))}
                  />
                </PandaCard>
              </motion.div>
            </Grid>

            <Grid item xs={12}>
              <motion.div variants={slideUp}>
                <PandaCard
                  title="Security Settings"
                  gradient
                  animation
                >
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <PandaCard>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {t('api.security.ipWhitelist')}
                          </Typography>
                          <TextField
                            fullWidth
                            multiline
                            rows={4}
                            value={securitySettings.ipWhitelist.join('\n')}
                            onChange={(e) =>
                              handleSecuritySettingChange(
                                'ipWhitelist',
                                e.target.value.split('\n')
                              )
                            }
                            placeholder={t('api.security.ipWhitelistPlaceholder')}
                          />
                        </CardContent>
                      </PandaCard>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <PandaCard>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {t('api.security.require2FA')}
                          </Typography>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={securitySettings.require2FA}
                                onChange={(e) =>
                                  handleSecuritySettingChange('require2FA', e.target.checked)
                                }
                              />
                            }
                            label={t('api.security.require2FALabel')}
                          />
                        </CardContent>
                      </PandaCard>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <PandaCard>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {t('api.security.autoDisconnect')}
                          </Typography>
                          <FormControlLabel
                            control={
                              <Switch
                                checked={securitySettings.autoDisconnect}
                                onChange={(e) =>
                                  handleSecuritySettingChange(
                                    'autoDisconnect',
                                    e.target.checked
                                  )
                                }
                              />
                            }
                            label={t('api.security.autoDisconnectLabel')}
                          />
                        </CardContent>
                      </PandaCard>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <PandaCard>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {t('api.security.sessionTimeout')}
                          </Typography>
                          <FormControl fullWidth>
                            <InputLabel>{t('api.security.sessionTimeoutLabel')}</InputLabel>
                            <Select
                              value={securitySettings.sessionTimeout}
                              onChange={(e) =>
                                handleSecuritySettingChange(
                                  'sessionTimeout',
                                  Number(e.target.value)
                                )
                              }
                            >
                              <MenuItem value={15}>15 minutes</MenuItem>
                              <MenuItem value={30}>30 minutes</MenuItem>
                              <MenuItem value={60}>60 minutes</MenuItem>
                            </Select>
                          </FormControl>
                        </CardContent>
                      </PandaCard>
                    </Grid>
                  </Grid>
                </PandaCard>
              </motion.div>
            </Grid>
          </Grid>
        </motion.div>
      </Container>

      {/* Add API Key Dialog */}
      <Dialog open={showAddApiDialog} onClose={() => setShowAddApiDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('apiManagement.addKey')}</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <TextField
              fullWidth
              label={t('apiManagement.keyName')}
              value={newApiKey.name || ''}
              onChange={(e) => setNewApiKey({ ...newApiKey, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>{t('apiManagement.exchange')}</InputLabel>
              <Select
                value={newApiKey.exchange || ''}
                onChange={(e) => setNewApiKey({ ...newApiKey, exchange: e.target.value })}
                label={t('apiManagement.exchange')}
              >
                <MenuItem value="binance">Binance</MenuItem>
                <MenuItem value="okx">OKX</MenuItem>
                <MenuItem value="huobi">Huobi</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label={t('apiManagement.apiKey')}
              value={newApiKey.apiKey || ''}
              onChange={(e) => setNewApiKey({ ...newApiKey, apiKey: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              label={t('apiManagement.apiSecret')}
              value={newApiKey.secretKey || ''}
              onChange={(e) => setNewApiKey({ ...newApiKey, secretKey: e.target.value })}
              type="password"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowAddApiDialog(false)}>
            {t('common.cancel')}
          </Button>
          <PandaButton variant="contained" onClick={handleAddApi}>
            {t('common.save')}
          </PandaButton>
        </DialogActions>
      </Dialog>

      {/* Edit API Key Dialog */}
      <Dialog open={isDialogOpen} onClose={handleDialogClose} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isEditMode ? t('apiManagement.editApiKey') : t('apiManagement.addApiKey')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label={t('apiManagement.name')}
              value={currentApiKey.name || ''}
              onChange={(e) => handleInputChange('name', e.target.value)}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>{t('apiManagement.exchange')}</InputLabel>
              <Select
                value={currentApiKey.exchange || ''}
                onChange={(e) => handleInputChange('exchange', e.target.value)}
                label={t('apiManagement.exchange')}
              >
                <MenuItem value="binance">Binance</MenuItem>
                <MenuItem value="okx">OKX</MenuItem>
                <MenuItem value="huobi">Huobi</MenuItem>
              </Select>
            </FormControl>
            <TextField
              label={t('apiManagement.apiKey')}
              value={currentApiKey.apiKey || ''}
              onChange={(e) => handleInputChange('apiKey', e.target.value)}
              fullWidth
            />
            <TextField
              label={t('apiManagement.apiSecret')}
              value={currentApiKey.secretKey || ''}
              onChange={(e) => handleInputChange('secretKey', e.target.value)}
              fullWidth
              type="password"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDialogClose}>{t('common.cancel')}</Button>
          <PandaButton onClick={handleSaveApiKey} variant="contained">
            {t('common.save')}
          </PandaButton>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
      >
        <PandaAlert
          onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </PandaAlert>
      </Snackbar>
    </Box>
  );
};

export default ApiManagement; 