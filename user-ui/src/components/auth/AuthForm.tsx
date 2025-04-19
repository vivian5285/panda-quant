import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  Stack,
  CircularProgress,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@mui/material';
import { 
  Visibility, 
  VisibilityOff, 
  Email as EmailIcon, 
  Lock as LockIcon, 
  Person as PersonIcon,
  Send as SendIcon,
  Wallet as WalletIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon,
  Security as SecurityIcon,
} from '@mui/icons-material';
import axios from 'axios';
import { motion } from 'framer-motion';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount, useConnect, useDisconnect } from 'wagmi';

interface AuthFormProps {
  mode: 'login' | 'register';
  onSubmit: (data: { 
    email: string; 
    password: string; 
    confirmPassword?: string;
    username?: string;
    verificationCode?: string;
  }) => void;
  error?: string;
  loading?: boolean;
}

const AuthForm: React.FC<AuthFormProps> = ({ mode, onSubmit, error, loading = false }) => {
  const { t } = useTranslation();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [verificationCodeSent, setVerificationCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showWalletDialog, setShowWalletDialog] = useState(false);
  const { open } = useWeb3Modal();
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    verificationCode: '',
  });
  const [apiError, setApiError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setApiError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleSendVerificationCode = async () => {
    try {
      setApiError(null);
      await axios.post('http://localhost:3000/api/verification/send', {
        email: formData.email,
        type: 'register'
      });
      
      setVerificationCodeSent(true);
      setCountdown(60);
      const timer = setInterval(() => {
        setCountdown(prev => {
          if (prev <= 1) {
            clearInterval(timer);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setApiError(error.response?.data?.message || '发送验证码失败');
      } else {
        setApiError('发送验证码失败');
      }
    }
  };

  const handleWalletLogin = () => {
    setShowWalletDialog(true);
  };

  const handleConnectWallet = async (walletType: string) => {
    try {
      await open();
      // 这里可以添加钱包连接成功后的处理逻辑
    } catch (error) {
      console.error('Wallet connection failed:', error);
    }
  };

  const handleCloseWalletDialog = () => {
    setShowWalletDialog(false);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      {error && (
        <Typography
          color="error"
          sx={{
            mb: 2,
            p: 1,
            borderRadius: 1,
            bgcolor: 'rgba(255, 0, 0, 0.1)',
            textAlign: 'center',
          }}
        >
          {error}
        </Typography>
      )}

      {mode === 'register' && (
        <TextField
          fullWidth
          label="用户名"
          name="username"
          value={formData.username}
          onChange={handleChange}
          margin="normal"
          required
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <PersonIcon sx={{ color: '#00FFB8' }} />
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(0, 255, 184, 0.5)',
              },
              '&:hover fieldset': {
                borderColor: '#00FFB8',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#00FFB8',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#666666',
              '&.Mui-focused': {
                color: '#00FFB8',
              },
            },
            '& .MuiInputBase-input': {
              color: '#333333',
            },
          }}
        />
      )}

      <TextField
        fullWidth
        label={mode === 'login' ? "邮箱或用户名" : "邮箱"}
        name="email"
        type={mode === 'login' ? 'text' : 'email'}
        value={formData.email}
        onChange={handleChange}
        margin="normal"
        required
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <EmailIcon sx={{ color: '#00FFB8' }} />
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(0, 255, 184, 0.5)',
            },
            '&:hover fieldset': {
              borderColor: '#00FFB8',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00FFB8',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#666666',
            '&.Mui-focused': {
              color: '#00FFB8',
            },
          },
          '& .MuiInputBase-input': {
            color: '#333333',
          },
        }}
      />

      {mode === 'register' && (
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            label="验证码"
            name="verificationCode"
            value={formData.verificationCode}
            onChange={handleChange}
            required
            error={!!apiError}
            helperText={apiError}
            sx={{
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: 'rgba(0, 255, 184, 0.5)',
                },
                '&:hover fieldset': {
                  borderColor: '#00FFB8',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#00FFB8',
                },
              },
              '& .MuiInputLabel-root': {
                color: '#666666',
                '&.Mui-focused': {
                  color: '#00FFB8',
                },
              },
              '& .MuiInputBase-input': {
                color: '#333333',
              },
            }}
          />
          <Button
            variant="outlined"
            onClick={handleSendVerificationCode}
            disabled={verificationCodeSent && countdown > 0}
            startIcon={<SendIcon />}
            sx={{ 
              minWidth: '120px',
              whiteSpace: 'nowrap',
            }}
          >
            {verificationCodeSent && countdown > 0 
              ? `${countdown}秒` 
              : "发送验证码"}
          </Button>
        </Stack>
      )}

      <TextField
        fullWidth
        label="密码"
        name="password"
        type={showPassword ? 'text' : 'password'}
        value={formData.password}
        onChange={handleChange}
        margin="normal"
        required
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <LockIcon sx={{ color: '#00FFB8' }} />
            </InputAdornment>
          ),
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? (
                  <VisibilityOff sx={{ color: '#00FFB8' }} />
                ) : (
                  <Visibility sx={{ color: '#00FFB8' }} />
                )}
              </IconButton>
            </InputAdornment>
          ),
        }}
        sx={{
          '& .MuiOutlinedInput-root': {
            '& fieldset': {
              borderColor: 'rgba(0, 255, 184, 0.5)',
            },
            '&:hover fieldset': {
              borderColor: '#00FFB8',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#00FFB8',
            },
          },
          '& .MuiInputLabel-root': {
            color: '#666666',
            '&.Mui-focused': {
              color: '#00FFB8',
            },
          },
          '& .MuiInputBase-input': {
            color: '#333333',
          },
        }}
      />

      {mode === 'register' && (
        <TextField
          fullWidth
          label="确认密码"
          name="confirmPassword"
          type={showConfirmPassword ? 'text' : 'password'}
          value={formData.confirmPassword}
          onChange={handleChange}
          margin="normal"
          required
          error={formData.password !== formData.confirmPassword && formData.confirmPassword !== ''}
          helperText={
            formData.password !== formData.confirmPassword && formData.confirmPassword !== ''
              ? "两次输入的密码不一致"
              : ''
          }
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockIcon sx={{ color: '#00FFB8' }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  edge="end"
                >
                  {showConfirmPassword ? (
                    <VisibilityOff sx={{ color: '#00FFB8' }} />
                  ) : (
                    <Visibility sx={{ color: '#00FFB8' }} />
                  )}
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: 'rgba(0, 255, 184, 0.5)',
              },
              '&:hover fieldset': {
                borderColor: '#00FFB8',
              },
              '&.Mui-focused fieldset': {
                borderColor: '#00FFB8',
              },
            },
            '& .MuiInputLabel-root': {
              color: '#666666',
              '&.Mui-focused': {
                color: '#00FFB8',
              },
            },
            '& .MuiInputBase-input': {
              color: '#333333',
            },
          }}
        />
      )}

      <Button
        type="submit"
        fullWidth
        variant="contained"
        disabled={loading}
        sx={{
          mt: 3,
          mb: 2,
          py: 1.5,
          bgcolor: '#00FFB8',
          color: '#000000',
          borderRadius: 2,
          fontSize: '1.1rem',
          fontWeight: 600,
          textTransform: 'none',
          transition: 'all 0.3s ease',
          '&:hover': {
            bgcolor: '#00CC93',
            transform: 'translateY(-2px)',
          },
          '&:disabled': {
            bgcolor: 'rgba(0, 255, 184, 0.5)',
          },
        }}
      >
        {loading ? (
          <CircularProgress size={24} sx={{ color: '#000000' }} />
        ) : (
          mode === 'login' ? '登录' : '注册'
        )}
      </Button>

      {mode === 'login' && (
        <>
          <Divider sx={{ my: 2 }}>或</Divider>

          <Button
            fullWidth
            variant="contained"
            onClick={handleWalletLogin}
            disabled={loading}
            startIcon={<WalletIcon />}
            sx={{
              py: 1.5,
              bgcolor: '#00FFB8',
              color: '#000000',
              borderRadius: 2,
              fontSize: '1.1rem',
              fontWeight: 600,
              textTransform: 'none',
              transition: 'all 0.3s ease',
              '&:hover': {
                bgcolor: '#00CC93',
                transform: 'translateY(-2px)',
              },
              '&:disabled': {
                bgcolor: 'rgba(0, 255, 184, 0.5)',
              },
            }}
          >
            连接钱包
          </Button>

          <Dialog 
            open={showWalletDialog} 
            onClose={handleCloseWalletDialog}
            PaperProps={{
              sx: {
                borderRadius: 2,
                maxWidth: 400,
                width: '100%',
              }
            }}
          >
            <DialogTitle sx={{ 
              textAlign: 'center',
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#333333',
            }}>
              选择钱包
            </DialogTitle>
            <DialogContent>
              <List>
                <ListItem 
                  button 
                  onClick={() => handleConnectWallet('metamask')}
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    '&:hover': {
                      bgcolor: 'rgba(0, 255, 184, 0.1)',
                    },
                  }}
                >
                  <ListItemIcon>
                    <AccountBalanceWalletIcon sx={{ color: '#00FFB8' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="MetaMask" 
                    secondary="最受欢迎的钱包"
                    primaryTypographyProps={{
                      fontWeight: 600,
                      color: '#333333',
                    }}
                    secondaryTypographyProps={{
                      color: '#666666',
                    }}
                  />
                </ListItem>
                <ListItem 
                  button 
                  onClick={() => handleConnectWallet('walletconnect')}
                  sx={{
                    borderRadius: 1,
                    mb: 1,
                    '&:hover': {
                      bgcolor: 'rgba(0, 255, 184, 0.1)',
                    },
                  }}
                >
                  <ListItemIcon>
                    <SecurityIcon sx={{ color: '#00FFB8' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="WalletConnect" 
                    secondary="支持多个钱包"
                    primaryTypographyProps={{
                      fontWeight: 600,
                      color: '#333333',
                    }}
                    secondaryTypographyProps={{
                      color: '#666666',
                    }}
                  />
                </ListItem>
                <ListItem 
                  button 
                  onClick={() => handleConnectWallet('coinbase')}
                  sx={{
                    borderRadius: 1,
                    '&:hover': {
                      bgcolor: 'rgba(0, 255, 184, 0.1)',
                    },
                  }}
                >
                  <ListItemIcon>
                    <WalletIcon sx={{ color: '#00FFB8' }} />
                  </ListItemIcon>
                  <ListItemText 
                    primary="Coinbase Wallet" 
                    secondary="安全可靠的钱包"
                    primaryTypographyProps={{
                      fontWeight: 600,
                      color: '#333333',
                    }}
                    secondaryTypographyProps={{
                      color: '#666666',
                    }}
                  />
                </ListItem>
              </List>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
              <Button 
                onClick={handleCloseWalletDialog}
                sx={{
                  color: '#666666',
                  '&:hover': {
                    color: '#333333',
                  },
                }}
              >
                取消
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </Box>
  );
};

export default AuthForm; 