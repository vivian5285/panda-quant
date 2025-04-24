import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Tabs,
  Tab,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  useTheme,
  MenuItem
} from '@mui/material';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  PlayCircle as PlayIcon,
  Article as ArticleIcon,
  Announcement as AnnouncementIcon
} from '@mui/icons-material';
import { themeUtils } from '../theme';

interface Video {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
  duration: string;
  category: string;
}

interface Article {
  id: string;
  title: string;
  content: string;
  author: string;
  publishDate: string;
  category: string;
}

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: 'high' | 'medium' | 'low';
  startDate: string;
  endDate: string;
  status: 'active' | 'inactive';
}

const EducationPage: React.FC = () => {
  const { t } = useTranslation();
  const theme = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const [videos, setVideos] = useState<Video[]>([]);
  const [articles, setArticles] = useState<Article[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogType, setDialogType] = useState<'video' | 'article' | 'announcement'>('video');
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    fetchEducationData();
  }, []);

  const fetchEducationData = async () => {
    try {
      const [videosResponse, articlesResponse, announcementsResponse] = await Promise.all([
        fetch('/api/admin/education/videos'),
        fetch('/api/admin/education/articles'),
        fetch('/api/admin/education/announcements')
      ]);

      const videosData = await videosResponse.json();
      const articlesData = await articlesResponse.json();
      const announcementsData = await announcementsResponse.json();

      setVideos(videosData);
      setArticles(articlesData);
      setAnnouncements(announcementsData);
    } catch (error) {
      console.error('Error fetching education data:', error);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const handleOpenDialog = (type: 'video' | 'article' | 'announcement') => {
    setDialogType(type);
    setFormData({});
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleSubmit = async () => {
    try {
      const endpoint = `/api/admin/education/${dialogType}s`;
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchEducationData();
        handleCloseDialog();
      }
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleDelete = async (type: 'video' | 'article' | 'announcement', id: string) => {
    try {
      const response = await fetch(`/api/admin/education/${type}s/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchEducationData();
      }
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  };

  return (
    <Box
      sx={{
        py: { xs: 3, md: 4 },
        overflow: 'hidden',
        bgcolor: '#FFFFFF',
        position: 'relative',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, rgba(0, 255, 184, 0.03) 0%, rgba(0, 0, 0, 0) 100%)',
          zIndex: 0,
        },
      }}
    >
      <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
        >
          <Typography
            variant="h2"
            sx={{
              color: '#00FFB8',
              fontWeight: 700,
              mb: 1,
              textAlign: 'center',
              fontSize: { xs: '1.8rem', md: '2.2rem' },
              fontFamily: '"PingFang SC", "Microsoft YaHei", sans-serif',
            }}
          >
            {t('education.title')}
          </Typography>
          <Typography
            variant="body1"
            sx={{
              color: 'text.secondary',
              textAlign: 'center',
              mb: 3,
              fontSize: '0.9rem',
              opacity: 0.8,
            }}
          >
            {t('education.subtitle')}
          </Typography>
        </motion.div>

        <Box sx={{ mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            sx={{
              '& .MuiTabs-indicator': {
                backgroundColor: '#00FFB8',
              },
              '& .MuiTab-root': {
                color: 'text.secondary',
                '&.Mui-selected': {
                  color: '#00FFB8',
                },
              },
            }}
          >
            <Tab icon={<PlayIcon />} label={t('education.videos')} />
            <Tab icon={<ArticleIcon />} label={t('education.articles')} />
            <Tab icon={<AnnouncementIcon />} label={t('education.announcements')} />
          </Tabs>
        </Box>

        <Box sx={{ mb: 3, display: 'flex', justifyContent: 'flex-end' }}>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleOpenDialog(activeTab === 0 ? 'video' : activeTab === 1 ? 'article' : 'announcement')}
            sx={{
              bgcolor: '#00FFB8',
              '&:hover': {
                bgcolor: '#00E6A5',
              },
            }}
          >
            {t('education.addNew')}
          </Button>
        </Box>

        {activeTab === 0 && (
          <Grid container spacing={3}>
            {videos.map((video) => (
              <Grid item xs={12} sm={6} md={4} key={video.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      background: '#FFFFFF',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 8px 32px rgba(0, 255, 184, 0.1)',
                      border: '1px solid rgba(0, 255, 184, 0.2)',
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 12px 40px rgba(0, 255, 184, 0.15)',
                      },
                    }}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={video.thumbnail}
                      alt={video.title}
                      sx={{ objectFit: 'cover' }}
                    />
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {video.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {video.description}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          {video.duration}
                        </Typography>
                        <Box>
                          <IconButton size="small" onClick={() => handleOpenDialog('video')}>
                            <EditIcon />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDelete('video', video.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}

        {activeTab === 1 && (
          <Grid container spacing={3}>
            {articles.map((article) => (
              <Grid item xs={12} sm={6} md={4} key={article.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Card
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      background: '#FFFFFF',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 8px 32px rgba(0, 255, 184, 0.1)',
                      border: '1px solid rgba(0, 255, 184, 0.2)',
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 12px 40px rgba(0, 255, 184, 0.15)',
                      },
                    }}
                  >
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography variant="h6" gutterBottom>
                        {article.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" paragraph>
                        {article.content.substring(0, 200)}...
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          {article.author} • {article.publishDate}
                        </Typography>
                        <Box>
                          <IconButton size="small" onClick={() => handleOpenDialog('article')}>
                            <EditIcon />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDelete('article', article.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}

        {activeTab === 2 && (
          <Grid container spacing={3}>
            {announcements.map((announcement) => (
              <Grid item xs={12} key={announcement.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <Card
                    sx={{
                      background: '#FFFFFF',
                      backdropFilter: 'blur(10px)',
                      boxShadow: '0 8px 32px rgba(0, 255, 184, 0.1)',
                      border: '1px solid rgba(0, 255, 184, 0.2)',
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-5px)',
                        boxShadow: '0 12px 40px rgba(0, 255, 184, 0.15)',
                      },
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                        <Typography variant="h6">
                          {announcement.title}
                        </Typography>
                        <Box>
                          <IconButton size="small" onClick={() => handleOpenDialog('announcement')}>
                            <EditIcon />
                          </IconButton>
                          <IconButton size="small" onClick={() => handleDelete('announcement', announcement.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Box>
                      </Box>
                      <Typography variant="body1" paragraph>
                        {announcement.content}
                      </Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                          {announcement.startDate} - {announcement.endDate}
                        </Typography>
                        <Typography
                          variant="caption"
                          sx={{
                            color: announcement.priority === 'high' ? '#FF3B30' :
                              announcement.priority === 'medium' ? '#FF9500' : '#00FFB8',
                            fontWeight: 600,
                          }}
                        >
                          {t(`education.priority.${announcement.priority}`)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        )}

        <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
          <DialogTitle>
            {t(`education.${dialogType}.${formData.id ? 'edit' : 'add'}`)}
          </DialogTitle>
          <DialogContent>
            <Box sx={{ mt: 2 }}>
              {dialogType === 'video' && (
                <>
                  <TextField
                    fullWidth
                    label={t('education.video.title')}
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label={t('education.video.description')}
                    value={formData.description || ''}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    multiline
                    rows={4}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label={t('education.video.url')}
                    value={formData.url || ''}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label={t('education.video.thumbnail')}
                    value={formData.thumbnail || ''}
                    onChange={(e) => setFormData({ ...formData, thumbnail: e.target.value })}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label={t('education.video.duration')}
                    value={formData.duration || ''}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  />
                </>
              )}
              {dialogType === 'article' && (
                <>
                  <TextField
                    fullWidth
                    label={t('education.article.title')}
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label={t('education.article.content')}
                    value={formData.content || ''}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    multiline
                    rows={6}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label={t('education.article.author')}
                    value={formData.author || ''}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  />
                </>
              )}
              {dialogType === 'announcement' && (
                <>
                  <TextField
                    fullWidth
                    label={t('education.announcement.title')}
                    value={formData.title || ''}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label={t('education.announcement.content')}
                    value={formData.content || ''}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    multiline
                    rows={4}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    select
                    label={t('education.announcement.priority')}
                    value={formData.priority || 'medium'}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    sx={{ mb: 2 }}
                  >
                    <MenuItem value="high">{t('education.priority.high')}</MenuItem>
                    <MenuItem value="medium">{t('education.priority.medium')}</MenuItem>
                    <MenuItem value="low">{t('education.priority.low')}</MenuItem>
                  </TextField>
                  <TextField
                    fullWidth
                    label={t('education.announcement.startDate')}
                    type="date"
                    value={formData.startDate || ''}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    sx={{ mb: 2 }}
                    InputLabelProps={{ shrink: true }}
                  />
                  <TextField
                    fullWidth
                    label={t('education.announcement.endDate')}
                    type="date"
                    value={formData.endDate || ''}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    InputLabelProps={{ shrink: true }}
                  />
                </>
              )}
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseDialog}>{t('common.cancel')}</Button>
            <Button
              onClick={handleSubmit}
              variant="contained"
              sx={{
                bgcolor: '#00FFB8',
                '&:hover': {
                  bgcolor: '#00E6A5',
                },
              }}
            >
              {t('common.save')}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default EducationPage; 