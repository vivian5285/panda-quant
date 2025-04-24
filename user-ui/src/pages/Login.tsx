import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { StyledCard } from '../components/common/StyledCard';
import { GradientTitle } from '../components/common/GradientTitle';
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  CardContent,
  IconButton,
  InputAdornment,
  useTheme,
  Alert,
} from '@mui/material';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Login as LoginIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { fadeIn, slideUp, staggerChildren } from '../animations';
import { useTranslation } from 'react-i18next';

const Login = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(formData.email, formData.password);
      navigate('/dashboard');
    } catch (error) {
      setError(t('login.error.invalidCredentials'));
    }
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerChildren}
    >
      <Container maxWidth="sm">
        <Box
          sx={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            py: 8,
          }}
        >
          <motion.div variants={fadeIn}>
            <GradientTitle variant="h4" align="center" gutterBottom>
              {t('login.title')}
            </GradientTitle>
            <Typography variant="subtitle1" align="center" color="text.secondary" gutterBottom>
              {t('login.subtitle')}
            </Typography>
          </motion.div>

          <motion.div variants={slideUp}>
            <StyledCard>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {error}
                    </Alert>
                  )}

                  <TextField
                    fullWidth
                    label={t('login.email')}
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    margin="normal"
                    required
                    sx={{ mb: 2 }}
                  />

                  <TextField
                    fullWidth
                    label={t('login.password')}
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    margin="normal"
                    required
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setShowPassword(!showPassword)}
                            edge="end"
                          >
                            {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                          </IconButton>
                        </InputAdornment>
                      ),
                    }}
                    sx={{ mb: 3 }}
                  />

                  <Button
                    fullWidth
                    type="submit"
                    variant="contained"
                    size="large"
                    startIcon={<LoginIcon />}
                    sx={{
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      color: 'white',
                      py: 1.5,
                      '&:hover': {
                        background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                      },
                    }}
                  >
                    {t('login.submit')}
                  </Button>

                  <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      {t('login.noAccount')}{' '}
                      <Link
                        to="/register"
                        style={{
                          color: theme.palette.primary.main,
                          textDecoration: 'none',
                        }}
                      >
                        {t('login.register')}
                      </Link>
                    </Typography>
                  </Box>
                </form>
              </CardContent>
            </StyledCard>
          </motion.div>
        </Box>
      </Container>
    </motion.div>
  );
};

export default Login; 