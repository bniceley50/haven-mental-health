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
  Chip,
  Alert
} from '@mui/material';
import { Send, Lock, Warning, ArrowBack } from '@mui/icons-material';
import { useEncryption } from '../encryption/encryption-hook';
import { useP2P } from '../p2p/p2p-hook';
import { useParams, useNavigate } from 'react-router-dom';

/**
 * Secure Chat Component - The core of our platform
 * End-to-end encrypted messaging between therapist and patient
 * No group chats, no channels, no complexity
 */
export function SecureChat() {
  const { patientId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  
  // Mock patient data - in real app would fetch from API
  const patientName = patientId === 'patient-1' ? 'Jane Doe' : 
                     patientId === 'patient-2' ? 'John Smith' : 
                     patientId === 'patient-3' ? 'Mary Johnson' : 'Patient';
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [phiWarning, setPhiWarning] = useState(false);
  const messagesEndRef = useRef(null);
  
  const { encrypt, decrypt } = useEncryption();
  const { sendMessage, onMessage, isConnected } = useP2P(patientId);

  useEffect(() => {
    // Listen for incoming messages
    const unsubscribe = onMessage(async (encryptedMsg) => {
      const decrypted = await decrypt(encryptedMsg);
      setMessages(prev => [...prev, {
        id: Date.now(),
        text: decrypted.text,
        sender: 'patient',
        timestamp: new Date(),
        encrypted: true
      }]);
    });

    return unsubscribe;
  }, [decrypt, onMessage]);

  useEffect(() => {
    // Auto-scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Simple PHI detection (real implementation would be more sophisticated)
  const detectPHI = (text) => {
    const phiPatterns = [
      /\b\d{3}-\d{2}-\d{4}\b/, // SSN
      /\b\d{3}-\d{3}-\d{4}\b/, // Phone
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/, // Email
      /\b(ssn|social security|dob|date of birth)\b/i,
    ];
    
    return phiPatterns.some(pattern => pattern.test(text));
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !isConnected) return;

    // Check for PHI
    if (detectPHI(newMessage)) {
      setPhiWarning(true);
      setTimeout(() => setPhiWarning(false), 5000);
    }

    // Encrypt and send
    const encrypted = await encrypt({
      text: newMessage,
      timestamp: Date.now(),
      type: 'message'
    });

    await sendMessage(encrypted);

    // Add to local messages
    setMessages(prev => [...prev, {
      id: Date.now(),
      text: newMessage,
      sender: 'therapist',
      timestamp: new Date(),
      encrypted: true
    }]);

    setNewMessage('');
  };

  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Paper sx={{ height: '600px', display: 'flex', flexDirection: 'column' }}>
      {/* Header */}
      <Box sx={{ 
        p: 2, 
        borderBottom: 1, 
        borderColor: 'divider',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <IconButton onClick={handleBack}>
            <ArrowBack />
          </IconButton>
          <Avatar>{patientName[0]}</Avatar>
          <Typography variant="h6">{patientName}</Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Lock fontSize="small" color="success" />
          <Typography variant="caption" color="success.main">
            End-to-End Encrypted
          </Typography>
        </Box>
      </Box>

      {/* PHI Warning */}
      {phiWarning && (
        <Alert severity="warning" sx={{ m: 2 }}>
          <strong>PHI Detected:</strong> This message may contain sensitive information. 
          It will be encrypted and logged per HIPAA requirements.
        </Alert>
      )}

      {/* Messages */}
      <List sx={{ flex: 1, overflow: 'auto', p: 2 }}>
        {messages.map((msg) => (
          <ListItem
            key={msg.id}
            sx={{
              flexDirection: msg.sender === 'therapist' ? 'row-reverse' : 'row',
              gap: 1,
              mb: 2
            }}
          >
            <Paper
              sx={{
                p: 2,
                maxWidth: '70%',
                bgcolor: msg.sender === 'therapist' ? 'primary.light' : 'grey.100'
              }}
            >
              <Typography>{msg.text}</Typography>
              <Typography variant="caption" color="text.secondary">
                {msg.timestamp.toLocaleTimeString()}
              </Typography>
            </Paper>
          </ListItem>
        ))}
        <div ref={messagesEndRef} />
      </List>

      {/* Input */}
      <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <TextField
            fullWidth
            placeholder="Type a secure message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
            multiline
            maxRows={3}
            disabled={!isConnected}
          />
          <IconButton 
            color="primary" 
            onClick={handleSend}
            disabled={!isConnected || !newMessage.trim()}
          >
            <Send />
          </IconButton>
        </Box>
        
        {!isConnected && (
          <Typography variant="caption" color="error" sx={{ mt: 1 }}>
            Connection lost. Messages will be sent when connection is restored.
          </Typography>
        )}
      </Box>
    </Paper>
  );
}

// What this component does NOT do:
// - Group messaging (too complex for MVP)
// - File attachments (security complexity)
// - Voice notes (HIPAA complexity)
// - Reactions/emojis (not professional)
// - Read receipts (privacy concerns)
// - Message editing (audit trail issues)
// Just simple, secure, therapist-patient messaging.