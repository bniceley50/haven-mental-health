import React, { useState, useEffect, useRef } from 'react';
import { 
  Box, 
  TextField, 
  IconButton, 
  Paper, 
  Typography, 
  List, 
  ListItem,
  Avatar,
  Alert,
  Chip,
  InputAdornment
} from '@mui/material';
import { Send, Lock, ArrowBack, CheckCircle, Schedule } from '@mui/icons-material';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useMessageStorage } from '../contexts/MessageStorageContext';
import { useAuth } from '../auth/auth-context';

/**
 * Secure Chat Demo Component
 * Simplified version for demos that works without P2P
 * Shows professional messaging that rivals SimplePractice
 */
export function SecureChatDemo() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { getConversation, sendMessage, markAsRead } = useMessageStorage();
  
  const [conversation, setConversation] = useState(null);
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [showDelivered, setShowDelivered] = useState(false);
  const messagesEndRef = useRef(null);

  // Get patient info from route state or conversation
  const patientName = location.state?.patientName || 
                     conversation?.patientName || 
                     'Patient';

  useEffect(() => {
    // Load conversation
    const conv = getConversation(patientId);
    if (conv) {
      setConversation(conv);
      markAsRead(patientId);
    } else {
      // Create new conversation if needed
      setConversation({
        patientId,
        patientName,
        messages: [],
        lastActivity: new Date().toISOString()
      });
    }

    // Check for initial message from compose modal
    if (location.state?.initialMessage) {
      handleSend(location.state.initialMessage);
      // Clear the state to prevent re-sending
      window.history.replaceState({}, document.title);
    }
  }, [patientId, getConversation, markAsRead, location.state]);

  useEffect(() => {
    // Auto-scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages]);

  // Simulate patient typing indicator
  useEffect(() => {
    if (conversation?.messages.length > 0) {
      const lastMessage = conversation.messages[conversation.messages.length - 1];
      if (lastMessage.sender === 'therapist') {
        setTimeout(() => setIsTyping(true), 2000);
        setTimeout(() => {
          setIsTyping(false);
          // Simulate patient response
          const responses = [
            "That's really helpful, thank you.",
            "I'll definitely try that approach.",
            "Can we discuss this more in our next session?",
            "I appreciate your guidance on this.",
            "This gives me a lot to think about."
          ];
          const randomResponse = responses[Math.floor(Math.random() * responses.length)];
          sendMessage(patientId, {
            text: randomResponse,
            sender: 'patient',
            patientName
          });
        }, 4000);
      }
    }
  }, [conversation?.messages.length]);

  const handleSend = async (messageText = newMessage) => {
    if (!messageText.trim()) return;

    // Send the message
    sendMessage(patientId, {
      text: messageText,
      sender: 'therapist',
      patientName
    });

    // Update local state
    setConversation(prev => ({
      ...prev,
      messages: [...(prev?.messages || []), {
        id: Date.now().toString(),
        text: messageText,
        sender: 'therapist',
        timestamp: new Date().toISOString(),
        encrypted: true
      }]
    }));

    setNewMessage('');
    
    // Show delivered indicator
    setShowDelivered(true);
    setTimeout(() => setShowDelivered(false), 3000);
  };

  const handleBack = () => {
    navigate('/messages');
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: 'numeric', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <Box sx={{ height: 'calc(100vh - 64px)', display: 'flex', flexDirection: 'column', maxWidth: 800, mx: 'auto' }}>
      {/* Header */}
      <Paper sx={{ 
        p: 2, 
        borderRadius: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottom: 2,
        borderColor: 'divider'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={handleBack} edge="start">
            <ArrowBack />
          </IconButton>
          <Avatar sx={{ bgcolor: 'primary.main' }}>{patientName[0]}</Avatar>
          <Box>
            <Typography variant="h6">{patientName}</Typography>
            {isTyping && (
              <Typography variant="caption" color="text.secondary">
                typing...
              </Typography>
            )}
          </Box>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Chip
            icon={<Lock fontSize="small" />}
            label="End-to-End Encrypted"
            color="success"
            size="small"
            variant="outlined"
          />
        </Box>
      </Paper>

      {/* Messages */}
      <Box sx={{ flex: 1, overflow: 'auto', bgcolor: 'grey.50', p: 2 }}>
        <List>
          {conversation?.messages.map((msg, index) => (
            <ListItem
              key={msg.id}
              sx={{
                flexDirection: msg.sender === 'therapist' ? 'row-reverse' : 'row',
                gap: 1,
                mb: 2,
                alignItems: 'flex-end'
              }}
            >
              {msg.sender === 'patient' && (
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'grey.400' }}>
                  {patientName[0]}
                </Avatar>
              )}
              <Box sx={{ maxWidth: '70%' }}>
                <Paper
                  elevation={1}
                  sx={{
                    p: 2,
                    bgcolor: msg.sender === 'therapist' ? 'primary.main' : 'white',
                    color: msg.sender === 'therapist' ? 'white' : 'text.primary',
                    borderRadius: msg.sender === 'therapist' ? '16px 16px 4px 16px' : '16px 16px 16px 4px'
                  }}
                >
                  <Typography variant="body1">{msg.text}</Typography>
                </Paper>
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 0.5, 
                  mt: 0.5,
                  justifyContent: msg.sender === 'therapist' ? 'flex-end' : 'flex-start'
                }}>
                  <Typography variant="caption" color="text.secondary">
                    {formatTime(msg.timestamp)}
                  </Typography>
                  {msg.sender === 'therapist' && showDelivered && index === conversation.messages.length - 1 && (
                    <>
                      <CheckCircle sx={{ fontSize: 14, color: 'success.main' }} />
                      <Typography variant="caption" color="success.main">
                        Delivered
                      </Typography>
                    </>
                  )}
                </Box>
              </Box>
            </ListItem>
          ))}
          
          {isTyping && (
            <ListItem sx={{ gap: 1 }}>
              <Avatar sx={{ width: 32, height: 32, bgcolor: 'grey.400' }}>
                {patientName[0]}
              </Avatar>
              <Paper sx={{ p: 2, bgcolor: 'white', borderRadius: '16px 16px 16px 4px' }}>
                <Box sx={{ display: 'flex', gap: 0.5 }}>
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'grey.500', animation: 'pulse 1.4s infinite' }} />
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'grey.500', animation: 'pulse 1.4s infinite 0.2s' }} />
                  <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: 'grey.500', animation: 'pulse 1.4s infinite 0.4s' }} />
                </Box>
              </Paper>
            </ListItem>
          )}
          
          <div ref={messagesEndRef} />
        </List>
      </Box>

      {/* Input */}
      <Paper sx={{ p: 2, borderRadius: 0, borderTop: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'flex-end' }}>
          <TextField
            fullWidth
            placeholder="Type a secure message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            multiline
            maxRows={4}
            variant="outlined"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <Typography variant="caption" color="text.secondary">
                    {newMessage.length}/500
                  </Typography>
                </InputAdornment>
              )
            }}
          />
          <IconButton 
            color="primary" 
            onClick={() => handleSend()}
            disabled={!newMessage.trim()}
            sx={{ bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
          >
            <Send />
          </IconButton>
        </Box>
        
        <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
          <Schedule sx={{ fontSize: 16, color: 'text.secondary' }} />
          <Typography variant="caption" color="text.secondary">
            Messages are automatically saved and encrypted
          </Typography>
        </Box>
      </Paper>
      
      <style jsx global>{`
        @keyframes pulse {
          0%, 60%, 100% {
            opacity: 0.3;
          }
          30% {
            opacity: 1;
          }
        }
      `}</style>
    </Box>
  );
}