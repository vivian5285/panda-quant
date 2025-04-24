import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { StyledCard } from '../components/common/StyledCard';
import { GradientTitle } from '../components/common/GradientTitle';
import {
  Box,
  Container,
  Grid,
  Typography,
  TextField,
  Button,
  Avatar,
  CardContent,
  IconButton,
  useTheme,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { fadeIn, slideUp, staggerChildren } from '../animations';
import { useTranslation } from 'react-i18next';

const Profile = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, updateProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
  });

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData({
      username: user?.username || '',
      email: user?.email || '',
      bio: user?.bio || '',
    });
  };

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      variants={staggerChildren}
    >
      <Container maxWidth="lg">
        <Box sx={{ mt: 4, mb: 4 }}>
          <motion.div variants={fadeIn}>
            <GradientTitle variant="h4" gutterBottom>
              {t('profile.title')}
            </GradientTitle>
          </motion.div>

          <Grid container spacing={3}>
            <Grid item xs={12} md={4}>
              <motion.div variants={slideUp}>
                <StyledCard>
                  <CardContent sx={{ textAlign: 'center' }}>
                    <Avatar
                      sx={{
                        width: 120,
                        height: 120,
                        margin: '0 auto 16px',
                        border: `4px solid ${theme.palette.primary.main}`,
                      }}
                      src={user?.avatar}
                    />
                    <Typography variant="h6" gutterBottom>
                      {user?.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {user?.email}
                    </Typography>
                  </CardContent>
                </StyledCard>
              </motion.div>
            </Grid>

            <Grid item xs={12} md={8}>
              <motion.div variants={slideUp}>
                <StyledCard>
                  <CardContent>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography variant="h6">
                        {t('profile.personalInfo')}
                      </Typography>
                      {!isEditing ? (
                        <IconButton onClick={handleEdit} color="primary">
                          <EditIcon />
                        </IconButton>
                      ) : (
                        <Box>
                          <IconButton onClick={handleSave} color="primary" sx={{ mr: 1 }}>
                            <SaveIcon />
                          </IconButton>
                          <IconButton onClick={handleCancel} color="error">
                            <CancelIcon />
                          </IconButton>
                        </Box>
                      )}
                    </Box>

                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label={t('profile.username')}
                          name="username"
                          value={formData.username}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label={t('profile.email')}
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          disabled={!isEditing}
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          fullWidth
                          label={t('profile.bio')}
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          disabled={!isEditing}
                          multiline
                          rows={4}
                        />
                      </Grid>
                    </Grid>
                  </CardContent>
                </StyledCard>
              </motion.div>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </motion.div>
  );
};

export default Profile; 