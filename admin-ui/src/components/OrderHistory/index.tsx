import React, { useState } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  Chip,
  IconButton,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Typography,
} from '@mui/material';
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  CheckCircle as CheckCircleIcon,
  Cancel as CancelIcon,
  Pending as PendingIcon,
} from '@mui/icons-material';
import { StyledCard, StyledBox, StyledTypography } from '../common/StyledComponents';
import { themeUtils } from '../../theme';

interface Order {
  id: string;
  tradingPair: string;
  type: 'buy' | 'sell';
  status: 'failed' | 'pending' | 'completed' | 'cancelled';
  amount: number;
  price: number;
  timestamp: string;
}

interface OrderHistoryProps {
  orders: Order[];
  success?: boolean;
  warning?: boolean;
  error?: boolean;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ orders, success, warning, error }) => {
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon sx={{ color: themeUtils.palette.success.main }} />;
      case 'pending':
        return <PendingIcon sx={{ color: themeUtils.palette.warning.main }} />;
      case 'cancelled':
        return <CancelIcon sx={{ color: themeUtils.palette.error.main }} />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return themeUtils.palette.success.main;
      case 'pending':
        return themeUtils.palette.warning.main;
      case 'cancelled':
      case 'failed':
        return themeUtils.palette.error.main;
      default:
        return themeUtils.palette.text.secondary;
    }
  };

  const filteredOrders = orders.filter(order =>
    order.tradingPair.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Card
      sx={{
        borderRadius: 2,
        boxShadow: themeUtils.custom.shadows.card,
        '&:hover': {
          boxShadow: themeUtils.custom.shadows.cardHover,
        },
      }}
    >
      <CardContent>
        <Typography
          variant="h6"
          gutterBottom
          sx={{
            color: themeUtils.palette.text.primary,
            fontWeight: 600,
          }}
        >
          订单历史
        </Typography>
        <Box sx={{ mb: 3 }}>
          <TextField
            fullWidth
            variant="outlined"
            placeholder="搜索交易对..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: themeUtils.palette.primary.main }} />
                </InputAdornment>
              ),
              endAdornment: searchTerm && (
                <InputAdornment position="end">
                  <IconButton onClick={() => setSearchTerm('')}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
        </Box>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <StyledTypography variant="subtitle1">
                    交易对
                  </StyledTypography>
                </TableCell>
                <TableCell>
                  <StyledTypography variant="subtitle1">
                    类型
                  </StyledTypography>
                </TableCell>
                <TableCell>
                  <StyledTypography variant="subtitle1">
                    数量
                  </StyledTypography>
                </TableCell>
                <TableCell>
                  <StyledTypography variant="subtitle1">
                    价格
                  </StyledTypography>
                </TableCell>
                <TableCell>
                  <StyledTypography variant="subtitle1">
                    状态
                  </StyledTypography>
                </TableCell>
                <TableCell>
                  <StyledTypography variant="subtitle1">
                    时间
                  </StyledTypography>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>
                      <StyledTypography>
                        {order.tradingPair}
                      </StyledTypography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={order.type === 'buy' ? '买入' : '卖出'}
                        color={order.type === 'buy' ? 'success' : 'error'}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <StyledTypography>
                        {order.amount.toLocaleString()}
                      </StyledTypography>
                    </TableCell>
                    <TableCell>
                      <StyledTypography>
                        ${order.price.toLocaleString()}
                      </StyledTypography>
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          order.status === 'completed'
                            ? '已完成'
                            : order.status === 'pending'
                            ? '处理中'
                            : order.status === 'cancelled'
                            ? '已取消'
                            : '失败'
                        }
                        sx={{
                          backgroundColor: getStatusColor(order.status),
                          color: '#fff',
                        }}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <StyledTypography>
                        {new Date(order.timestamp).toLocaleString()}
                      </StyledTypography>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredOrders.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </CardContent>
    </Card>
  );
};

export default OrderHistory; 