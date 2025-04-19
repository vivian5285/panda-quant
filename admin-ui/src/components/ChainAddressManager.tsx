import React, { useState } from 'react';
import {
  Typography,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { useTranslation } from 'react-i18next';
import { ChainAddress } from '../api/chain-address';

interface ChainAddressManagerProps {
  chain?: ChainAddress;
  onSave: (chain: Omit<ChainAddress, '_id'>) => void;
  onCancel: () => void;
}

const ChainAddressManager: React.FC<ChainAddressManagerProps> = ({
  chain,
  onSave,
  onCancel,
}) => {
  const { t } = useTranslation();
  const [formData, setFormData] = useState<Omit<ChainAddress, '_id'>>({
    chain: chain?.chain || '',
    address: chain?.address || '',
    type: chain?.type || 'deposit',
    status: chain?.status || 'active',
    createdAt: chain?.createdAt || new Date().toISOString(),
    updatedAt: chain?.updatedAt || new Date().toISOString(),
  });
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async () => {
    try {
      await onSave(formData);
      onCancel();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <Dialog open={true} onClose={onCancel} maxWidth="sm" fullWidth>
      <DialogTitle>
        {chain ? t('editChain') : t('addChain')}
      </DialogTitle>
      <DialogContent>
        {error && (
          <Typography color="error" gutterBottom>
            {error}
          </Typography>
        )}
        <TextField
          fullWidth
          label={t('chain.name')}
          value={formData.chain}
          onChange={(e) => setFormData({ ...formData, chain: e.target.value })}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          label={t('chain.address')}
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          margin="normal"
          required
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>{t('cancel')}</Button>
        <Button onClick={handleSubmit} variant="contained">
          {t('save')}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ChainAddressManager; 