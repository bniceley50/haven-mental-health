import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
  Chip,
  Button,
  Divider
} from '@mui/material';
import {
  Search,
  Message,
  MoreVert,
  Add
} from '@mui/icons-material';
import { useMessages } from './message-context';
import { useNavigation } from '../hooks/useNavigation';
import { useAuth } from '../auth/auth-context';

/**
 * Messages List Component
 * Shows all patient conversations for the therapist
 * Clean, searchable interface for managing communications
 */
export function MessagesList() {
  const { messages } = useMessages();
  const { navigateToMessage } = useNavigation();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all'); // all, unread, starred

  // Mock patient list with conversations
  const [conversations] = useState([
    {
      patientId: 'patient-1',
      patientName: 'Jane Doe',
      lastMessage: 'I wanted to discuss our last session...',
      timestamp: new Date(Date.now() - 3600000),
      unread: true,
      online: true
    },
    {
      patientId: 'patient-2', 
      patientName: 'John Smith',
      lastMessage: 'Thank you for the resources you shared',
      timestamp: new Date(Date.now() - 7200000),
      unread: true,
      online: false
    },
    {
      patientId: 'patient-3',
      patientName: 'Mary Johnson',
      lastMessage: 'See you next Tuesday!',
      timestamp: new Date(Date.now() - 86400000),
      unread: false,
      online: false
    }
  ]);

  // Filter conversations based on search and filter
  const filteredConversations = conversations.filter(conv => {
    const matchesSearch = conv.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || 
                         (selectedFilter === 'unread' && conv.unread);
    
    return matchesSearch && matchesFilter;
  });

  const handleConversationClick = (conversation) => {
    navigateToMessage(conversation.patientId);
  };

  const handleNewMessage = () => {
    // In a real app, this would open a patient selector
    navigateToMessage();
  };

  const formatTimestamp = (date) => {
    const now = new Date();
    const diff = now - date;
    
    if (diff < 3600000) { // Less than 1 hour
      return `${Math.floor(diff / 60000)}m ago`;
    } else if (diff < 86400000) { // Less than 1 day
      return `${Math.floor(diff / 3600000)}h ago`;
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: 'auto' }}>
      {/* Header */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">
          Messages
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleNewMessage}
        >
          New Message
        </Button>
      </Box>

      {/* Search and Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search conversations..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 2 }}
        />
        
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Chip
            label="All"
            onClick={() => setSelectedFilter('all')}
            color={selectedFilter === 'all' ? 'primary' : 'default'}
            variant={selectedFilter === 'all' ? 'filled' : 'outlined'}
          />
          <Chip
            label="Unread"
            onClick={() => setSelectedFilter('unread')}
            color={selectedFilter === 'unread' ? 'primary' : 'default'}
            variant={selectedFilter === 'unread' ? 'filled' : 'outlined'}
          />
        </Box>
      </Paper>

      {/* Conversations List */}
      <Paper>
        <List sx={{ p: 0 }}>
          {filteredConversations.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>
              <Typography color="text.secondary">
                No conversations found
              </Typography>
            </Box>
          ) : (
            filteredConversations.map((conversation, index) => (
              <React.Fragment key={conversation.patientId}>
                <ListItem
                  button
                  onClick={() => handleConversationClick(conversation)}
                  sx={{
                    bgcolor: conversation.unread ? 'action.hover' : 'transparent',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <ListItemAvatar>
                    <Avatar>
                      {conversation.patientName.charAt(0)}
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1" fontWeight={conversation.unread ? 600 : 400}>
                          {conversation.patientName}
                        </Typography>
                        {conversation.online && (
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: '50%',
                              bgcolor: 'success.main',
                            }}
                          />
                        )}
                      </Box>
                    }
                    secondary={
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {conversation.lastMessage}
                      </Typography>
                    }
                  />
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                    <Typography variant="caption" color="text.secondary">
                      {formatTimestamp(conversation.timestamp)}
                    </Typography>
                    {conversation.unread && (
                      <Box
                        sx={{
                          width: 10,
                          height: 10,
                          borderRadius: '50%',
                          bgcolor: 'primary.main',
                          mt: 1,
                        }}
                      />
                    )}
                  </Box>
                </ListItem>
                {index < filteredConversations.length - 1 && <Divider />}
              </React.Fragment>
            ))
          )}
        </List>
      </Paper>

      {/* Quick Stats */}
      <Box sx={{ mt: 3, display: 'flex', gap: 3, justifyContent: 'center' }}>
        <Typography variant="body2" color="text.secondary">
          {conversations.length} Total Conversations
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {conversations.filter(c => c.unread).length} Unread
        </Typography>
      </Box>
    </Box>
  );
}