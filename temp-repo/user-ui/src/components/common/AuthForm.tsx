import React, { useState, FormEvent, useEffect } from 'react';
import { Box, IconButton, Typography, Button, Grid } from '@mui/material';
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
  sx?: any;
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
        sx: {
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
        }
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
        sx: {
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
        }
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

  const handleInputChange = (field: keyof typeof formData) => (value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
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

    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const renderField = (field: FormField) => {
    const value = formData[field.name as keyof typeof formData] || '';
    const error = validationErrors[field.name];

    return (
      <Grid item xs={12}>
        <PandaInput
          label={field.label}
          name={field.name}
          type={field.type === 'password' ? (showPassword ? 'text' : 'password') : field.type}
          value={value}
          onChange={handleInputChange(field.name as keyof typeof formData)}
          error={!!error}
          helperText={error}
          required={field.required}
          fullWidth
          InputProps={{
            endAdornment: field.type === 'password' && (
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            ),
          }}
        />
      </Grid>
    );
  };

  const renderWalletForm = () => (
    <Box>
      <PandaSelect
        fullWidth
        label={t('login.selectWallet')}
        value={formData.walletType || 'metamask'}
        onChange={handleInputChange('walletType')}
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
    <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%' }}>
      <Grid container spacing={2}>
        {method === 'wallet' ? (
          <>
            {renderWalletForm()}
          </>
        ) : (
          <>
            {getFields().map((field) => renderField(field))}
          </>
        )}
      </Grid>
      <Box sx={{ mt: 2 }}>
        <PandaButton
          type="submit"
          variant="contained"
          fullWidth
          disabled={parentLoading}
          sx={{
            height: 48,
            borderRadius: '8px',
            backgroundColor: '#00FFB8',
            '&:hover': {
              backgroundColor: '#00CC93',
            },
          }}
        >
          {type === 'login' ? t('login.loginButton') : t('register.registerButton')}
        </PandaButton>
      </Box>
    </Box>
  );
};

export default AuthForm; 