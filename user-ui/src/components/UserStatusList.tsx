import React from 'react';
import { Box, Typography, List, ListItem, ListItemText, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';

interface UserStatus {
  id: string;
  name: string;
  status: 'online' | 'offline';
  lastActive: string;
}

const UserStatusList: React.FC = () => {
  const { t } = useTranslation();

  // 模拟数据，实际应用中应该从后端获取
  const mockUsers: UserStatus[] = [
    {
      id: '1',
      name: 'User 1',
      status: 'online',
      lastActive: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'User 2',
      status: 'offline',
      lastActive: new Date(Date.now() - 3600000).toISOString(), // 1小时前
    },
  ];

  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      <Typography variant="h6" sx={{ p: 2 }}>
        {t('userStatus.title')}
      </Typography>
      <List>
        {mockUsers.map((user) => (
          <React.Fragment key={user.id}>
            <ListItem>
              <ListItemText
                primary={user.name}
                secondary={
                  <React.Fragment>
                    <Typography
                      component="span"
                      variant="body2"
                      color={user.status === 'online' ? 'success.main' : 'text.secondary'}
                    >
                      {t(`userStatus.${user.status}`)}
                    </Typography>
                    {' — '}
                    {new Date(user.lastActive).toLocaleString()}
                  </React.Fragment>
                }
              />
            </ListItem>
            <Divider component="li" />
          </React.Fragment>
        ))}
      </List>
    </Box>
  );
};

export default UserStatusList; 