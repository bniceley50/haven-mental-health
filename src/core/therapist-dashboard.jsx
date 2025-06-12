import React, { useState, useEffect } from 'react';
import { Box, Card, Typography, Button, List, ListItem, Avatar, Chip } from '@mui/material';
import { MessageIcon, VideoIcon, NoteIcon, CalendarIcon } from './icons';
import { useAuth } from '../auth/auth-context';
import { useMessages } from '../messaging/message-context';
import { useNavigation } from '../hooks/useNavigation';
import { SecurityBadge } from '../components/SecurityBadge';

/**
 * Therapist Dashboard - The ONLY dashboard we need
 * No billing, no insurance, no labs, no pharmacy
 * Just messaging, notes, and appointments
 */
export function TherapistDashboard() {
  const { user } = useAuth();
  const { unreadCount, recentMessages } = useMessages();
  const [todayAppointments, setTodayAppointments] = useState([]);
  const { 
    navigateToSessionNote, 
    navigateToMessage, 
    navigateToVideo,
    navigateToAllMessages 
  } = useNavigation();

  useEffect(() => {
    // Load today's appointments
    loadTodayAppointments();
  }, []);

  const loadTodayAppointments = async () => {
    // Simple appointment loading - no complex scheduling system
    const appointments = [
      { id: 1, time: '9:00 AM', patient: 'Jane D.', patientId: 'patient-1', type: 'session' },
      { id: 2, time: '10:00 AM', patient: 'John S.', patientId: 'patient-2', type: 'session' },
      { id: 3, time: '2:00 PM', patient: 'Mary K.', patientId: 'patient-3', type: 'intake' },
    ];
    setTodayAppointments(appointments);
  };

  // Handle video session start
  const handleStartVideo = (appointment) => {
    console.log('Starting video session for:', appointment.patient);
    navigateToVideo(appointment);
  };

  // Handle session note creation
  const handleSessionNote = (appointment) => {
    console.log('Creating session note for:', appointment.patient);
    navigateToSessionNote(appointment);
  };

  // Handle message navigation
  const handleSendMessage = () => {
    console.log('Opening message composer');
    navigateToMessage();
  };

  // Handle view all messages
  const handleViewAllMessages = () => {
    console.log('Viewing all messages');
    navigateToAllMessages();
  };

  // Handle create new session note
  const handleCreateSessionNote = () => {
    console.log('Creating new session note');
    navigateToSessionNote();
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Simple greeting - no complex analytics */}
      <Typography variant="h4" gutterBottom>
        Good morning, {user?.name || 'Dr. Smith'}
      </Typography>
      
      <Typography variant="subtitle1" color="text.secondary" gutterBottom>
        {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
      </Typography>

      {/* Security Trust Signal */}
      <Box sx={{ mt: 2, mb: 3 }}>
        <SecurityBadge />
      </Box>

      {/* Today's appointments - just the basics */}
      <Card sx={{ mt: 3, p: 2 }}>
        <Typography variant="h6" gutterBottom>
          Today's Sessions
        </Typography>
        <List>
          {todayAppointments.map(apt => (
            <ListItem key={apt.id} sx={{ justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Typography variant="body2" sx={{ minWidth: 80 }}>
                  {apt.time}
                </Typography>
                <Typography>{apt.patient}</Typography>
                {apt.type === 'intake' && (
                  <Chip label="New Patient" size="small" color="primary" />
                )}
              </Box>
              <Box>
                <Button 
                  size="small" 
                  startIcon={<VideoIcon />}
                  onClick={() => handleStartVideo(apt)}
                  sx={{ mr: 1 }}
                >
                  Start Video
                </Button>
                <Button 
                  size="small" 
                  startIcon={<NoteIcon />}
                  onClick={() => handleSessionNote(apt)}
                >
                  Session Note
                </Button>
              </Box>
            </ListItem>
          ))}
        </List>
      </Card>

      {/* Unread messages - critical for patient care */}
      {unreadCount > 0 && (
        <Card sx={{ mt: 3, p: 2, bgcolor: 'primary.light' }}>
          <Typography variant="h6">
            {unreadCount} Unread Messages
          </Typography>
          <List>
            {recentMessages.slice(0, 3).map(msg => (
              <ListItem key={msg.id}>
                <Avatar sx={{ mr: 2 }}>{msg.patientName[0]}</Avatar>
                <Box>
                  <Typography variant="body2">
                    <strong>{msg.patientName}</strong>
                  </Typography>
                  <Typography variant="caption" noWrap sx={{ maxWidth: 300 }}>
                    {msg.preview}
                  </Typography>
                </Box>
              </ListItem>
            ))}
          </List>
          <Button 
            fullWidth 
            variant="contained" 
            sx={{ mt: 2 }}
            onClick={handleViewAllMessages}
          >
            View All Messages
          </Button>
        </Card>
      )}

      {/* Quick actions - only what matters */}
      <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
        <Button 
          variant="contained" 
          startIcon={<MessageIcon />}
          fullWidth
          onClick={handleSendMessage}
        >
          Send Secure Message
        </Button>
        <Button 
          variant="outlined" 
          startIcon={<NoteIcon />}
          fullWidth
          onClick={handleCreateSessionNote}
        >
          Create Session Note
        </Button>
      </Box>

      {/* Crisis resources - always visible */}
      <Card sx={{ mt: 3, p: 2, bgcolor: 'error.light' }}>
        <Typography variant="subtitle2" gutterBottom>
          Crisis Resources
        </Typography>
        <Typography variant="body2">
          National Suicide Prevention Lifeline: <strong>988</strong>
        </Typography>
        <Typography variant="body2">
          Crisis Text Line: Text <strong>HOME</strong> to <strong>741741</strong>
        </Typography>
      </Card>
    </Box>
  );
}

// NO FEATURES FOR:
// - Billing dashboard
// - Insurance claims
// - Lab results
// - Prescription management
// - Analytics/reporting
// - Multi-location support
// - Inventory management
// - Marketing tools
// Just therapy. Nothing else.