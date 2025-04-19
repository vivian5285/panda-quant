import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  TextField,
  IconButton,
  Container,
  Paper,
  Button,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useTranslation } from 'react-i18next';
import { getChainAddresses, ChainAddress } from '../api/chain-address';

const ChainAddressManagement: React.FC = () => {
  const { t } = useTranslation();
  const [chainAddresses, setChainAddresses] = useState<ChainAddress[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchChainAddresses();
  }, []);

  const fetchChainAddresses = async () => {
    try {
      setLoading(true);
      const data = await getChainAddresses();
      setChainAddresses(data);
    } catch (error) {
      console.error('Error fetching chain addresses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (chain: ChainAddress) => {
    // TODO: Implement edit functionality
    console.log('Edit chain:', chain);
  };

  const handleDelete = async (id: string) => {
    // TODO: Implement delete functionality
    console.log('Delete chain:', id);
  };

  const columns: GridColDef[] = [
    { field: 'chain', headerName: t('chain.name'), flex: 1 },
    { field: 'address', headerName: t('chain.address'), flex: 1 },
    {
      field: 'actions',
      headerName: t('common.actions'),
      width: 120,
      renderCell: (params) => (
        <Box>
          <IconButton onClick={() => handleEdit(params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDelete(params.row._id)}>
            <DeleteIcon />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h5" component="h1">
            {t('chainManagement')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <TextField
              size="small"
              placeholder={t('search')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                // TODO: Implement add functionality
                console.log('Add new chain');
              }}
            >
              {t('chain.add')}
            </Button>
          </Box>
        </Box>
        <DataGrid
          rows={chainAddresses}
          columns={columns}
          pageSizeOptions={[5]}
          getRowId={(row) => row._id}
          loading={loading}
        />
      </Paper>
    </Container>
  );
};

export default ChainAddressManagement; 