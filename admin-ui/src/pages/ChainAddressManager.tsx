import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  LinearProgress,
  Alert,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Tooltip,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Save as SaveIcon,
  Edit as EditIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  AccountBalanceWallet as WalletIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import theme from '../theme';
import { animationConfig } from '../theme/animation';
import PageLayout from '../components/common/PageLayout';

interface ChainAddress {
  id: string;
  userId: string;
  username: string;
  chain: string;
  address: string;
  status: 'active' | 'inactive' | 'pending';
  createdAt: string;
  updatedAt: string;
  description: string;
  isDefault: boolean;
}

const ChainAddressManager: React.FC = () => {
  const { t } = useTranslation();
  const [addresses, setAddresses] = useState<ChainAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState<ChainAddress | null>(null);
  const [newAddress, setNewAddress] = useState({
    chain: '',
    address: '',
    description: '',
    isDefault: false,
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    try {
      // Mock API call
      const mockAddresses: ChainAddress[] = [
        {
          id: '1',
          userId: 'user1',
          username: 'John Doe',
          chain: 'ETH',
          address: '0x1234...5678',
          status: 'active',
          createdAt: '2024-04-23T10:00:00Z',
          updatedAt: '2024-04-23T10:00:00Z',
          description: 'Main Ethereum wallet',
          isDefault: true,
        },
        {
          id: '2',
          userId: 'user2',
          username: 'Jane Smith',
          chain: 'BTC',
          address: 'bc1q...xyz',
          status: 'active',
          createdAt: '2024-04-23T09:00:00Z',
          updatedAt: '2024-04-23T09:00:00Z',
          description: 'Bitcoin wallet',
          isDefault: false,
        },
      ];
      setAddresses(mockAddresses);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const getStatusColor = (status: ChainAddress['status']) => {
    switch (status) {
      case 'active':
        return theme.palette.success.main;
      case 'inactive':
        return theme.palette.error.main;
      case 'pending':
        return theme.palette.warning.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  const getStatusIcon = (status: ChainAddress['status']) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon />;
      case 'inactive':
        return <CancelIcon />;
      case 'pending':
        return <WarningIcon />;
      default:
        return <WarningIcon />;
    }
  };

  const handleAdd = () => {
    setSelectedAddress(null);
    setNewAddress({
      chain: '',
      address: '',
      description: '',
      isDefault: false,
    });
    setOpenDialog(true);
  };

  const handleEdit = (address: ChainAddress) => {
    setSelectedAddress(address);
    setNewAddress({
      chain: address.chain,
      address: address.address,
      description: address.description,
      isDefault: address.isDefault,
    });
    setOpenDialog(true);
  };

  const handleDelete = async (address: ChainAddress) => {
    // Mock API call
    const updatedAddresses = addresses.filter((a) => a.id !== address.id);
    setAddresses(updatedAddresses);
  };

  const handleSave = () => {
    if (selectedAddress) {
      // Update existing address
      const updatedAddresses = addresses.map((address) =>
        address.id === selectedAddress.id
          ? {
              ...address,
              ...newAddress,
              updatedAt: new Date().toISOString(),
            }
          : address
      );
      setAddresses(updatedAddresses);
    } else {
      // Add new address
      const newAddressObj: ChainAddress = {
        id: Date.now().toString(),
        userId: 'user1', // Mock user ID
        username: 'John Doe', // Mock username
        ...newAddress,
        status: 'active',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setAddresses([...addresses, newAddressObj]);
    }
    setOpenDialog(false);
  };

  const renderAddressCard = (address: ChainAddress) => (
    <motion.div
      key={address.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: animationConfig.duration.medium }}
    >
      <Card
        sx={{
          backgroundColor: theme.palette.background.paper,
          boxShadow: theme.shadows[2],
          '&:hover': {
            boxShadow: theme.shadows[4],
          },
        }}
      >
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box
                sx={{
                  color: getStatusColor(address.status),
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {getStatusIcon(address.status)}
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                {address.username}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Tooltip title={t('chainAddress.edit')}>
                <IconButton onClick={() => handleEdit(address)}>
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title={t('chainAddress.delete')}>
                <IconButton onClick={() => handleDelete(address)}>
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {address.userId}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('chainAddress.chain')}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {address.chain}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('chainAddress.status')}
              </Typography>
              <Chip
                label={t(`chainAddress.${address.status}`)}
                sx={{
                  bgcolor: `${getStatusColor(address.status)}20`,
                  color: getStatusColor(address.status),
                  fontWeight: 500,
                }}
              />
            </Box>
          </Box>
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              {t('chainAddress.address')}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 500, wordBreak: 'break-all' }}>
              {address.address}
            </Typography>
          </Box>
          {address.isDefault && (
            <Chip
              label={t('chainAddress.default')}
              color="primary"
              size="small"
              sx={{ mb: 2 }}
            />
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            {address.description}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderContent = () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
      {addresses.map(renderAddressCard)}
    </Box>
  );

  const renderActions = () => (
    <Box sx={{ display: 'flex', gap: 2 }}>
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={handleAdd}
        sx={{
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          '&:hover': {
            background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
          },
        }}
      >
        {t('chainAddress.add')}
      </Button>
      <Button
        variant="contained"
        startIcon={<RefreshIcon />}
        onClick={fetchAddresses}
        sx={{
          background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          '&:hover': {
            background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
          },
        }}
      >
        {t('chainAddress.refresh')}
      </Button>
    </Box>
  );

  return (
    <PageLayout
      title={t('chainAddress.title')}
      actions={renderActions()}
      content={renderContent()}
    >
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {selectedAddress ? t('chainAddress.editAddress') : t('chainAddress.addAddress')}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>{t('chainAddress.chain')}</InputLabel>
              <Select
                value={newAddress.chain}
                onChange={(e) => setNewAddress({ ...newAddress, chain: e.target.value })}
                label={t('chainAddress.chain')}
              >
                <MenuItem value="ETH">Ethereum</MenuItem>
                <MenuItem value="BTC">Bitcoin</MenuItem>
                <MenuItem value="USDT">USDT</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              value={newAddress.address}
              onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
              label={t('chainAddress.address')}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              value={newAddress.description}
              onChange={(e) => setNewAddress({ ...newAddress, description: e.target.value })}
              label={t('chainAddress.description')}
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth>
              <InputLabel>{t('chainAddress.isDefault')}</InputLabel>
              <Select
                value={newAddress.isDefault ? 'true' : 'false'}
                onChange={(e) => setNewAddress({ ...newAddress, isDefault: e.target.value === 'true' })}
                label={t('chainAddress.isDefault')}
              >
                <MenuItem value="true">{t('common.yes')}</MenuItem>
                <MenuItem value="false">{t('common.no')}</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setOpenDialog(false)}
            sx={{
              color: theme.palette.text.secondary,
              '&:hover': {
                backgroundColor: `${theme.palette.text.secondary}10`,
              },
            }}
          >
            {t('common.cancel')}
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            sx={{
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              '&:hover': {
                background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
              },
            }}
          >
            {t('common.save')}
          </Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  );
};

export default ChainAddressManager; 