import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  useTheme,
  alpha,
  CircularProgress,
  Divider,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from '@mui/material';
import {
  Search as SearchIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  Pending as PendingIcon,
  CheckCircle as CheckCircleIcon,
  Warning as WarningIcon,
  BarChart as BarChartIcon,
  Timeline as TimelineIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';

interface Strategy {
  _id: string;
  name: string;
  description: string;
  type: 'trend' | 'mean' | 'arbitrage';
  status: 'active' | 'inactive' | 'pending';
  performance: {
    totalReturn: number;
    sharpeRatio: number;
    maxDrawdown: number;
  };
  createdAt: string;
  updatedAt: string;
}

const StrategyManager: React.FC = () => {
  const theme = useTheme();
  const [strategies, setStrategies] = useState<Strategy[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStrategy, setSelectedStrategy] = useState<Strategy | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'view' | 'edit' | 'delete'>('view');

  useEffect(() => {
    fetchStrategies();
  }, []);

  const fetchStrategies = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/strategies');
      const data = await response.json();
      setStrategies(data);
    } catch (error) {
      console.error('Error fetching strategies:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return theme.palette.success.main;
      case 'inactive':
        return theme.palette.warning.main;
      case 'pending':
        return theme.palette.info.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircleIcon />;
      case 'inactive':
        return <WarningIcon />;
      case 'pending':
        return <PendingIcon />;
      default:
        return null;
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'trend':
        return theme.palette.primary.main;
      case 'mean':
        return theme.palette.secondary.main;
      case 'arbitrage':
        return theme.palette.info.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  const handleOpenDialog = (strategy: Strategy, type: 'view' | 'edit' | 'delete') => {
    setSelectedStrategy(strategy);
    setDialogType(type);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setSelectedStrategy(null);
  };

  const filteredStrategies = strategies.filter(strategy =>
    strategy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    strategy.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom sx={{ 
        color: theme.palette.primary.main,
        fontWeight: 'bold',
        mb: 4
      }}>
        策略管理
      </Typography>

      {/* 搜索和过滤区域 */}
      <Card sx={{
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.05)} 0%, ${alpha(theme.palette.primary.main, 0.02)} 100%)`,
        boxShadow: 'none',
        borderRadius: 2,
        mb: 3
      }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="搜索策略..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: theme.palette.primary.main }} />
                    </InputAdornment>
                  ),
                  sx: {
                    borderRadius: 2,
                    '&:hover': {
                      backgroundColor: alpha(theme.palette.primary.main, 0.05)
                    }
                  }
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: 'none',
                    transform: 'translateY(-2px)',
                    transition: 'transform 0.3s ease-in-out'
                  }
                }}
              >
                添加策略
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* 策略列表 */}
      <TableContainer 
        component={Paper} 
        sx={{
          borderRadius: 2,
          boxShadow: 'none',
          background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.8)} 0%, ${alpha(theme.palette.background.paper, 0.6)} 100%)`
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ 
                fontWeight: 'bold',
                color: theme.palette.primary.main,
                borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`
              }}>
                策略名称
              </TableCell>
              <TableCell sx={{ 
                fontWeight: 'bold',
                color: theme.palette.primary.main,
                borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`
              }}>
                类型
              </TableCell>
              <TableCell sx={{ 
                fontWeight: 'bold',
                color: theme.palette.primary.main,
                borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`
              }}>
                状态
              </TableCell>
              <TableCell sx={{ 
                fontWeight: 'bold',
                color: theme.palette.primary.main,
                borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`
              }}>
                总收益
              </TableCell>
              <TableCell sx={{ 
                fontWeight: 'bold',
                color: theme.palette.primary.main,
                borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`
              }}>
                夏普比率
              </TableCell>
              <TableCell sx={{ 
                fontWeight: 'bold',
                color: theme.palette.primary.main,
                borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`
              }}>
                最大回撤
              </TableCell>
              <TableCell sx={{ 
                fontWeight: 'bold',
                color: theme.palette.primary.main,
                borderBottom: `2px solid ${alpha(theme.palette.primary.main, 0.1)}`
              }}>
                操作
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredStrategies.map((strategy) => (
              <TableRow
                key={strategy._id}
                sx={{
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.05),
                    transition: 'background-color 0.3s ease-in-out'
                  }
                }}
              >
                <TableCell>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    {strategy.name}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {strategy.description}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip
                    label={strategy.type}
                    sx={{
                      backgroundColor: alpha(getTypeColor(strategy.type), 0.1),
                      color: getTypeColor(strategy.type),
                      borderRadius: 1,
                      fontWeight: 'bold'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Chip
                    icon={getStatusIcon(strategy.status)}
                    label={strategy.status}
                    sx={{
                      backgroundColor: alpha(getStatusColor(strategy.status), 0.1),
                      color: getStatusColor(strategy.status),
                      borderRadius: 1,
                      fontWeight: 'bold'
                    }}
                  />
                </TableCell>
                <TableCell>
                  <Typography sx={{ 
                    color: strategy.performance.totalReturn >= 0 ? 
                      theme.palette.success.main : 
                      theme.palette.error.main,
                    fontWeight: 'bold'
                  }}>
                    {strategy.performance.totalReturn >= 0 ? '+' : ''}
                    {strategy.performance.totalReturn.toFixed(2)}%
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ fontWeight: 'bold' }}>
                    {strategy.performance.sharpeRatio.toFixed(2)}
                  </Typography>
                </TableCell>
                <TableCell>
                  <Typography sx={{ 
                    color: theme.palette.warning.main,
                    fontWeight: 'bold'
                  }}>
                    {strategy.performance.maxDrawdown.toFixed(2)}%
                  </Typography>
                </TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Tooltip title="查看详情">
                      <IconButton
                        onClick={() => handleOpenDialog(strategy, 'view')}
                        sx={{
                          color: theme.palette.primary.main,
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.primary.main, 0.1)
                          }
                        }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="编辑">
                      <IconButton
                        onClick={() => handleOpenDialog(strategy, 'edit')}
                        sx={{
                          color: theme.palette.warning.main,
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.warning.main, 0.1)
                          }
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="删除">
                      <IconButton
                        onClick={() => handleOpenDialog(strategy, 'delete')}
                        sx={{
                          color: theme.palette.error.main,
                          '&:hover': {
                            backgroundColor: alpha(theme.palette.error.main, 0.1)
                          }
                        }}
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

      {/* 详情对话框 */}
      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            background: `linear-gradient(135deg, ${alpha(theme.palette.background.paper, 0.9)} 0%, ${alpha(theme.palette.background.paper, 0.7)} 100%)`
          }
        }}
      >
        {selectedStrategy && (
          <>
            <DialogTitle sx={{ 
              color: theme.palette.primary.main,
              fontWeight: 'bold',
              borderBottom: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
            }}>
              {dialogType === 'view' ? '策略详情' : 
               dialogType === 'edit' ? '编辑策略' : '删除策略'}
            </DialogTitle>
            <DialogContent sx={{ mt: 2 }}>
              {dialogType === 'view' && (
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <Typography variant="h6" gutterBottom>
                      {selectedStrategy.name}
                    </Typography>
                    <Typography color="textSecondary" paragraph>
                      {selectedStrategy.description}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card sx={{
                      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
                      boxShadow: 'none',
                      borderRadius: 2
                    }}>
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          基本信息
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography sx={{ minWidth: 100 }}>类型:</Typography>
                            <Chip
                              label={selectedStrategy.type}
                              sx={{
                                backgroundColor: alpha(getTypeColor(selectedStrategy.type), 0.1),
                                color: getTypeColor(selectedStrategy.type),
                                borderRadius: 1,
                                fontWeight: 'bold'
                              }}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography sx={{ minWidth: 100 }}>状态:</Typography>
                            <Chip
                              icon={getStatusIcon(selectedStrategy.status)}
                              label={selectedStrategy.status}
                              sx={{
                                backgroundColor: alpha(getStatusColor(selectedStrategy.status), 0.1),
                                color: getStatusColor(selectedStrategy.status),
                                borderRadius: 1,
                                fontWeight: 'bold'
                              }}
                            />
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography sx={{ minWidth: 100 }}>创建时间:</Typography>
                            <Typography>
                              {format(new Date(selectedStrategy.createdAt), 'yyyy-MM-dd HH:mm', { locale: zhCN })}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <Typography sx={{ minWidth: 100 }}>更新时间:</Typography>
                            <Typography>
                              {format(new Date(selectedStrategy.updatedAt), 'yyyy-MM-dd HH:mm', { locale: zhCN })}
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <Card sx={{
                      background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.success.main, 0.05)} 100%)`,
                      boxShadow: 'none',
                      borderRadius: 2
                    }}>
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          性能指标
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <TrendingUpIcon sx={{ 
                              color: theme.palette.success.main,
                              mr: 1
                            }} />
                            <Typography sx={{ minWidth: 100 }}>总收益:</Typography>
                            <Typography sx={{ 
                              color: selectedStrategy.performance.totalReturn >= 0 ? 
                                theme.palette.success.main : 
                                theme.palette.error.main,
                              fontWeight: 'bold'
                            }}>
                              {selectedStrategy.performance.totalReturn >= 0 ? '+' : ''}
                              {selectedStrategy.performance.totalReturn.toFixed(2)}%
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <BarChartIcon sx={{ 
                              color: theme.palette.info.main,
                              mr: 1
                            }} />
                            <Typography sx={{ minWidth: 100 }}>夏普比率:</Typography>
                            <Typography sx={{ fontWeight: 'bold' }}>
                              {selectedStrategy.performance.sharpeRatio.toFixed(2)}
                            </Typography>
                          </Box>
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <TrendingDownIcon sx={{ 
                              color: theme.palette.warning.main,
                              mr: 1
                            }} />
                            <Typography sx={{ minWidth: 100 }}>最大回撤:</Typography>
                            <Typography sx={{ 
                              color: theme.palette.warning.main,
                              fontWeight: 'bold'
                            }}>
                              {selectedStrategy.performance.maxDrawdown.toFixed(2)}%
                            </Typography>
                          </Box>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}
              {dialogType === 'edit' && (
                <Box sx={{ mt: 2 }}>
                  <TextField
                    fullWidth
                    label="策略名称"
                    defaultValue={selectedStrategy.name}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="描述"
                    multiline
                    rows={4}
                    defaultValue={selectedStrategy.description}
                    sx={{ mb: 2 }}
                  />
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>类型</InputLabel>
                    <Select
                      defaultValue={selectedStrategy.type}
                      label="类型"
                    >
                      <MenuItem value="trend">趋势跟踪</MenuItem>
                      <MenuItem value="mean">均值回归</MenuItem>
                      <MenuItem value="arbitrage">套利</MenuItem>
                    </Select>
                  </FormControl>
                  <FormControl fullWidth>
                    <InputLabel>状态</InputLabel>
                    <Select
                      defaultValue={selectedStrategy.status}
                      label="状态"
                    >
                      <MenuItem value="active">活跃</MenuItem>
                      <MenuItem value="inactive">停用</MenuItem>
                      <MenuItem value="pending">待审核</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              )}
              {dialogType === 'delete' && (
                <Box sx={{ mt: 2, textAlign: 'center' }}>
                  <WarningIcon sx={{ 
                    color: theme.palette.warning.main,
                    fontSize: 60,
                    mb: 2
                  }} />
                  <Typography variant="h6" gutterBottom>
                    确认删除策略？
                  </Typography>
                  <Typography color="textSecondary">
                    此操作将永久删除策略 "{selectedStrategy.name}"，且无法恢复。
                  </Typography>
                </Box>
              )}
            </DialogContent>
            <DialogActions sx={{ 
              p: 3,
              borderTop: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
            }}>
              <Button
                onClick={handleCloseDialog}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold'
                }}
              >
                取消
              </Button>
              <Button
                variant="contained"
                color={dialogType === 'delete' ? 'error' : 'primary'}
                onClick={handleCloseDialog}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 'bold',
                  boxShadow: 'none',
                  '&:hover': {
                    boxShadow: 'none',
                    transform: 'translateY(-2px)',
                    transition: 'transform 0.3s ease-in-out'
                  }
                }}
              >
                {dialogType === 'view' ? '关闭' : 
                 dialogType === 'edit' ? '保存' : '删除'}
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Box>
  );
};

export default StrategyManager; 