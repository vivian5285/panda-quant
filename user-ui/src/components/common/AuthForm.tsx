import React, { useState, FormEvent, useEffect } from 'react';
import { Box, IconButton, Typography, Button } from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { toast } from 'react-toastify';
import {
  Email as EmailIcon,
  Visibility,
  VisibilityOff,
  Lock as LockIcon,
  Person as PersonIcon,
  ArrowForward as ArrowForwardIcon,
  AccountBalanceWallet as WalletIcon,
  Send as SendIcon,
} from '@mui/icons-material';
import PandaInput from './PandaInput';
import PandaButton from './PandaButton';
import PandaSelect from './PandaSelect';
import { PandaAlert } from './PandaAlert';

interface FormField {
  name: string;
  label: string;
  type: string;
  icon?: React.ReactNode;
  required?: boolean;
  validation?: (value: string) => string | null;
  action?: React.ReactNode;
}

interface AuthFormProps {
  type: 'login' | 'register';
  method: 'email' | 'username' | 'wallet';
  onSubmit: (data: Record<string, string>) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthForm: React.FC<AuthFormProps> = ({
  type,
  method,
  onSubmit,
  loading: parentLoading,
  error,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [verificationCodeSent, setVerificationCodeSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [sendingCode, setSendingCode] = useState(false);
  const [lastSendTime, setLastSendTime] = useState<number | null>(null);
  const [resendCount, setResendCount] = useState(0);
  const MAX_RESEND_COUNT = 3;
  const UNLOCK_TIME = 24 * 60 * 60; // 24小时
  const RESEND_COOLDOWN = 60; // 60秒

  // 检查是否需要解锁
  useEffect(() => {
    if (lastSendTime && resendCount >= MAX_RESEND_COUNT) {
      const now = Math.floor(Date.now() / 1000);
      const elapsed = now - lastSendTime;
      if (elapsed >= UNLOCK_TIME) {
        setResendCount(0);
        setLastSendTime(null);
      }
    }
  }, [lastSendTime, resendCount]);

  const handleSendVerificationCode = async () => {
    try {
      setSendingCode(true);
      const response = await fetch(`${process.env.REACT_APP_API_URL}/auth/send-code`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          type: 'register'
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message);
      }

      setVerificationCodeSent(true);
      setCountdown(60); // 60秒倒计时
      toast.success(t('register.verificationCodeSent'));
    } catch (error: any) {
      toast.error(error.message || t('register.error.sendCodeFailed'));
    } finally {
      setSendingCode(false);
    }
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const getFields = (): FormField[] => {
    const fields: FormField[] = [];

    if (method === 'email') {
      if (type === 'register') {
        fields.push({
          name: 'username',
          label: t('register.username'),
          type: 'text',
          icon: <PersonIcon />,
          required: true,
          validation: (value) => {
            if (value.length < 3) {
              return t('register.error.usernameMinLength');
            }
            if (!value.match(/^[a-zA-Z0-9_]+$/)) {
              return t('register.error.usernameInvalid');
            }
            return null;
          },
        });
      }

      fields.push({
        name: 'email',
        label: t('login.email'),
        type: 'email',
        icon: <EmailIcon />,
        required: true,
        validation: (value) => {
          if (!value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
            return t('login.error.emailInvalid');
          }
          return null;
        },
      });

      if (type === 'register') {
        fields.push({
          name: 'verificationCode',
          label: t('register.verificationCode'),
          type: 'text',
          icon: <LockIcon />,
          required: true,
          validation: (value) => {
            if (value.length !== 6) {
              return t('register.error.verificationCodeInvalid');
            }
            return null;
          },
          action: verificationCodeSent ? (
            <Typography variant="body2" color="text.secondary">
              {countdown > 0 ? `${countdown}s` : t('register.resendCode')}
            </Typography>
          ) : (
            <Button
              variant="text"
              size="small"
              onClick={handleSendVerificationCode}
              disabled={sendingCode || !formData.email || countdown > 0}
            >
              {t('register.sendCode')}
            </Button>
          ),
        });
      }
    } else if (method === 'username') {
      fields.push({
        name: 'username',
        label: t('login.username'),
        type: 'text',
        icon: <PersonIcon />,
        required: true,
        validation: (value) => {
          if (value.length < 3) {
            return t('login.error.usernameInvalid');
          }
          return null;
        },
      });
    }

    if (method !== 'wallet') {
      fields.push({
        name: 'password',
        label: t('login.password'),
        type: 'password',
        icon: <LockIcon />,
        required: true,
        validation: (value) => {
          if (value.length < 8) {
            return t('login.error.passwordMinLength');
          }
          return null;
        },
      });

      if (type === 'register') {
        fields.push({
          name: 'confirmPassword',
          label: t('register.confirmPassword'),
          type: 'password',
          icon: <LockIcon />,
          required: true,
          validation: (value) => {
            if (value !== formData.password) {
              return t('register.error.passwordsNotMatch');
            }
            return null;
          },
        });
      }
    }

    return fields;
  };

  const handleChange = (name: string) => (value: string | number) => {
    setFormData((prev) => ({ ...prev, [name]: String(value) }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const fields = getFields();
    const errors: Record<string, string> = {};
    let isValid = true;

    fields.forEach((field) => {
      const value = formData[field.name] || '';
      if (field.required && !value) {
        errors[field.name] = t('login.error.fieldRequired');
        isValid = false;
      } else if (field.validation) {
        const error = field.validation(value);
        if (error) {
          errors[field.name] = error;
          isValid = false;
        }
      }
    });

    setValidationErrors(errors);
    return isValid;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    if (type === 'register' && method === 'email') {
      try {
        // 先验证验证码
        const response = await fetch('/api/verification/verify-code', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            email: formData.email,
            code: formData.verificationCode,
            type: 'register'
          }),
        });

        const data = await response.json();

        if (!data.success) {
          setValidationErrors((prev) => ({
            ...prev,
            verificationCode: data.message,
          }));
          return;
        }
      } catch (err) {
        setValidationErrors((prev) => ({
          ...prev,
          verificationCode: err instanceof Error ? err.message : '验证码验证失败',
        }));
        return;
      }
    }

    onSubmit(formData);
  };

  const renderField = (field: FormField) => {
    const value = formData[field.name] || '';
    const error = validationErrors[field.name];
    const showPasswordField = field.name === 'password' || field.name === 'confirmPassword';
    const showPasswordState = field.name === 'password' ? showPassword : showConfirmPassword;
    const setShowPasswordState = field.name === 'password' ? setShowPassword : setShowConfirmPassword;

    if (field.name === 'email' && type === 'register' && !verificationCodeSent) {
      return (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <EmailIcon sx={{ color: '#00FFB8', fontSize: 20 }} />
              <Typography variant="subtitle2" sx={{ color: '#666666', fontWeight: 500 }}>
                邮箱
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <PandaInput
                  fullWidth
                  placeholder="请输入邮箱"
                  value={value}
                  onChange={handleChange(field.name)}
                  required={field.required}
                  error={!!error}
                  helperText={error}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: '48px',
                      backgroundColor: 'rgba(0, 255, 184, 0.05)',
                      borderRadius: '8px',
                      '& fieldset': {
                        borderColor: 'rgba(0, 255, 184, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(0, 255, 184, 0.4)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#00FFB8',
                      },
                    },
                    '& .MuiInputBase-input': {
                      padding: '12px 16px',
                      fontSize: '0.95rem',
                    },
                  }}
                />
              </Box>
              <Button
                variant="contained"
                onClick={handleSendVerificationCode}
                disabled={!!error || !formData.email || countdown > 0}
                sx={{
                  minWidth: '120px',
                  height: '48px',
                  borderRadius: '8px',
                  backgroundColor: '#00FFB8',
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  '&:hover': {
                    backgroundColor: '#00CC93',
                  },
                  '&.Mui-disabled': {
                    backgroundColor: 'rgba(0, 255, 184, 0.2)',
                    color: 'rgba(0, 255, 184, 0.4)',
                  },
                }}
              >
                {countdown > 0 ? `${countdown}s` : '发送验证码'}
              </Button>
            </Box>
          </Box>
        </Box>
      );
    }

    if (field.name === 'verificationCode') {
      return (
        <Box sx={{ mb: 3 }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <LockIcon sx={{ color: '#00FFB8', fontSize: 20 }} />
              <Typography variant="subtitle2" sx={{ color: '#666666', fontWeight: 500 }}>
                验证码
              </Typography>
              <Typography variant="caption" sx={{ color: '#999999', ml: 'auto' }}>
                {resendCount > 0 && `已发送 ${resendCount}/${MAX_RESEND_COUNT} 次`}
                {resendCount >= MAX_RESEND_COUNT && lastSendTime && (
                  <>
                    <br />
                    {(() => {
                      const now = Math.floor(Date.now() / 1000);
                      const elapsed = now - lastSendTime;
                      const remaining = Math.max(0, UNLOCK_TIME - elapsed);
                      const hours = Math.floor(remaining / 3600);
                      const minutes = Math.floor((remaining % 3600) / 60);
                      return `将在${hours}小时${minutes}分钟后解锁`;
                    })()}
                  </>
                )}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Box sx={{ flex: 1 }}>
                <PandaInput
                  fullWidth
                  placeholder="请输入6位验证码"
                  value={value}
                  onChange={handleChange(field.name)}
                  required={field.required}
                  error={!!error}
                  helperText={error}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      height: '48px',
                      backgroundColor: 'rgba(0, 255, 184, 0.05)',
                      borderRadius: '8px',
                      '& fieldset': {
                        borderColor: 'rgba(0, 255, 184, 0.2)',
                      },
                      '&:hover fieldset': {
                        borderColor: 'rgba(0, 255, 184, 0.4)',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#00FFB8',
                      },
                    },
                    '& .MuiInputBase-input': {
                      padding: '12px 16px',
                      fontSize: '0.95rem',
                    },
                  }}
                />
              </Box>
              <Button
                variant="outlined"
                onClick={handleSendVerificationCode}
                disabled={countdown > 0 || resendCount >= MAX_RESEND_COUNT}
                sx={{
                  minWidth: '120px',
                  height: '48px',
                  borderRadius: '8px',
                  borderColor: '#00FFB8',
                  color: '#00FFB8',
                  textTransform: 'none',
                  fontWeight: 500,
                  fontSize: '0.95rem',
                  '&:hover': {
                    borderColor: '#00CC93',
                    color: '#00CC93',
                    backgroundColor: 'rgba(0, 255, 184, 0.05)',
                  },
                  '&.Mui-disabled': {
                    borderColor: 'rgba(0, 255, 184, 0.2)',
                    color: 'rgba(0, 255, 184, 0.4)',
                  },
                }}
              >
                {countdown > 0 ? `${countdown}s` : resendCount >= MAX_RESEND_COUNT ? '已达上限' : '重新发送'}
              </Button>
            </Box>
          </Box>
        </Box>
      );
    }

    return (
      <Box key={field.name} sx={{ mb: 2 }}>
        <PandaInput
          fullWidth
          placeholder={field.label}
          value={value}
          onChange={handleChange(field.name)}
          required={field.required}
          error={!!error}
          helperText={error}
          type={showPasswordField ? (showPasswordState ? 'text' : 'password') : field.type}
          icon={field.icon}
          endIcon={
            showPasswordField ? (
              <IconButton
                onClick={() => setShowPasswordState(!showPasswordState)}
                edge="end"
                sx={{ color: 'text.secondary' }}
              >
                {showPasswordState ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ) : field.action
          }
        />
      </Box>
    );
  };

  const renderWalletForm = () => (
    <Box>
      <PandaSelect
        fullWidth
        label={t('login.selectWallet')}
        value={formData.walletType || 'metamask'}
        onChange={handleChange('walletType')}
        options={[
          { value: 'metamask', label: 'MetaMask' },
          { value: 'walletconnect', label: 'WalletConnect' },
        ]}
      />
      <Box sx={{ mt: 2 }}>
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <PandaButton
            fullWidth
            disabled={parentLoading}
            startIcon={<WalletIcon />}
            onClick={() => {
              onSubmit(formData);
            }}
          >
            {type === 'login' ? t('login.loginButton') : t('register.registerButton')}
          </PandaButton>
        </motion.div>
      </Box>
    </Box>
  );

  return (
    <form onSubmit={handleSubmit}>
      {error && (
        <PandaAlert
          severity="error"
          message={error}
        />
      )}

      {method === 'wallet' ? (
        renderWalletForm()
      ) : (
        <Box>
          {getFields().map((field) => (
            <Box key={field.name} sx={{ mb: 2 }}>
              <PandaInput
                fullWidth
                placeholder={field.label}
                value={formData[field.name] || ''}
                onChange={handleChange(field.name)}
                required={field.required}
                error={!!validationErrors[field.name]}
                helperText={validationErrors[field.name]}
                type={field.name === 'password' || field.name === 'confirmPassword' ? (showPassword ? 'text' : 'password') : field.type}
                icon={field.icon}
                endIcon={
                  (field.name === 'password' || field.name === 'confirmPassword') ? (
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                      sx={{ color: 'text.secondary' }}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  ) : field.action
                }
              />
            </Box>
          ))}
          <Box sx={{ mt: 3 }}>
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <PandaButton
                fullWidth
                disabled={parentLoading}
                endIcon={<ArrowForwardIcon />}
                onClick={() => {
                  if (validateForm()) {
                    onSubmit(formData);
                  }
                }}
              >
                {type === 'login' ? t('login.loginButton') : t('register.registerButton')}
              </PandaButton>
            </motion.div>
          </Box>
        </Box>
      )}
    </form>
  );
};

export default AuthForm; 