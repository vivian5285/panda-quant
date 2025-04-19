import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
  Alert,
} from '@mui/material';

interface FeeRecord {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'overdue';
}

const HostingFees: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fees, setFees] = useState<FeeRecord[]>([]);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        setLoading(true);
        // TODO: Replace with actual API call
        const mockFees: FeeRecord[] = [
          {
            id: '1',
            date: '2024-03-01',
            amount: 100,
            status: 'paid',
          },
          {
            id: '2',
            date: '2024-04-01',
            amount: 100,
            status: 'pending',
          },
        ];
        setFees(mockFees);
      } catch (err) {
        setError(t('hosting.error.fetch'));
      } finally {
        setLoading(false);
      }
    };

    fetchFees();
  }, [t]);

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        {t('hosting.title')}
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{t('hosting.table.date')}</TableCell>
                <TableCell align="right">{t('hosting.table.amount')}</TableCell>
                <TableCell align="right">{t('hosting.table.status')}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {fees.map((fee) => (
                <TableRow key={fee.id}>
                  <TableCell>{fee.date}</TableCell>
                  <TableCell align="right">{fee.amount}</TableCell>
                  <TableCell align="right">
                    {t(`hosting.status.${fee.status}`)}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default HostingFees; 