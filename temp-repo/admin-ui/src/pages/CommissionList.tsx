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
  AttachMoney as AttachMoneyIcon,
  AccountBalance as AccountBalanceIcon,
} from '@mui/icons-material';
import { theme } from '../theme';
import { animationConfig } from '../theme/animation';
import PageLayout from '../components/common/PageLayout';

interface Commission {
  id: string;
  userId: string;
  username: string;
  amount: number;
  currency: string;
  type: 'referral' | 'trading' | 'other';
  status: 'pending' | 'paid' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  description: string;
}

const CommissionList: React.FC = () => {
  const { t } = useTranslation();
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCommission, setSelectedCommission] = useState<Commission | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<'paid' | 'cancelled'>('paid');
  const [paymentNote, setPaymentNote] = useState('');

  useEffect(() => {
    fetchCommissions();
  }, []);

  const fetchCommissions = async () => {
    try {
      // Mock API call
      const mockCommissions: Commission[] = [
        {
          id: '1',
          userId: 'user1',
          username: 'John Doe',
          amount: 1000,
          currency: 'USDT',
          type: 'referral',
          status: 'pending',
          createdAt: '2024-04-23T10:00:00Z',
          updatedAt: '2024-04-23T10:00:00Z',
          description: 'Referral commission for new user registration',
        },
        {
          id: '2',
          userId: 'user2',
          username: 'Jane Smith',
          amount: 500,
          currency: 'BTC',
          type: 'trading',
          status: 'pending',
          createdAt: '2024-04-23T09:00:00Z',
          updatedAt: '2024-04-23T09:00:00Z',
          description: 'Trading commission for successful trades',
        },
      ];
      setCommissions(mockCommissions);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const getStatusColor = (status: Commission['status']) => {
    switch (status) {
      case 'pending':
        return theme.palette.warning.main;
      case 'paid':
        return theme.palette.success.main;
      case 'cancelled':
        return theme.palette.error.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  const getStatusIcon = (status: Commission['status']) => {
    switch (status) {
      case 'pending':
        return <WarningIcon />;
      case 'paid':
        return <CheckCircleIcon />;
      case 'cancelled':
        return <CancelIcon />;
      default:
        return <WarningIcon />;
    }
  };

  const getTypeColor = (type: Commission['type']) => {
    switch (type) {
      case 'referral':
        return theme.palette.primary.main;
      case 'trading':
        return theme.palette.secondary.main;
      case 'other':
        return theme.palette.info.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  const handlePayment = (commission: Commission) => {
    setSelectedCommission(commission);
    setPaymentStatus('paid');
    setPaymentNote('');
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (selectedCommission) {
      const updatedCommissions = commissions.map((commission) =>
        commission.id === selectedCommission.id
          ? {
              ...commission,
              status: paymentStatus,
              updatedAt: new Date().toISOString(),
              description: paymentNote || commission.description,
            }
          : commission
      );
      setCommissions(updatedCommissions);
      setOpenDialog(false);
      setSelectedCommission(null);
    }
  };

  const renderCommissionCard = (commission: Commission) => (
    <motion.div
      key={commission.id}
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
                  color: getStatusColor(commission.status),
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {getStatusIcon(commission.status)}
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                {commission.username}
              </Typography>
            </Box>
            <Tooltip title={t('commissionList.processPayment')}>
              <IconButton onClick={() => handlePayment(commission)}>
                <AccountBalanceIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {commission.userId}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('commissionList.amount')}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AttachMoneyIcon sx={{ color: theme.palette.primary.main }} />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {commission.amount} {commission.currency}
                </Typography>
              </Box>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('commissionList.type')}
              </Typography>
              <Chip
                label={t(`commissionList.${commission.type}`)}
                sx={{
                  bgcolor: `${getTypeColor(commission.type)}20`,
                  color: getTypeColor(commission.type),
                  fontWeight: 500,
                }}
              />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('commissionList.status')}
              </Typography>
              <Chip
                label={t(`commissionList.${commission.status}`)}
                sx={{
                  bgcolor: `${getStatusColor(commission.status)}20`,
                  color: getStatusColor(commission.status),
                  fontWeight: 500,
                }}
              />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('commissionList.createdAt')}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {new Date(commission.createdAt).toLocaleString()}
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            {commission.description}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderContent = () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
      {commissions.map(renderCommissionCard)}
    </Box>
  );

  const renderActions = () => (
    <Button
      variant="contained"
      startIcon={<RefreshIcon />}
      onClick={fetchCommissions}
      sx={{
        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        '&:hover': {
          background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
        },
      }}
    >
      {t('commissionList.refresh')}
    </Button>
  );

  return (
    <PageLayout
      title={t('commissionList.title')}
      actions={renderActions()}
      content={renderContent()}
    >
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('commissionList.processPayment')}</DialogTitle>
        <DialogContent>
          {selectedCommission && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedCommission.username}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <AttachMoneyIcon sx={{ color: theme.palette.primary.main }} />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {selectedCommission.amount} {selectedCommission.currency}
                </Typography>
              </Box>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>{t('commissionList.status')}</InputLabel>
                <Select
                  value={paymentStatus}
                  onChange={(e) => setPaymentStatus(e.target.value as 'paid' | 'cancelled')}
                  label={t('commissionList.status')}
                >
                  <MenuItem value="paid">{t('commissionList.paid')}</MenuItem>
                  <MenuItem value="cancelled">{t('commissionList.cancelled')}</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={paymentNote}
                onChange={(e) => setPaymentNote(e.target.value)}
                label={t('commissionList.note')}
              />
            </Box>
          )}
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

export default CommissionList; 