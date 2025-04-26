import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Button,
  IconButton,
  Tooltip as MuiTooltip,
  Chip,
  useTheme,
  alpha,
  CircularProgress,
  Alert
} from '@mui/material';
import {
  Add as AddIcon,
  Search as SearchIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import {
  Container,
  Grid,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { motion } from 'framer-motion';
import {
  Save as SaveIcon,
  Edit as EditIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Warning as WarningIcon,
  AttachMoney as AttachMoneyIcon,
} from '@mui/icons-material';
import { theme } from '../theme';
import { animationConfig } from '../theme/animation';
import PageLayout from '../components/common/PageLayout';

interface WithdrawalRequest {
  id: string;
  userId: string;
  username: string;
  amount: number;
  currency: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
  walletAddress: string;
  reason?: string;
}

const WithdrawalReview: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [data, setData] = useState<WithdrawalRequest[]>([]);
  const [selectedWithdrawal, setSelectedWithdrawal] = useState<WithdrawalRequest | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [_loading, setLoading] = useState(false);
  const [_error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [reviewStatus, setReviewStatus] = useState<'approved' | 'rejected'>('approved');
  const [reviewReason, setReviewReason] = useState('');

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      // Mock API call
      const mockRequests: WithdrawalRequest[] = [
        {
          id: '1',
          userId: 'user1',
          username: 'John Doe',
          amount: 1000,
          currency: 'USDT',
          status: 'pending',
          createdAt: '2024-04-23T10:00:00Z',
          updatedAt: '2024-04-23T10:00:00Z',
          walletAddress: '0x1234...5678',
        },
        {
          id: '2',
          userId: 'user2',
          username: 'Jane Smith',
          amount: 500,
          currency: 'BTC',
          status: 'pending',
          createdAt: '2024-04-23T09:00:00Z',
          updatedAt: '2024-04-23T09:00:00Z',
          walletAddress: 'bc1q...xyz',
        },
      ];
      setData(mockRequests);
      setLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      setLoading(false);
    }
  };

  const getStatusColor = (status: WithdrawalRequest['status']) => {
    switch (status) {
      case 'pending':
        return theme.palette.warning.main;
      case 'approved':
        return theme.palette.success.main;
      case 'rejected':
        return theme.palette.error.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  const getStatusIcon = (status: WithdrawalRequest['status']) => {
    switch (status) {
      case 'pending':
        return <WarningIcon />;
      case 'approved':
        return <CheckCircleIcon />;
      case 'rejected':
        return <CancelIcon />;
      default:
        return <WarningIcon />;
    }
  };

  const handleReview = (request: WithdrawalRequest) => {
    setSelectedWithdrawal(request);
    setReviewStatus('approved');
    setReviewReason('');
    setOpenDialog(true);
  };

  const handleSave = () => {
    if (selectedWithdrawal) {
      const updatedRequests = data.map((request) =>
        request.id === selectedWithdrawal.id
          ? {
              ...request,
              status: reviewStatus,
              updatedAt: new Date().toISOString(),
              reason: reviewReason,
            }
          : request
      );
      setData(updatedRequests);
      setOpenDialog(false);
      setSelectedWithdrawal(null);
    }
  };

  const renderRequestCard = (request: WithdrawalRequest) => (
    <motion.div
      key={request.id}
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
                  color: getStatusColor(request.status),
                  display: 'flex',
                  alignItems: 'center',
                }}
              >
                {getStatusIcon(request.status)}
              </Box>
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                {request.username}
              </Typography>
            </Box>
            <MuiTooltip title={t('withdrawalReview.review')}>
              <IconButton onClick={() => handleReview(request)}>
                <EditIcon />
              </IconButton>
            </MuiTooltip>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {request.userId}
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('withdrawalReview.amount')}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <AttachMoneyIcon sx={{ color: theme.palette.primary.main }} />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {request.amount} {request.currency}
                </Typography>
              </Box>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('withdrawalReview.status')}
              </Typography>
              <Chip
                label={t(`withdrawalReview.${request.status}`)}
                sx={{
                  bgcolor: `${getStatusColor(request.status)}20`,
                  color: getStatusColor(request.status),
                  fontWeight: 500,
                }}
              />
            </Box>
          </Box>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('withdrawalReview.createdAt')}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {new Date(request.createdAt).toLocaleString()}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                {t('withdrawalReview.updatedAt')}
              </Typography>
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                {new Date(request.updatedAt).toLocaleString()}
              </Typography>
            </Box>
          </Box>
          <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
            {t('withdrawalReview.walletAddress')}: {request.walletAddress}
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );

  const renderContent = () => (
    <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 3 }}>
      {data.map(renderRequestCard)}
    </Box>
  );

  const renderActions = () => (
    <Button
      variant="contained"
      startIcon={<RefreshIcon />}
      onClick={fetchRequests}
      sx={{
        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        '&:hover': {
          background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
        },
      }}
    >
      {t('withdrawalReview.refresh')}
    </Button>
  );

  return (
    <PageLayout
      title={t('withdrawalReview.title')}
      actions={renderActions()}
      content={renderContent()}
    >
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{t('withdrawalReview.reviewRequest')}</DialogTitle>
        <DialogContent>
          {selectedWithdrawal && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedWithdrawal.username}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                <AttachMoneyIcon sx={{ color: theme.palette.primary.main }} />
                <Typography variant="body1" sx={{ fontWeight: 500 }}>
                  {selectedWithdrawal.amount} {selectedWithdrawal.currency}
                </Typography>
              </Box>
              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>{t('withdrawalReview.status')}</InputLabel>
                <Select
                  value={reviewStatus}
                  onChange={(e) => setReviewStatus(e.target.value as 'approved' | 'rejected')}
                  label={t('withdrawalReview.status')}
                >
                  <MenuItem value="approved">{t('withdrawalReview.approved')}</MenuItem>
                  <MenuItem value="rejected">{t('withdrawalReview.rejected')}</MenuItem>
                </Select>
              </FormControl>
              <TextField
                fullWidth
                multiline
                rows={3}
                value={reviewReason}
                onChange={(e) => setReviewReason(e.target.value)}
                label={t('withdrawalReview.reason')}
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

export default WithdrawalReview; 