import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Divider,
    CircularProgress,
    Box,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    IconButton,
    Menu,
    Tooltip,
    Chip,
    Badge,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Snackbar,
    Alert,
    Paper,
    ListItemSecondaryAction,
    Pagination,
    useTheme,
    useMediaQuery
} from '@mui/material';
import NotificationsIcon from '@mui/icons-material/Notifications';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearAllIcon from '@mui/icons-material/ClearAll';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import axiosInstance from '../utils/axiosInstance';
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import { useTranslation } from 'react-i18next';

// 定义通知类型
interface Notification {
    _id: string;
    title: string;
    content: string;
    type: string;
    status: 'unread' | 'read';
    createdAt: string;
}

interface NotificationStats {
    _id: string;
    count: number;
    unread: number;
}

// 定义通知类型选项 (用于过滤)
const notificationTypes = {
    '': '所有类型',
    'balance_low': '余额不足',
    'hosting_fee_low': '托管费不足',
    'system': '系统通知',
    'registration': '注册通知',
    'payment': '支付通知',
    'other': '其他通知',
};

type NotificationTypeKey = keyof typeof notificationTypes;

interface NotificationsResponse {
    notifications: Notification[];
    total: number;
    page: number;
    pageSize: number;
}

const MessageCenter: React.FC = () => {
    const navigate = useNavigate();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [filterType, setFilterType] = useState<NotificationTypeKey>('all');
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' as 'success' | 'error' });
    const [stats, setStats] = useState<NotificationStats[]>([]);
    const [selectedNotificationId, setSelectedNotificationId] = useState<string | null>(null);
    const { t } = useTranslation();

    const fetchNotifications = async (currentPage: number, currentFilter: NotificationTypeKey) => {
        setLoading(true);
        setError(null);
        try {
            let url = `/api/notifications?page=${currentPage}&limit=10`;
            if (currentFilter) {
                url += `&type=${currentFilter}`;
            }
            const response = await axiosInstance.get<NotificationsResponse>(url);
            setNotifications(response.data.notifications);
            setTotalPages(response.data.totalPages);
            setPage(response.data.currentPage);
        } catch (err) {
            console.error("Error fetching notifications:", err);
            setError(t('notifications.fetch_error'));
        } finally {
            setLoading(false);
        }
    };

    const fetchStats = async () => {
        try {
            const response = await axiosInstance.get('/api/notifications/stats');
            setStats(response.data);
        } catch (error) {
            console.error('获取通知统计失败:', error);
        }
    };

    useEffect(() => {
        fetchNotifications(page, filterType);
        fetchStats();
    }, [fetchNotifications, page, filterType, fetchStats]);

    const handleNotificationClick = (id: string) => {
        navigate(`/messages/${id}`);
    };

    const handlePageChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value);
        fetchNotifications(value, filterType);
    };

    const handleFilterChange = (event: React.ChangeEvent<{ value: unknown }>) => {
        const newFilter = event.target.value as NotificationTypeKey;
        setFilterType(newFilter);
        setPage(1);
        fetchNotifications(1, newFilter);
    };

    const handleMarkAllAsRead = async () => {
        try {
            await axiosInstance.put('/api/notifications/read-all');
            fetchNotifications(page, filterType);
            setSnackbar({
                open: true,
                message: '已标记所有通知为已读',
                severity: 'success'
            });
        } catch (err) {
            console.error("Error marking all as read:", err);
            setError('标记全部已读失败。');
            setSnackbar({
                open: true,
                message: '标记已读失败',
                severity: 'error'
            });
        }
        handleCloseMenu();
    };

    const handleDeleteNotification = (notification: Notification) => {
        setSelectedNotification(notification);
        setSelectedNotificationId(notification._id);
        setDeleteDialogOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!selectedNotification) return;
        
        try {
            await axiosInstance.delete(`/api/notifications/${selectedNotification._id}`);
            setNotifications(prev => prev.filter(n => n._id !== selectedNotification._id));
            setSnackbar({
                open: true,
                message: '通知已删除',
                severity: 'success'
            });
        } catch (error) {
            console.error(`Error deleting notification ${selectedNotification._id}:`, error);
            setError('删除通知失败。');
            setSnackbar({
                open: true,
                message: '删除通知失败',
                severity: 'error'
            });
        }
        setDeleteDialogOpen(false);
        setSelectedNotification(null);
        setSelectedNotificationId(null);
    };

    const handleDeleteAllRead = async () => {
        handleCloseMenu();
        if (!window.confirm('确定要删除所有已读通知吗？此操作无法撤销。')) {
            return;
        }
        try {
            const response = await axiosInstance.delete('/api/notifications/read');
            setSnackbar({
                open: true,
                message: `已删除 ${response.data.deletedCount} 条已读通知`,
                severity: 'success'
            });
            fetchNotifications(page, filterType);
        } catch (err) {
            console.error('Error deleting all read notifications:', err);
            setError('删除所有已读通知失败。');
            setSnackbar({
                open: true,
                message: '删除已读通知失败',
                severity: 'error'
            });
        }
    };

    const handleClickMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleCloseMenu = () => {
        setAnchorEl(null);
    };

    const getRelativeTime = (dateString: string) => {
        try {
            return formatDistanceToNow(new Date(dateString), { addSuffix: true, locale: zhCN });
        } catch (e) {
            return dateString;
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <Paper sx={{ p: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h5" component="h1">
                                {t('notifications')}
                            </Typography>
                            <Box>
                                <IconButton
                                    aria-label="more"
                                    aria-controls="long-menu"
                                    aria-haspopup="true"
                                    onClick={handleClickMenu}
                                >
                                    <MoreVertIcon />
                                </IconButton>
                                <Menu
                                    id="long-menu"
                                    anchorEl={anchorEl}
                                    keepMounted
                                    open={Boolean(anchorEl)}
                                    onClose={handleCloseMenu}
                                >
                                    <MenuItem onClick={handleMarkAllAsRead}>
                                        {t('markAllAsRead')}
                                    </MenuItem>
                                    <MenuItem onClick={handleDeleteAllRead}>
                                        {t('clearAllRead')}
                                    </MenuItem>
                                </Menu>
                            </Box>
                        </Box>

                        <FormControl fullWidth sx={{ mb: 2 }}>
                            <InputLabel>{t('filterByType')}</InputLabel>
                            <Select
                                value={filterType}
                                onChange={handleFilterChange}
                                label={t('filterByType')}
                            >
                                <MenuItem value="all">{t('all')}</MenuItem>
                                {Object.entries(notificationTypes).map(([key, value]) => (
                                    <MenuItem key={key} value={key}>{value}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
                                <CircularProgress />
                            </Box>
                        ) : error ? (
                            <Alert severity="error">{error}</Alert>
                        ) : notifications.length === 0 ? (
                            <Alert severity="info">{t('noNotifications')}</Alert>
                        ) : (
                            <>
                                <List>
                                    {notifications.map((notification) => (
                                        <React.Fragment key={notification._id}>
                                            <ListItem
                                                alignItems="flex-start"
                                                sx={{
                                                    backgroundColor: notification.status === 'unread' ? 'action.hover' : 'background.paper',
                                                }}
                                            >
                                                <ListItemIcon>
                                                    <NotificationsIcon color={notification.status === 'unread' ? 'primary' : 'action'} />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                            <Typography variant="subtitle1" component="span">
                                                                {notification.title}
                                                            </Typography>
                                                            <Typography variant="caption" color="text.secondary">
                                                                {getRelativeTime(notification.createdAt)}
                                                            </Typography>
                                                        </Box>
                                                    }
                                                    secondary={
                                                        <>
                                                            <Typography
                                                                component="span"
                                                                variant="body2"
                                                                color="text.primary"
                                                                sx={{ display: 'block' }}
                                                            >
                                                                {notification.content}
                                                            </Typography>
                                                            <Typography
                                                                component="span"
                                                                variant="caption"
                                                                color="text.secondary"
                                                            >
                                                                {notificationTypes[notification.type as keyof typeof notificationTypes]}
                                                            </Typography>
                                                        </>
                                                    }
                                                />
                                                <ListItemSecondaryAction>
                                                    {notification.status === 'read' && (
                                                        <IconButton
                                                            edge="end"
                                                            aria-label="delete"
                                                            onClick={() => handleDeleteNotification(notification)}
                                                        >
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    )}
                                                </ListItemSecondaryAction>
                                            </ListItem>
                                            <Divider variant="inset" component="li" />
                                        </React.Fragment>
                                    ))}
                                </List>

                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                                    <Pagination
                                        count={totalPages}
                                        page={page}
                                        onChange={handlePageChange}
                                        color="primary"
                                        size={isMobile ? "small" : "medium"}
                                    />
                                </Box>
                            </>
                        )}
                    </Paper>
                </Grid>
            </Grid>

            <Dialog
                open={deleteDialogOpen}
                onClose={() => setDeleteDialogOpen(false)}
            >
                <DialogTitle>{t('confirmDelete')}</DialogTitle>
                <DialogContent>
                    {t('deleteNotificationConfirm')}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>
                        {t('cancel')}
                    </Button>
                    <Button onClick={handleConfirmDelete} color="error">
                        {t('delete')}
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
            >
                <Alert severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default MessageCenter; 