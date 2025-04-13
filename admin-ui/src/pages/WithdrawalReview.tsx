import React, { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Pagination,
  Alert,
  CircularProgress,
} from '@mui/material';
import { useAuth } from '../hooks/useAuth';

interface Order {
  _id: string;
  userId: {
    email: string;
  };
  amount: number;
  chain: string;
  address: string;
  status: string;
  createdAt: string;
}

const WithdrawalReview: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [remark, setRemark] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await fetch(`/api/admin/orders?page=${page}&type=withdrawal`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
          },
        });

        if (!response.ok) {
          throw new Error('获取订单列表失败');
        }

        const data = await response.json();
        setOrders(data.orders);
        setTotalPages(data.totalPages);
      } catch (err) {
        setError(err instanceof Error ? err.message : '获取订单列表失败');
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchOrders();
    }
  }, [isAuthenticated, page]);

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
        throw new Error('审核失败');
      }

      setOrders(orders.map(order =>
        order._id === selectedOrder._id
          ? { ...order, status }
          : order
      ));
      setDialogOpen(false);
      setSelectedOrder(null);
      setRemark('');
    } catch (err) {
      setError(err instanceof Error ? err.message : '审核失败');
    }
  };

  if (!isAuthenticated) {
    return (
      <Container maxWidth="lg">
        <Alert severity="warning">请先登录</Alert>
      </Container>
    );
  }

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          提现审核
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>用户邮箱</TableCell>
                <TableCell>提现金额</TableCell>
                <TableCell>链</TableCell>
                <TableCell>地址</TableCell>
                <TableCell>状态</TableCell>
                <TableCell>创建时间</TableCell>
                <TableCell>操作</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order.userId.email}</TableCell>
                  <TableCell>{order.amount}</TableCell>
                  <TableCell>{order.chain}</TableCell>
                  <TableCell>{order.address}</TableCell>
                  <TableCell>{order.status}</TableCell>
                  <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => {
                        setSelectedOrder(order);
                        setDialogOpen(true);
                      }}
                    >
                      审核
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
          />
        </Box>

        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>审核提现请求</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="备注"
              value={remark}
              onChange={(e) => setRemark(e.target.value)}
              sx={{ mt: 2 }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>取消</Button>
            <Button
              onClick={() => handleApprove('rejected')}
              color="error"
            >
              拒绝
            </Button>
            <Button
              onClick={() => handleApprove('approved')}
              color="primary"
            >
              通过
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default WithdrawalReview; 