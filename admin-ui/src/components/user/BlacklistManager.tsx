import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Block as BlockIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { blacklistService } from '../../services/blacklistService';
import { BlacklistEntry } from '../../types/user';
import theme from '../../theme';
import { animationConfig } from '../../theme/animation';

const BlacklistManager: React.FC = () => {
  const [entries, setEntries] = useState<BlacklistEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingEntry, setEditingEntry] = useState<BlacklistEntry | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchEntries();
  }, []);

  const fetchEntries = async () => {
    try {
      setLoading(true);
      const data = await blacklistService.getAllEntries();
      setEntries(data);
    } catch (err) {
      setError('Failed to fetch blacklist entries');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingEntry({
      id: '',
      userId: '',
      username: '',
      email: '',
      reason: '',
      type: 'other',
      status: 'active',
      createdAt: new Date().toISOString(),
    });
    setOpenDialog(true);
  };

  const handleEdit = (entry: BlacklistEntry) => {
    setEditingEntry(entry);
    setIsAdding(false);
    setOpenDialog(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await blacklistService.deleteEntry(id);
      setEntries(entries.filter(entry => entry.id !== id));
    } catch (err) {
      setError('Failed to delete blacklist entry');
      console.error(err);
    }
  };

  const handleSave = async () => {
    if (!editingEntry) return;

    try {
      if (isAdding) {
        const newEntry = await blacklistService.createEntry(editingEntry);
        setEntries([...entries, newEntry]);
      } else {
        const updatedEntry = await blacklistService.updateEntry(editingEntry.id, editingEntry);
        setEntries(entries.map(entry => 
          entry.id === updatedEntry.id ? updatedEntry : entry
        ));
      }
      setOpenDialog(false);
      setEditingEntry(null);
      setIsAdding(false);
    } catch (err) {
      setError('Failed to save blacklist entry');
      console.error(err);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const data = await blacklistService.searchEntries(searchQuery);
      setEntries(data);
    } catch (err) {
      setError('Failed to search blacklist entries');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: BlacklistEntry['type']) => {
    switch (type) {
      case 'spam':
        return theme.palette.warning.main;
      case 'fraud':
        return theme.palette.error.main;
      case 'abuse':
        return theme.palette.error.dark;
      default:
        return theme.palette.text.secondary;
    }
  };

  const renderEntryCard = (entry: BlacklistEntry) => (
    <motion.div
      key={entry.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: animationConfig.duration.medium }}
    >
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <BlockIcon sx={{ color: theme.palette.error.main }} />
              <Typography variant="h6">{entry.username}</Typography>
              <Chip
                label={entry.type}
                sx={{
                  bgcolor: `${getTypeColor(entry.type)}20`,
                  color: getTypeColor(entry.type),
                }}
                size="small"
              />
            </Box>
            <Box>
              <IconButton onClick={() => handleEdit(entry)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDelete(entry.id)} color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                用户ID: {entry.userId}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                邮箱: {entry.email}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="body2" color="text.secondary">
                加入时间: {new Date(entry.createdAt).toLocaleString()}
              </Typography>
              {entry.expiresAt && (
                <Typography variant="body2" color="text.secondary">
                  过期时间: {new Date(entry.expiresAt).toLocaleString()}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <Typography variant="body2" color="text.secondary">
                原因: {entry.reason}
              </Typography>
            </Grid>
            {entry.notes && (
              <Grid item xs={12}>
                <Typography variant="body2" color="text.secondary">
                  备注: {entry.notes}
                </Typography>
              </Grid>
            )}
          </Grid>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">黑名单管理</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          color="error"
        >
          添加黑名单
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={8}>
            <TextField
              fullWidth
              label="搜索"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              fullWidth
              variant="outlined"
              onClick={handleSearch}
            >
              搜索
            </Button>
          </Grid>
        </Grid>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {loading ? (
        <Typography>加载中...</Typography>
      ) : (
        entries.map(renderEntryCard)
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isAdding ? '添加黑名单' : '编辑黑名单'}
        </DialogTitle>
        <DialogContent>
          {editingEntry && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="用户ID"
                    value={editingEntry.userId}
                    onChange={(e) => setEditingEntry({ ...editingEntry, userId: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="用户名"
                    value={editingEntry.username}
                    onChange={(e) => setEditingEntry({ ...editingEntry, username: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="邮箱"
                    value={editingEntry.email}
                    onChange={(e) => setEditingEntry({ ...editingEntry, email: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControl fullWidth>
                    <InputLabel>类型</InputLabel>
                    <Select
                      value={editingEntry.type}
                      onChange={(e) => setEditingEntry({ ...editingEntry, type: e.target.value as BlacklistEntry['type'] })}
                      label="类型"
                    >
                      <MenuItem value="spam">垃圾邮件</MenuItem>
                      <MenuItem value="fraud">欺诈</MenuItem>
                      <MenuItem value="abuse">滥用</MenuItem>
                      <MenuItem value="other">其他</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="原因"
                    value={editingEntry.reason}
                    onChange={(e) => setEditingEntry({ ...editingEntry, reason: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="备注"
                    multiline
                    rows={3}
                    value={editingEntry.notes || ''}
                    onChange={(e) => setEditingEntry({ ...editingEntry, notes: e.target.value })}
                  />
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>取消</Button>
          <Button onClick={handleSave} variant="contained" color="error">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BlacklistManager; 