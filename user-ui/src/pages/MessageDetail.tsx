import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Paper,
    Typography,
    Button,
    Box,
    Divider,
    CircularProgress,
    Alert,
    Chip,
    IconButton,
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MarkEmailReadIcon from '@mui/icons-material/MarkEmailRead';
import axiosInstance from '../utils/axiosInstance'; // 复用 axios 实例
import { formatDistanceToNow } from 'date-fns';
import { zhCN } from 'date-fns/locale';

// 单个通知的详细类型
interface Notification {
    _id: string;
    title: string;
    message: string;
    type: string;
    status: 'unread' | 'read';
    createdAt: string;
}

const notificationTypes: Record<string, string> = {
    balance_low: '余额不足',
    hosting_fee_low: '托管费不足',
    system: '系统通知',
    registration: '注册通知',
    payment: '支付通知',
    other: '其他通知'
};

const MessageDetail: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [notification, setNotification] = useState<Notification | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [markingRead, setMarkingRead] = useState<boolean>(false);

    useEffect(() => {
        const fetchNotification = async () => {
            try {
                const response = await axiosInstance.get(`/api/notifications/${id}`);
                setNotification(response.data);
                
                // 如果是未读消息，自动标记为已读
                if (response.data.status === 'unread') {
                    await axiosInstance.put(`/api/notifications/${id}/read`);
                }
            } catch (err) {
                setError('获取通知详情失败');
                console.error('Error fetching notification:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchNotification();
    }, [id]);

    const handleMarkAsRead = async () => {
        if (!id || notification?.status === 'read') return;
        setMarkingRead(true);
        try {
            const response = await axiosInstance.put<Notification>(`/api/notifications/${id}/read`);
            setNotification(response.data); // 更新状态
        } catch (err) {
            console.error("Error marking notification as read:", err);
            setError('标记已读失败。');
        } finally {
            setMarkingRead(false);
        }
    };

    const getRelativeTime = (date: string) => {
        return formatDistanceToNow(new Date(date), { addSuffix: true, locale: zhCN });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (error) {
        return <Alert severity="error">{error}</Alert>;
    }

    if (!notification) {
        return <Alert severity="info">通知不存在</Alert>;
    }

    return (
        <Container maxWidth="md" sx={{ mt: 4 }}>
            <Paper elevation={3} sx={{ p: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                     <IconButton onClick={() => navigate(-1)} sx={{ mr: 1 }}>
                         <ArrowBackIcon />
                     </IconButton>
                     <Typography variant="h5" component="h1" sx={{ flexGrow: 1 }}>
                        通知详情
                     </Typography>
                </Box>
                <Divider sx={{ mb: 3 }} />

                <Box sx={{ mb: 3 }}>
                    <Typography variant="h4" gutterBottom>
                        {notification.title}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
                        <Typography color="text.secondary">
                            {getRelativeTime(notification.createdAt)}
                        </Typography>
                        <Chip
                            label={notificationTypes[notification.type] || '未知类型'}
                            color={notification.status === 'unread' ? 'primary' : 'default'}
                            size="small"
                        />
                    </Box>
                </Box>
                
                <Typography 
                    variant="body1" 
                    sx={{ 
                        whiteSpace: 'pre-wrap',
                        lineHeight: 1.8,
                        color: 'text.primary'
                    }}
                >
                    {notification.message}
                </Typography>

                <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        variant="contained"
                        onClick={() => navigate('/message-center')}
                    >
                        返回消息中心
                    </Button>
                </Box>

                {notification.status === 'unread' && (
                    <Box sx={{ mt: 3, textAlign: 'right' }}>
                        <Button
                            variant="contained"
                            startIcon={<MarkEmailReadIcon />}
                            onClick={handleMarkAsRead}
                            disabled={markingRead}
                        >
                            {markingRead ? <CircularProgress size={24} color="inherit" /> : '标记为已读'}
                        </Button>
                    </Box>
                )}
            </Paper>
        </Container>
    );
};

export default MessageDetail; 