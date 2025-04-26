import React, { useState, useEffect } from 'react';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import { useTranslation } from 'react-i18next';
import { useWebSocket } from '../contexts/WebSocketContext';

interface Message {
  id: string;
  title: string;
  content: string;
  timestamp: string;
  read: boolean;
}

const MessageCenter: React.FC = () => {
  const { t } = useTranslation();
  const { lastMessage } = useWebSocket();
  const [messages, setMessages] = useState<Message[]>([]);

  useEffect(() => {
    if (lastMessage) {
      try {
        const newMessage = JSON.parse(lastMessage) as Message;
        setMessages(prev => [newMessage, ...prev]);
      } catch (error) {
        console.error('Error parsing message:', error);
      }
    }
  }, [lastMessage]);

  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h5" gutterBottom>
        {t('messageCenter.title')}
      </Typography>
      <List>
        {messages.map((message) => (
          <ListItem
            key={message.id}
            sx={{
              bgcolor: message.read ? 'background.paper' : 'action.hover',
              mb: 1,
              borderRadius: 1,
            }}
          >
            <ListItemText
              primary={message.title}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="text.primary">
                    {message.content}
                  </Typography>
                  <br />
                  <Typography component="span" variant="caption" color="text.secondary">
                    {new Date(message.timestamp).toLocaleString()}
                  </Typography>
                </>
              }
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default MessageCenter; 