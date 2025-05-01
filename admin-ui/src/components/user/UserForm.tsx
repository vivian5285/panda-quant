import React from 'react';
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Grid,
  Paper,
  SelectChangeEvent
} from '@mui/material';
import { motion } from 'framer-motion';
import theme from '../../theme';
import { animationConfig } from '../../theme/animation';
import { User } from '../../types/user';

interface UserFormData extends Omit<User, 'password'> {
  password: string;
}

interface UserFormProps {
  user: User | null;
  onSubmit: (user: UserFormData) => void;
  onCancel: () => void;
}

const UserForm: React.FC<UserFormProps> = ({ user, onSubmit, onCancel }) => {
  const [formData, setFormData] = React.useState<UserFormData>({
    _id: user?._id || '',
    username: user?.username || '',
    email: user?.email || '',
    status: user?.status || 'active',
    role: user?.role || 'user',
    lastLogin: user?.lastLogin || new Date().toISOString(),
    createdAt: user?.createdAt || new Date().toISOString(),
    avatar: user?.avatar || '',
    password: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (event: SelectChangeEvent) => {
    const { name, value } = event.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: animationConfig.duration.medium }}
    >
      <Paper sx={{ p: 3 }}>
        <Box component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="用户名"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                sx={{ mb: 2 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleSelectChange}
                  label="Status"
                >
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                  <MenuItem value="suspended">Suspended</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  fullWidth
                  name="role"
                  value={formData.role}
                  onChange={handleSelectChange}
                  sx={{ mb: 2 }}
                >
                  <MenuItem value="admin">Admin</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="密码"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                required={!user}
              />
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={onCancel}
                  sx={{
                    color: theme.palette.text.primary,
                    borderColor: theme.palette.text.primary,
                    '&:hover': {
                      borderColor: theme.palette.text.primary,
                    },
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  sx={{
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    '&:hover': {
                      background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                    },
                  }}
                >
                  {user ? 'Update' : 'Create'}
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </motion.div>
  );
};

export default UserForm; 