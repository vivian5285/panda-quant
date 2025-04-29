import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Container,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Grid,
} from '@mui/material';
import {
  Search as SearchIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  Refresh as RefreshIcon,
  Clear as ClearIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef, GridRenderCellParams } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { getLogs, Log } from '../api/log';
import { theme } from '../theme';
import { animationConfig } from '../theme/animation';
import PageLayout from '../components/common/PageLayout';
import {
  StyledCard,
  StyledBox,
  StyledTypography,
} from '../components/common/StyledComponents';

type LogLevel = 'error' | 'warning' | 'info';

const LogManagement: React.FC = () => {
  const { t } = useTranslation();
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const data = await getLogs();
      setLogs(data);
    } catch (error) {
      console.error('Error fetching logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelIcon = (level: LogLevel) => {
    switch (level.toLowerCase()) {
      case 'error':
        return <ErrorIcon color="error" />;
      case 'warning':
        return <WarningIcon color="warning" />;
      case 'info':
        return <InfoIcon color="info" />;
      default:
        return <InfoIcon />;
    }
  };

  const getLevelColor = (level: LogLevel) => {
    switch (level.toLowerCase()) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'info';
    }
  };

  const columns: GridColDef<any>[] = [
    {
      field: 'level',
      headerName: t('log.level'),
      width: 120,
      renderCell: (params: GridRenderCellParams<LogLevel>) => (
        <Chip
          icon={getLevelIcon(params.value)}
          label={params.value}
          color={getLevelColor(params.value)}
          size="small"
          sx={{
            bgcolor: `${theme.palette[getLevelColor(params.value)].main}20`,
            color: theme.palette[getLevelColor(params.value)].main,
          }}
        />
      ),
    },
    { field: 'message', headerName: t('log.message'), flex: 1 },
    { field: 'source', headerName: t('log.source'), width: 150 },
    {
      field: 'timestamp',
      headerName: t('log.timestamp'),
      width: 180,
      valueFormatter: (params: { value: string }) => new Date(params.value).toLocaleString(),
    },
  ];

  const filteredLogs = logs.filter((log) =>
    Object.values(log).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  const renderFilters = () => (
    <StyledCard
      sx={{
        position: 'relative',
        overflow: 'hidden',
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
      <StyledBox>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
          <TextField
            fullWidth
            size="small"
            placeholder={t('search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: theme.palette.primary.main }} />
                </InputAdornment>
              ),
              endAdornment: searchQuery && (
                <InputAdornment position="end">
                  <IconButton onClick={() => setSearchQuery('')}>
                    <ClearIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <Tooltip title={t('common.refresh')}>
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: animationConfig.duration.long }}
            >
              <IconButton onClick={fetchLogs}>
                <RefreshIcon />
              </IconButton>
            </motion.div>
          </Tooltip>
        </Box>
      </StyledBox>
    </StyledCard>
  );

  const renderContent = () => (
    <motion.div
      initial={animationConfig.variants.fadeIn.initial}
      animate={animationConfig.variants.fadeIn.animate}
      transition={{ duration: animationConfig.duration.medium }}
    >
      <StyledCard>
        <StyledBox>
          <DataGrid
            rows={filteredLogs}
            columns={columns}
            pageSizeOptions={[5, 10, 25]}
            getRowId={(row: Log) => row._id}
            loading={loading}
            sx={{
              border: 'none',
              '& .MuiDataGrid-cell': {
                borderBottom: `1px solid ${theme.palette.border.main}`,
              },
              '& .MuiDataGrid-columnHeaders': {
                backgroundColor: theme.palette.card.main,
                borderBottom: `1px solid ${theme.palette.border.main}`,
              },
              '& .MuiDataGrid-footerContainer': {
                backgroundColor: theme.palette.card.main,
                borderTop: `1px solid ${theme.palette.border.main}`,
              },
            }}
          />
        </StyledBox>
      </StyledCard>
    </motion.div>
  );

  return (
    <PageLayout
      title={t('logManagement')}
      filters={renderFilters()}
      content={renderContent()}
    />
  );
};

export default LogManagement; 