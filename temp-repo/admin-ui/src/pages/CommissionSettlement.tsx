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

interface Settlement {
  id: string;
  userId: string;
  username: string;
  amount: number;
  currency: string;
  type: 'referral' | 'trading' | 'other';
  status: 'pending' | 'settled' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  description: string;
  settlementDate?: string;
}

const CommissionSettlement: React.FC = () => {
  const { t } = useTranslation();
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSettlement, setSelectedSettlement] = useState<Settlement | null>(null);
  const [settlementStatus, setSettlementStatus] = useState<'settled' | 'cancelled'>('settled');
  const [settlementNote, setSettlementNote] = useState('');

  useEffect(() => {
    fetchSettlements();
  }, []);

  const fetchSettlements = async () => {
    try {
      // Mock API call
      const mockSettlements: Settlement[] = [
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
      setSettlements(mockSettlements);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const getStatusColor = (status: Settlement['status']) => {
    switch (status) {
      case 'pending':
        return theme.palette.warning.main;
      case 'settled':
        return theme.palette.success.main;
      case 'cancelled':
        return theme.palette.error.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  const getStatusIcon = (status: Settlement['status']) => {
    switch (status) {
      case 'pending':
        return <WarningIcon />;
      case 'settled':
        return <CheckCircleIcon />;
      case 'cancelled':
        return <CancelIcon />;
      default:
        return <WarningIcon />;
    }
  };

  const getTypeColor = (type: Settlement['type']) => {
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

  const handleSettle = (settlement: Settlement) => {
    setSelectedSettlement(settlement);
    setSettlementStatus('settled');
    setSettlementNote('');
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (selectedSettlement) {
      const updatedSettlements = settlements.map((settlement) =>
        settlement.id === selectedSettlement.id
          ? {
              ...settlement,
              status: settlementStatus,
              updatedAt: new Date().toISOString(),
              settlementDate: settlementStatus === 'settled' ? new Date().toISOString() : undefined,
              description: settlementNote || settlement.description,
            }
          : settlement
      );
      setSettlements(updatedSettlements);
      setOpenDialog(false);
      setSelectedSettlement(null);
    }
  };

  const renderSettlementCard = (settlement: Settlement) => (
    <motion.div
      key={settlement.id}
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
                  color: getStatusColor(settlement.status),
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {getStatusIcon(settlement.status)}
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                {settlement.username}
              </Typography>
            </Box>
            <Tooltip title={t('commissionSettlement.settle')}>
              <IconButton onClick={() => handleSettle(settlement)}>
                <AccountBalanceIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {settlement.userId}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('commissionSettlement.amount')}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AttachMoneyIcon sx={{ color: theme.palette.primary.main }} />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {settlement.amount} {settlement.currency}
                </Typography>
              </Box>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('commissionSettlement.type')}
              </Typography>
              <Chip
                label={t(`commissionSettlement.${settlement.type}`)}
                sx={{
                  bgcolor: `${getTypeColor(settlement.type)}20`,
                  color: getTypeColor(settlement.type),
                  fontWeight: 500,
                }}
              />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('commissionSettlement.status')}
              </Typography>
              <Chip
                label={t(`commissionSettlement.${settlement.status}`)}
                sx={{
                  bgcolor: `${getStatusColor(settlement.status)}20`,
                  color: getStatusColor(settlement.status),
                  fontWeight: 500,
                }}
              />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('commissionSettlement.createdAt')}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {new Date(settlement.createdAt).toLocaleString()}
              </Typography>
            </Box>
          </Box>
          {settlement.settlementDate && (
            <Box sx={{ mb: 2 }}>
              <Typography variant="body2" color="text.secondary">
                {t('commissionSettlement.settlementDate')}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {new Date(settlement.settlementDate).toLocaleString()}
              </Typography>
            </Box>
          )}
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            {settlement.description}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderContent = () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
      {settlements.map(renderSettlementCard)}
    </Box>
  );

  const renderActions = () => (
    <Button
      variant="contained"
      startIcon={<RefreshIcon />}
      onClick={fetchSettlements}
      sx={{
        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        '&:hover': {
          background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
        },
      }}
    >
      {t('commissionSettlement.refresh')}
    </Button>
  );

  return (
    <PageLayout
      title={t('commissionSettlement.title')}
      actions={renderActions()}
      content={renderContent()}
    >
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('commissionSettlement.settleCommission')}</DialogTitle>
        <DialogContent>
          {selectedSettlement && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedSettlement.username}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <AttachMoneyIcon sx={{ color: theme.palette.primary.main }} />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {selectedSettlement.amount} {selectedSettlement.currency}
                </Typography>
              </Box>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>{t('commissionSettlement.status')}</InputLabel>
                <Select
                  value={settlementStatus}
                  onChange={(e) => setSettlementStatus(e.target.value as 'settled' | 'cancelled')}
                  label={t('commissionSettlement.status')}
                >
                  <MenuItem value="settled">{t('commissionSettlement.settled')}</MenuItem>
                  <MenuItem value="cancelled">{t('commissionSettlement.cancelled')}</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={settlementNote}
                onChange={(e) => setSettlementNote(e.target.value)}
                label={t('commissionSettlement.note')}
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

export default CommissionSettlement; 