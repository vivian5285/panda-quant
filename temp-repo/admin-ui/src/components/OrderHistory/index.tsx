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
  symbol: string;
  type: 'buy' | 'sell';
  status: 'completed' | 'pending' | 'cancelled';
  amount: number;
  price: number;
  timestamp: string;
}

interface OrderHistoryProps {
  orders: Order[];
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ orders }) => {
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
        return 'success';
      case 'pending':
        return 'warning';
      case 'cancelled':
        return 'error';
    }
  };

  const filteredOrders = orders.filter(order =>
    order.symbol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <StyledCard>
      <StyledBox>
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
                    状态
                  </StyledTypography>
                </TableCell>
                <TableCell align="right">
                  <StyledTypography variant="subtitle1">
                    数量
                  </StyledTypography>
                </TableCell>
                <TableCell align="right">
                  <StyledTypography variant="subtitle1">
                    价格
                  </StyledTypography>
                </TableCell>
                <TableCell align="right">
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
                        {order.symbol}
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
                      <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        {getStatusIcon(order.status)}
                        <Chip
                          label={order.status === 'completed' ? '已完成' : order.status === 'pending' ? '进行中' : '已取消'}
                          color={getStatusColor(order.status)}
                          size="small"
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <StyledTypography>
                        {order.amount.toLocaleString()}
                      </StyledTypography>
                    </TableCell>
                    <TableCell align="right">
                      <StyledTypography>
                        ${order.price.toLocaleString()}
                      </StyledTypography>
                    </TableCell>
                    <TableCell align="right">
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
      </StyledBox>
    </StyledCard>
  );
};

export default OrderHistory; 