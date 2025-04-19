import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../contexts/AuthContext';
import { Box, TextField, Button, Typography } from '@mui/material';

const AccountSetup: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { updateUsername } = useAuth();
  const [username, setUsername] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      await updateUsername(username);
      navigate('/dashboard');
    } catch (error) {
      setError(t('accountSetup.error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: 'auto', mt: 4, p: 3 }}>
      <Typography variant="h5" gutterBottom>
        {t('accountSetup.title')}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          fullWidth
          label={t('accountSetup.username')}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
          required
        />
        {error && (
          <Typography color="error" sx={{ mt: 2 }}>
            {error}
          </Typography>
        )}
        <Button
          type="submit"
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          disabled={loading}
        >
          {loading ? t('common.loading') : t('accountSetup.submit')}
        </Button>
      </form>
    </Box>
  );
};

export default AccountSetup; 