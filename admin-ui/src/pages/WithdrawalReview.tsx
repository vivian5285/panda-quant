import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Pagination,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import {
  Search as SearchIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';

interface Order {
  _id: string;
  userId: string;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

const WithdrawalReview: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [remark, setRemark] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/admin/orders?page=${page}&type=withdrawal`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error(t('withdrawal.fetchError'));
        }

        const data = await response.json();
        setOrders(data.orders);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('withdrawal.fetchError'));
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, page, t]);

  const handleApprove = async (status: string) => {
    if (!selectedOrder) return;

    try {
      const response = await fetch(`/api/admin/withdrawal/${selectedOrder._id}/approve`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ status, remark }),
      });

      if (!response.ok) {
        throw new Error(t('withdrawal.approveError'));
      }

      setOrders(orders.map(order =>
        order._id === selectedOrder._id
          ? { ...order, status }
          : order
      ));
      setOpenDialog(false);
      setSelectedOrder(null);
      setRemark('');
    } catch (err) {
      setError(err instanceof Error ? err.message : t('withdrawal.approveError'));
    }
  };

  const filteredOrders = orders.filter(order =>
    order.userId.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.status.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const columns: GridColDef[] = [
    { field: 'userId', headerName: t('withdrawal.userId'), width: 200 },
    { field: 'amount', headerName: t('withdrawal.amount'), width: 150 },
    { field: 'status', headerName: t('withdrawal.status'), width: 150 },
    { field: 'createdAt', headerName: t('withdrawal.createdAt'), width: 200 },
    {
      field: 'actions',
      headerName: t('withdrawal.actions'),
      width: 150,
      renderCell: (params) => (
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            setSelectedOrder(params.row);
            setOpenDialog(true);
          }}
        >
          {t('withdrawal.review')}
        </Button>
      ),
    },
  ];

  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg">
        <Alert severity="warning" sx={{ mt: 2 }}>
          {t('withdrawal.loginRequired')}
        </Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="400px"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          {t('withdrawal.title')}
        </Typography>

        {error && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography color="error">{error}</Typography>
            </CardContent>
          </Card>
        )}

        <Paper sx={{ p: 2, mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={t('withdrawal.searchPlaceholder')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setSearchQuery('')}
                    size="small"
                  >
                    <CloseIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Paper>

        <Paper sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={filteredOrders}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10, page: 0 },
              },
            }}
            pageSizeOptions={[10]}
            disableRowSelectionOnClick
          />
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
          <DialogTitle>{t('withdrawal.reviewTitle')}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              multiline
              rows={4}
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              placeholder={t('withdrawal.remarkPlaceholder')}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDialog(false)}>
              {t('withdrawal.cancel')}
            </Button>
            <Button
              onClick={() => handleApprove('approved')}
              color="primary"
              variant="contained"
            >
              {t('withdrawal.approve')}
            </Button>
            <Button
              onClick={() => handleApprove('rejected')}
              color="error"
              variant="contained"
            >
              {t('withdrawal.reject')}
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default WithdrawalReview; 