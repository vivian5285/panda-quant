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
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';
import { theme } from '../theme';
import { animationConfig } from '../theme/animation';
import PageLayout from '../components/common/PageLayout';

interface Profit {
  id: string;
  userId: string;
  username: string;
  amount: number;
  currency: string;
  type: 'trading' | 'investment' | 'other';
  status: 'pending' | 'confirmed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  description: string;
  profitRate: number;
}

const ProfitList: React.FC = () => {
  const { t } = useTranslation();
  const [profits, setProfits] = useState<Profit[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProfit, setSelectedProfit] = useState<Profit | null>(null);
  const [profitStatus, setProfitStatus] = useState<'confirmed' | 'cancelled'>('confirmed');
  const [profitNote, setProfitNote] = useState('');

  useEffect(() => {
    fetchProfits();
  }, []);

  const fetchProfits = async () => {
    try {
      // Mock API call
      const mockProfits: Profit[] = [
        {
          id: '1',
          userId: 'user1',
          username: 'John Doe',
          amount: 1000,
          currency: 'USDT',
          type: 'trading',
          status: 'pending',
          createdAt: '2024-04-23T10:00:00Z',
          updatedAt: '2024-04-23T10:00:00Z',
          description: 'Trading profit from BTC/USDT pair',
          profitRate: 5.2,
        },
        {
          id: '2',
          userId: 'user2',
          username: 'Jane Smith',
          amount: 500,
          currency: 'BTC',
          type: 'investment',
          status: 'pending',
          createdAt: '2024-04-23T09:00:00Z',
          updatedAt: '2024-04-23T09:00:00Z',
          description: 'Investment profit from staking',
          profitRate: 3.8,
        },
      ];
      setProfits(mockProfits);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const getStatusColor = (status: Profit['status']) => {
    switch (status) {
      case 'pending':
        return theme.palette.warning.main;
      case 'confirmed':
        return theme.palette.success.main;
      case 'cancelled':
        return theme.palette.error.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  const getStatusIcon = (status: Profit['status']) => {
    switch (status) {
      case 'pending':
        return <WarningIcon />;
      case 'confirmed':
        return <CheckCircleIcon />;
      case 'cancelled':
        return <CancelIcon />;
      default:
        return <WarningIcon />;
    }
  };

  const getTypeColor = (type: Profit['type']) => {
    switch (type) {
      case 'trading':
        return theme.palette.primary.main;
      case 'investment':
        return theme.palette.secondary.main;
      case 'other':
        return theme.palette.info.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  const handleConfirm = (profit: Profit) => {
    setSelectedProfit(profit);
    setProfitStatus('confirmed');
    setProfitNote('');
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (selectedProfit) {
      const updatedProfits = profits.map((profit) =>
        profit.id === selectedProfit.id
          ? {
              ...profit,
              status: profitStatus,
              updatedAt: new Date().toISOString(),
              description: profitNote || profit.description,
            }
          : profit
      );
      setProfits(updatedProfits);
      setOpenDialog(false);
      setSelectedProfit(null);
    }
  };

  const renderProfitCard = (profit: Profit) => (
    <motion.div
      key={profit.id}
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
                  color: getStatusColor(profit.status),
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {getStatusIcon(profit.status)}
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                {profit.username}
              </Typography>
            </Box>
            <Tooltip title={t('profitList.confirm')}>
              <IconButton onClick={() => handleConfirm(profit)}>
                <EditIcon />
              </IconButton>
            </Tooltip>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {profit.userId}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('profitList.amount')}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AttachMoneyIcon sx={{ color: theme.palette.primary.main }} />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {profit.amount} {profit.currency}
                </Typography>
              </Box>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('profitList.type')}
              </Typography>
              <Chip
                label={t(`profitList.${profit.type}`)}
                sx={{
                  bgcolor: `${getTypeColor(profit.type)}20`,
                  color: getTypeColor(profit.type),
                  fontWeight: 500,
                }}
              />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('profitList.status')}
              </Typography>
              <Chip
                label={t(`profitList.${profit.status}`)}
                sx={{
                  bgcolor: `${getStatusColor(profit.status)}20`,
                  color: getStatusColor(profit.status),
                  fontWeight: 500,
                }}
              />
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('profitList.profitRate')}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {profit.profitRate >= 0 ? (
                  <TrendingUpIcon sx={{ color: theme.palette.success.main }} />
                ) : (
                  <TrendingDownIcon sx={{ color: theme.palette.error.main }} />
                )}
                <Typography
                  variant="body1"
                  sx={{
                    fontWeight: 500,
                    color: profit.profitRate >= 0 ? theme.palette.success.main : theme.palette.error.main,
                  }}
                >
                  {profit.profitRate}%
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('profitList.createdAt')}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {new Date(profit.createdAt).toLocaleString()}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('profitList.updatedAt')}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {new Date(profit.updatedAt).toLocaleString()}
              </Typography>
            </Box>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
            {profit.description}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderContent = () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
      {profits.map(renderProfitCard)}
    </Box>
  );

  const renderActions = () => (
    <Button
      variant="contained"
      startIcon={<RefreshIcon />}
      onClick={fetchProfits}
      sx={{
        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        '&:hover': {
          background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
        },
      }}
    >
      {t('profitList.refresh')}
    </Button>
  );

  return (
    <PageLayout
      title={t('profitList.title')}
      actions={renderActions()}
      content={renderContent()}
    >
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('profitList.confirmProfit')}</DialogTitle>
        <DialogContent>
          {selectedProfit && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedProfit.username}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <AttachMoneyIcon sx={{ color: theme.palette.primary.main }} />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {selectedProfit.amount} {selectedProfit.currency}
                </Typography>
              </Box>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>{t('profitList.status')}</InputLabel>
                <Select
                  value={profitStatus}
                  onChange={(e) => setProfitStatus(e.target.value as 'confirmed' | 'cancelled')}
                  label={t('profitList.status')}
                >
                  <MenuItem value="confirmed">{t('profitList.confirmed')}</MenuItem>
                  <MenuItem value="cancelled">{t('profitList.cancelled')}</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={profitNote}
                onChange={(e) => setProfitNote(e.target.value)}
                label={t('profitList.note')}
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

export default ProfitList; 