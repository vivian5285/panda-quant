import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Container,
  Paper,
  Chip,
} from '@mui/material';
import {
  Search as SearchIcon,
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { getLogs, Log } from '../api/log';

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

  const getLevelIcon = (level: string) => {
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

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'error':
        return 'error';
      case 'warning':
        return 'warning';
      case 'info':
        return 'info';
      default:
        return 'default';
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'level',
      headerName: t('log.level'),
      width: 120,
      renderCell: (params) => (
        <Chip
          icon={getLevelIcon(params.value)}
          label={params.value}
          color={getLevelColor(params.value)}
          size="small"
        />
      ),
    },
    { field: 'message', headerName: t('log.message'), flex: 1 },
    { field: 'source', headerName: t('log.source'), width: 150 },
    {
      field: 'timestamp',
      headerName: t('log.timestamp'),
      width: 180,
      valueFormatter: (params) => new Date(params.value).toLocaleString(),
    },
  ];

  const filteredLogs = logs.filter((log) =>
    Object.values(log).some((value) =>
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" component="h1">
            {t('logManagement')}
          </Typography>
          <TextField
            size="small"
            placeholder={t('search')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Box>
        <DataGrid
          rows={filteredLogs}
          columns={columns}
          pageSizeOptions={[5]}
          getRowId={(row) => row._id}
          loading={loading}
        />
      </Paper>
    </Container>
  );
};

export default LogManagement; 