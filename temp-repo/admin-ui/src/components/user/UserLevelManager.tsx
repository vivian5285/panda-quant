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
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Chip,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { userLevelService } from '../../services/userLevelService';
import { UserLevel } from '../../types/user';
import { theme } from '../../theme';
import { animationConfig } from '../../theme/animation';

const UserLevelManager: React.FC = () => {
  const [levels, setLevels] = useState<UserLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingLevel, setEditingLevel] = useState<UserLevel | null>(null);
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchLevels();
  }, []);

  const fetchLevels = async () => {
    try {
      setLoading(true);
      const data = await userLevelService.getAllLevels();
      setLevels(data);
    } catch (err) {
      setError('Failed to fetch user levels');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setIsAdding(true);
    setEditingLevel({
      id: '',
      name: '',
      description: '',
      benefits: [],
      requirements: {
        minBalance: 0,
        minTradingVolume: 0,
        minHoldingTime: 0,
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setOpenDialog(true);
  };

  const handleEdit = (level: UserLevel) => {
    setEditingLevel(level);
    setIsAdding(false);
    setOpenDialog(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await userLevelService.deleteLevel(id);
      setLevels(levels.filter(level => level.id !== id));
    } catch (err) {
      setError('Failed to delete user level');
      console.error(err);
    }
  };

  const handleSave = async () => {
    if (!editingLevel) return;

    try {
      if (isAdding) {
        const newLevel = await userLevelService.createLevel(editingLevel);
        setLevels([...levels, newLevel]);
      } else {
        const updatedLevel = await userLevelService.updateLevel(editingLevel.id, editingLevel);
        setLevels(levels.map(level => 
          level.id === updatedLevel.id ? updatedLevel : level
        ));
      }
      setOpenDialog(false);
      setEditingLevel(null);
      setIsAdding(false);
    } catch (err) {
      setError('Failed to save user level');
      console.error(err);
    }
  };

  const renderLevelCard = (level: UserLevel) => (
    <motion.div
      key={level.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: animationConfig.duration.medium }}
    >
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <Typography variant="h6">{level.name}</Typography>
            <Box>
              <IconButton onClick={() => handleEdit(level)}>
                <EditIcon />
              </IconButton>
              <IconButton onClick={() => handleDelete(level.id)} color="error">
                <DeleteIcon />
              </IconButton>
            </Box>
          </Box>

          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            {level.description}
          </Typography>

          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                要求:
              </Typography>
              <List dense>
                <ListItem>
                  <ListItemText
                    primary="最低余额"
                    secondary={`${level.requirements.minBalance} USDT`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="最低交易量"
                    secondary={`${level.requirements.minTradingVolume} USDT`}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="最低持仓时间"
                    secondary={`${level.requirements.minHoldingTime} 天`}
                  />
                </ListItem>
              </List>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle2" sx={{ mb: 1 }}>
                权益:
              </Typography>
              <List dense>
                {level.benefits.map((benefit, index) => (
                  <ListItem key={index}>
                    <ListItemText primary={benefit} />
                  </ListItem>
                ))}
              </List>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h5">用户等级管理</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
        >
          添加等级
        </Button>
      </Box>

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {loading ? (
        <Typography>加载中...</Typography>
      ) : (
        levels.map(renderLevelCard)
      )}

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {isAdding ? '添加用户等级' : '编辑用户等级'}
        </DialogTitle>
        <DialogContent>
          {editingLevel && (
            <Box sx={{ mt: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="等级名称"
                    value={editingLevel.name}
                    onChange={(e) => setEditingLevel({ ...editingLevel, name: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="描述"
                    multiline
                    rows={3}
                    value={editingLevel.description}
                    onChange={(e) => setEditingLevel({ ...editingLevel, description: e.target.value })}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    要求
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="最低余额"
                        type="number"
                        value={editingLevel.requirements.minBalance}
                        onChange={(e) => setEditingLevel({
                          ...editingLevel,
                          requirements: {
                            ...editingLevel.requirements,
                            minBalance: Number(e.target.value)
                          }
                        })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="最低交易量"
                        type="number"
                        value={editingLevel.requirements.minTradingVolume}
                        onChange={(e) => setEditingLevel({
                          ...editingLevel,
                          requirements: {
                            ...editingLevel.requirements,
                            minTradingVolume: Number(e.target.value)
                          }
                        })}
                      />
                    </Grid>
                    <Grid item xs={12} sm={4}>
                      <TextField
                        fullWidth
                        label="最低持仓时间"
                        type="number"
                        value={editingLevel.requirements.minHoldingTime}
                        onChange={(e) => setEditingLevel({
                          ...editingLevel,
                          requirements: {
                            ...editingLevel.requirements,
                            minHoldingTime: Number(e.target.value)
                          }
                        })}
                      />
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="subtitle2" sx={{ mb: 1 }}>
                    权益
                  </Typography>
                  <List>
                    {editingLevel.benefits.map((benefit, index) => (
                      <ListItem key={index}>
                        <TextField
                          fullWidth
                          value={benefit}
                          onChange={(e) => {
                            const newBenefits = [...editingLevel.benefits];
                            newBenefits[index] = e.target.value;
                            setEditingLevel({ ...editingLevel, benefits: newBenefits });
                          }}
                        />
                      </ListItem>
                    ))}
                  </List>
                  <Button
                    variant="outlined"
                    onClick={() => setEditingLevel({
                      ...editingLevel,
                      benefits: [...editingLevel.benefits, '']
                    })}
                  >
                    添加权益
                  </Button>
                </Grid>
              </Grid>
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>取消</Button>
          <Button onClick={handleSave} variant="contained">
            保存
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default UserLevelManager; 