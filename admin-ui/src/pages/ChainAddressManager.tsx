import React, { useState } from 'react';
import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  Paper,
  InputAdornment,
  CircularProgress,
  Container,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Close as CloseIcon,
  AccountBalance as AccountBalanceIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon
} from '@mui/icons-material';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { getChains, createChain, updateChain, deleteChain, Chain } from '../api/chain';

interface ChainAddress extends Chain {
  _id: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const ChainAddressManager: React.FC = () => {
  const { t } = useTranslation();
  const [chains, setChains] = useState<ChainAddress[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const [selectedChain, setSelectedChain] = useState<ChainAddress | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState<{
    chain: string;
    address: string;
    status: string;
    isActive: boolean;
  }>({
    chain: '',
    address: '',
    status: 'active',
    isActive: true,
  });

  const fetchChains = async () => {
    try {
      const data = await getChains();
      setChains(data.map(chain => ({
        ...chain,
        _id: chain._id || '',
        isActive: chain.status === 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })));
      setError(null);
    } catch (err) {
      setError('Failed to fetch chain addresses');
      console.error('Error fetching chains:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDialog = (chain?: ChainAddress) => {
    if (chain) {
      setSelectedChain(chain);
      setFormData({
        chain: chain.chain,
        address: chain.address,
        status: chain.status,
        isActive: chain.status === 'active',
      });
    } else {
      setSelectedChain(null);
      setFormData({
        chain: '',
        address: '',
        status: 'active',
        isActive: true,
      });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedChain(null);
    setFormData({
      chain: '',
      address: '',
      status: 'active',
      isActive: true,
    });
  };

  const handleSubmit = async () => {
    try {
      if (selectedChain) {
        await updateChain(selectedChain._id, {
          ...formData,
          isActive: formData.status === 'active',
        });
      } else {
        await createChain({
          ...formData,
          isActive: formData.status === 'active',
        });
      }
      fetchChains();
    } catch (error) {
      console.error('Error saving chain:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm(t('confirm.deleteChain'))) {
      try {
        await deleteChain(id);
        fetchChains();
      } catch (err) {
        console.error('Error deleting chain:', err);
        setError(t('error.deleteFailed'));
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const filteredChains = chains.filter(chain =>
    chain.chain.toLowerCase().includes(searchQuery.toLowerCase()) ||
    chain.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress sx={{ color: '#00FFB8' }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography 
            variant="h4" 
            sx={{ 
              fontWeight: 700,
              color: '#333333',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                bottom: -10,
                left: 0,
                width: '60px',
                height: '4px',
                background: 'linear-gradient(90deg, #00FFB8, transparent)',
                borderRadius: '2px',
              }
            }}
          >
            {t('chain.title')}
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog()}
            sx={{
              bgcolor: '#00FFB8',
              color: '#fff',
              '&:hover': {
                bgcolor: '#00E6A5',
              },
            }}
          >
            {t('chain.add')}
          </Button>
        </Box>

        {error && (
          <Paper
            elevation={0}
            sx={{
              p: 2,
              mb: 3,
              bgcolor: 'rgba(255, 77, 77, 0.1)',
              border: '1px solid rgba(255, 77, 77, 0.2)',
            }}
          >
            <Typography color="error">{error}</Typography>
          </Paper>
        )}

        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 2,
            bgcolor: '#fff',
          }}
        >
          <Box sx={{ mb: 3 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder={t('common.search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: '#00FFB8' }} />
                  </InputAdornment>
                ),
                endAdornment: searchQuery && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setSearchQuery('')} size="small">
                      <CloseIcon sx={{ color: '#666666' }} />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>

          <Box sx={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8f8f8' }}>
                  <th style={{ padding: '12px', textAlign: 'left' }}>{t('chain.name')}</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>{t('chain.address')}</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>{t('chain.status')}</th>
                  <th style={{ padding: '12px', textAlign: 'left' }}>{t('actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredChains.map((chain) => (
                  <tr key={chain._id} style={{ borderBottom: '1px solid #f0f0f0' }}>
                    <td style={{ padding: '12px' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <AccountBalanceIcon sx={{ color: '#00FFB8' }} />
                        {chain.chain}
                      </Box>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <Typography
                        sx={{
                          color: '#666666',
                          fontSize: '0.9rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {chain.address}
                      </Typography>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          color: chain.status === 'active' ? '#00FFB8' : '#FF4D4D',
                          bgcolor: chain.status === 'active' ? 'rgba(0, 255, 184, 0.1)' : 'rgba(255, 77, 77, 0.1)',
                          px: 2,
                          py: 0.5,
                          borderRadius: 1,
                          fontWeight: 500,
                        }}
                      >
                        {chain.status === 'active' ? <CheckCircleIcon /> : <CancelIcon />}
                        {chain.status === 'active' ? t('chain.active') : t('chain.inactive')}
                      </Box>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <IconButton
                          onClick={() => handleOpenDialog(chain)}
                          sx={{
                            color: '#00FFB8',
                            '&:hover': { bgcolor: 'rgba(0, 255, 184, 0.1)' },
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton
                          onClick={() => handleDelete(chain._id)}
                          sx={{
                            color: '#FF4D4D',
                            '&:hover': { bgcolor: 'rgba(255, 77, 77, 0.1)' },
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Box>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Box>
        </Paper>
      </motion.div>

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedChain ? t('chain.edit') : t('chain.add')}
        </DialogTitle>
        <DialogContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              label={t('chain.name')}
              name="chain"
              value={formData.chain}
              onChange={handleInputChange}
              margin="normal"
            />
            <TextField
              fullWidth
              label={t('chain.address')}
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              margin="normal"
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>{t('chain.status')}</InputLabel>
              <Select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as string })}
                label={t('chain.status')}
              >
                <MenuItem value="active">{t('chain.active')}</MenuItem>
                <MenuItem value="inactive">{t('chain.inactive')}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>{t('common.cancel')}</Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            sx={{
              bgcolor: '#00FFB8',
              color: '#fff',
              '&:hover': {
                bgcolor: '#00E6A5',
              },
            }}
          >
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ChainAddressManager; 