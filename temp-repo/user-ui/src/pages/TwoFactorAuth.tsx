import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import QRCode from 'qrcode.react';

const TwoFactorAuth: React.FC = () => {
  const { t } = useTranslation();
  const [isEnabled, setIsEnabled] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [secret, setSecret] = useState('');

  const handleEnable2FA = async () => {
    setIsLoading(true);
    try {
      // TODO: Call API to generate 2FA secret
      const response = await fetch('/api/user/generate-2fa-secret');
      const data = await response.json();
      setSecret(data.secret);
      setIsEnabled(true);
    } catch (err) {
      setError(t('twoFactorAuth.errorGeneratingSecret'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerify2FA = async () => {
    setIsLoading(true);
    try {
      // TODO: Call API to verify 2FA code
      await fetch('/api/user/verify-2fa', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code: verificationCode }),
      });
      setIsEnabled(true);
      setError('');
    } catch (err) {
      setError(t('twoFactorAuth.invalidCode'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisable2FA = async () => {
    setIsLoading(true);
    try {
      // TODO: Call API to disable 2FA
      await fetch('/api/user/disable-2fa', {
        method: 'POST',
      });
      setIsEnabled(false);
      setSecret('');
      setError('');
    } catch (err) {
      setError(t('twoFactorAuth.errorDisabling'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('twoFactorAuth.title')}
      </Typography>

      <Card sx={{ maxWidth: 600, mx: 'auto' }}>
        <CardContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {!isEnabled ? (
            <Box>
              <Typography variant="body1" gutterBottom>
                {t('twoFactorAuth.description')}
              </Typography>
              <Button
                variant="contained"
                onClick={handleEnable2FA}
                disabled={isLoading}
                sx={{ mt: 2 }}
              >
                {isLoading ? (
                  <CircularProgress size={24} />
                ) : (
                  t('twoFactorAuth.enable')
                )}
              </Button>
            </Box>
          ) : (
            <Box>
              <Typography variant="body1" gutterBottom>
                {t('twoFactorAuth.scanQR')}
              </Typography>
              {secret && (
                <Box sx={{ textAlign: 'center', my: 2 }}>
                  <QRCode value={`otpauth://totp/YourApp:user@example.com?secret=${secret}&issuer=YourApp`} />
                </Box>
              )}
              <Grid container spacing={2} sx={{ mt: 2 }}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label={t('twoFactorAuth.verificationCode')}
                    value={verificationCode}
                    onChange={(e) => setVerificationCode(e.target.value)}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    onClick={handleVerify2FA}
                    disabled={isLoading}
                    sx={{ mr: 2 }}
                  >
                    {isLoading ? (
                      <CircularProgress size={24} />
                    ) : (
                      t('twoFactorAuth.verify')
                    )}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleDisable2FA}
                    disabled={isLoading}
                  >
                    {t('twoFactorAuth.disable')}
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default TwoFactorAuth; 