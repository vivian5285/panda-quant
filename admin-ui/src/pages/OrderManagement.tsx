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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Card,
  CardContent,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  Clear as ClearIcon,
  FilterList as FilterIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
} from '@mui/icons-material';
import { getOrders, createOrder, updateOrder, deleteOrder } from '../api/orders';
import { Order } from '../types/order';
import theme from '../theme';
import { animationConfig } from '../theme/animation';
import PageLayout from '../components/common/PageLayout';

const OrderManagement: React.FC = () => {
  const { t } = useTranslation();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'create' | 'edit'>('create');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [totalPages, setTotalPages] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await getOrders();
      if (response && response.data) {
        const ordersData = response.data.data || [];
        const processedOrders = ordersData.map(order => ({
          ...order,
          totalAmount: order.totalAmount ?? order.price * order.amount
        }));
        setOrders(processedOrders);
        setTotalPages(Math.ceil(response.data.total / pageSize));
      } else {
        setOrders([]);
        setTotalPages(1);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return theme.palette.success.main;
      case 'cancelled':
        return theme.palette.error.main;
      case 'failed':
        return theme.palette.error.main;
      case 'pending':
        return theme.palette.warning.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  const getTypeColor = (type: Order['type']) => {
    switch (type) {
      case 'buy':
        return theme.palette.success.main;
      case 'sell':
        return theme.palette.error.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon sx={{ color: theme.palette.success.main }} />;
      case 'cancelled':
        return <CancelIcon sx={{ color: theme.palette.error.main }} />;
      case 'failed':
        return <CancelIcon sx={{ color: theme.palette.error.main }} />;
      case 'pending':
        return <PendingIcon sx={{ color: theme.palette.warning.main }} />;
      default:
        return undefined;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = searchTerm === '' || 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order._id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesType = typeFilter === 'all' || order.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const renderFilters = () => (
    <Card
      sx={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[2],
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '4px',
          background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
        },
      }}
    >
      <CardContent>
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder={t('orderManagement.searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <SearchIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
              ),
              endAdornment: searchTerm && (
                <IconButton onClick={() => setSearchTerm('')}>
                  <ClearIcon />
                </IconButton>
              ),
            }}
          />
        </Box>

        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <FormControl fullWidth>
            <InputLabel>{t('orderManagement.status')}</InputLabel>
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              label={t('orderManagement.status')}
            >
              <MenuItem value="all">{t('orderManagement.all')}</MenuItem>
              <MenuItem value="pending">{t('orderManagement.pending')}</MenuItem>
              <MenuItem value="completed">{t('orderManagement.completed')}</MenuItem>
              <MenuItem value="cancelled">{t('orderManagement.cancelled')}</MenuItem>
              <MenuItem value="failed">{t('orderManagement.failed')}</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>{t('orderManagement.type')}</InputLabel>
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              label={t('orderManagement.type')}
            >
              <MenuItem value="all">{t('orderManagement.all')}</MenuItem>
              <MenuItem value="buy">{t('orderManagement.buy')}</MenuItem>
              <MenuItem value="sell">{t('orderManagement.sell')}</MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {t('orderManagement.totalOrders', { count: filteredOrders.length })}
          </Typography>
          <Tooltip title={t('orderManagement.refresh')}>
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: animationConfig.duration.long }}
            >
              <IconButton onClick={fetchOrders}>
                <RefreshIcon />
              </IconButton>
            </motion.div>
          </Tooltip>
        </Box>
      </CardContent>
    </Card>
  );

  const renderContent = () => (
    <motion.div
      initial={animationConfig.variants.fadeIn.initial}
      animate={animationConfig.variants.fadeIn.animate}
      transition={{ duration: animationConfig.duration.medium }}
    >
      <Card>
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>{t('orderManagement.id')}</TableCell>
                  <TableCell>{t('orderManagement.tradingPair')}</TableCell>
                  <TableCell>{t('orderManagement.type')}</TableCell>
                  <TableCell>{t('orderManagement.status')}</TableCell>
                  <TableCell>{t('orderManagement.price')}</TableCell>
                  <TableCell>{t('orderManagement.amount')}</TableCell>
                  <TableCell>{t('orderManagement.totalAmount')}</TableCell>
                  <TableCell>{t('orderManagement.createdAt')}</TableCell>
                  <TableCell>{t('orderManagement.actions')}</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>{order._id}</TableCell>
                    <TableCell>{order.tradingPair}</TableCell>
                    <TableCell>
                      <Chip
                        label={t(`orderManagement.${order.type}`)}
                        color={order.type === 'buy' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {getStatusIcon(order.status)}
                        <Typography>{t(`orderManagement.${order.status}`)}</Typography>
                      </Box>
                    </TableCell>
                    <TableCell>{order.price.toFixed(2)}</TableCell>
                    <TableCell>{order.amount}</TableCell>
                    <TableCell>{order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>{new Date(order.createdAt).toLocaleString()}</TableCell>
                    <TableCell>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Tooltip title={t('orderManagement.edit')}>
                          <IconButton
                            size="small"
                            onClick={() => handleEditOrder(order)}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title={t('orderManagement.delete')}>
                          <IconButton
                            size="small"
                            onClick={() => handleDeleteOrder(order)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            component="div"
            count={filteredOrders.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </CardContent>
      </Card>
    </motion.div>
  );

  const handleEditOrder = (order: Order) => {
    setSelectedOrder(order);
    setDialogType('edit');
    setOpenDialog(true);
  };

  const handleDeleteOrder = (order: Order) => {
    // Handle delete
  };

  return (
    <PageLayout
      title={t('orderManagement.title')}
      filters={renderFilters()}
    >
      {renderContent()}
    </PageLayout>
  );
};

export default OrderManagement; 