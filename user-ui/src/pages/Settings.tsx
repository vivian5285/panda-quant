import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Tabs,
  Tab,
  Divider,
  Switch,
  FormControlLabel,
  Button,
  TextField,
  Alert,
} from '@mui/material';
import {
  AccountCircle as AccountIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Language as LanguageIcon,
  Palette as PaletteIcon,
} from '@mui/icons-material';

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
      id={`settings-tabpanel-${index}`}
      aria-labelledby={`settings-tab-${index}`}
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

const Settings: React.FC = () => {
  const [currentTab, setCurrentTab] = useState(0);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('zh');
  const [saved, setSaved] = useState(false);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setCurrentTab(newValue);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 600 }}>
        设置
      </Typography>
      <Paper sx={{ mt: 3 }}>
        <Tabs
          value={currentTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              minHeight: 64,
              fontSize: '1rem',
            },
          }}
        >
          <Tab icon={<AccountIcon />} label="账户设置" />
          <Tab icon={<SecurityIcon />} label="安全设置" />
          <Tab icon={<NotificationsIcon />} label="通知设置" />
          <Tab icon={<LanguageIcon />} label="语言设置" />
          <Tab icon={<PaletteIcon />} label="主题设置" />
        </Tabs>

        <TabPanel value={currentTab} index={0}>
          <Typography variant="h6" gutterBottom>
            个人信息
          </Typography>
          <Box component="form" sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label="用户名"
              margin="normal"
              defaultValue="PandaUser"
            />
            <TextField
              fullWidth
              label="邮箱"
              margin="normal"
              defaultValue="user@example.com"
            />
            <TextField
              fullWidth
              label="手机号"
              margin="normal"
              defaultValue="+86 123 4567 8900"
            />
            <Button
              variant="contained"
              sx={{
                mt: 3,
                bgcolor: '#00FFB8',
                color: '#000000',
                '&:hover': { bgcolor: '#00CC93' },
              }}
              onClick={handleSave}
            >
              保存修改
            </Button>
          </Box>
        </TabPanel>

        <TabPanel value={currentTab} index={1}>
          <Typography variant="h6" gutterBottom>
            安全设置
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button
              variant="outlined"
              sx={{
                mb: 2,
                color: '#00FFB8',
                borderColor: '#00FFB8',
                '&:hover': {
                  borderColor: '#00CC93',
                  color: '#00CC93',
                },
              }}
            >
              修改密码
            </Button>
            <Button
              variant="outlined"
              sx={{
                ml: 2,
                mb: 2,
                color: '#00FFB8',
                borderColor: '#00FFB8',
                '&:hover': {
                  borderColor: '#00CC93',
                  color: '#00CC93',
                },
              }}
            >
              设置二次验证
            </Button>
          </Box>
        </TabPanel>

        <TabPanel value={currentTab} index={2}>
          <Typography variant="h6" gutterBottom>
            通知设置
          </Typography>
          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={emailNotifications}
                  onChange={(e) => setEmailNotifications(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#00FFB8',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#00FFB8',
                    },
                  }}
                />
              }
              label="邮件通知"
            />
            <Divider sx={{ my: 2 }} />
            <FormControlLabel
              control={
                <Switch
                  checked={pushNotifications}
                  onChange={(e) => setPushNotifications(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#00FFB8',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#00FFB8',
                    },
                  }}
                />
              }
              label="推送通知"
            />
          </Box>
        </TabPanel>

        <TabPanel value={currentTab} index={3}>
          <Typography variant="h6" gutterBottom>
            语言设置
          </Typography>
          <Box sx={{ mt: 2 }}>
            <Button
              variant={language === 'zh' ? 'contained' : 'outlined'}
              onClick={() => setLanguage('zh')}
              sx={{
                mr: 2,
                bgcolor: language === 'zh' ? '#00FFB8' : 'transparent',
                color: language === 'zh' ? '#000000' : '#00FFB8',
                borderColor: '#00FFB8',
                '&:hover': {
                  bgcolor: language === 'zh' ? '#00CC93' : 'rgba(0, 255, 184, 0.1)',
                  borderColor: '#00CC93',
                },
              }}
            >
              中文
            </Button>
            <Button
              variant={language === 'en' ? 'contained' : 'outlined'}
              onClick={() => setLanguage('en')}
              sx={{
                bgcolor: language === 'en' ? '#00FFB8' : 'transparent',
                color: language === 'en' ? '#000000' : '#00FFB8',
                borderColor: '#00FFB8',
                '&:hover': {
                  bgcolor: language === 'en' ? '#00CC93' : 'rgba(0, 255, 184, 0.1)',
                  borderColor: '#00CC93',
                },
              }}
            >
              English
            </Button>
          </Box>
        </TabPanel>

        <TabPanel value={currentTab} index={4}>
          <Typography variant="h6" gutterBottom>
            主题设置
          </Typography>
          <Box sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={darkMode}
                  onChange={(e) => setDarkMode(e.target.checked)}
                  sx={{
                    '& .MuiSwitch-switchBase.Mui-checked': {
                      color: '#00FFB8',
                    },
                    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                      backgroundColor: '#00FFB8',
                    },
                  }}
                />
              }
              label="深色模式"
            />
          </Box>
        </TabPanel>
      </Paper>

      {saved && (
        <Alert
          severity="success"
          sx={{
            position: 'fixed',
            bottom: 24,
            right: 24,
            zIndex: 9999,
          }}
        >
          设置已保存
        </Alert>
      )}
    </Container>
  );
};

export default Settings; 