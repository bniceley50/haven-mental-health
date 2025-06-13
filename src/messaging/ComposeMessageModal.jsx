import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  Typography,
  Autocomplete,
  Avatar,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Alert
} from '@mui/material';
import { Send, Close } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

/**
 * Compose Message Modal
 * Allows therapists to start new conversations with patients
 */
export function ComposeMessageModal({ open, onClose }) {
  const navigate = useNavigate();
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Mock patient list - in production, this would come from an API
  const patients = [
    { id: 'patient-1', name: 'Jane Doe', lastSeen: 'Active now' },
    { id: 'patient-2', name: 'John Smith', lastSeen: '2 hours ago' },
    { id: 'patient-3', name: 'Mary Johnson', lastSeen: 'Yesterday' },
    { id: 'patient-4', name: 'Robert Davis', lastSeen: '3 days ago' },
    { id: 'patient-5', name: 'Sarah Wilson', lastSeen: 'Last week' },
  ];

  const handleSend = () => {
    if (!selectedPatient) {
      setError('Please select a patient');
      return;
    }
    if (!message.trim()) {
      setError('Please enter a message');
      return;
    }

    // Navigate to the chat with the selected patient
    // In a real app, this would also send the initial message
    navigate(`/chat/${selectedPatient.id}`, {
      state: { 
        initialMessage: message,
        patientName: selectedPatient.name 
      }
    });
    
    // Close the modal
    handleClose();
  };

  const handleClose = () => {
    setSelectedPatient(null);
    setMessage('');
    setError('');
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={handleClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: { borderRadius: 2 }
      }}
    >
      <DialogTitle sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        borderBottom: 1,
        borderColor: 'divider'
      }}>
        <Typography variant="h6">New Message</Typography>
        <Button
          onClick={handleClose}
          sx={{ minWidth: 'auto', p: 1 }}
          color="inherit"
        >
          <Close />
        </Button>
      </DialogTitle>

      <DialogContent sx={{ pt: 3 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Autocomplete
          value={selectedPatient}
          onChange={(event, newValue) => {
            setSelectedPatient(newValue);
            setError('');
          }}
          options={patients}
          getOptionLabel={(option) => option.name}
          renderOption={(props, option) => (
            <ListItem {...props} sx={{ py: 1 }}>
              <ListItemAvatar>
                <Avatar sx={{ width: 32, height: 32 }}>
                  {option.name.charAt(0)}
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={option.name}
                secondary={option.lastSeen}
              />
            </ListItem>
          )}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Select Patient"
              placeholder="Type to search..."
              fullWidth
              variant="outlined"
            />
          )}
          sx={{ mb: 3 }}
        />

        <TextField
          label="Message"
          placeholder="Type your secure message here..."
          multiline
          rows={4}
          fullWidth
          value={message}
          onChange={(e) => {
            setMessage(e.target.value);
            setError('');
          }}
          variant="outlined"
          helperText="This message will be encrypted end-to-end"
        />

        <Box sx={{ mt: 2, p: 2, bgcolor: 'info.light', borderRadius: 1 }}>
          <Typography variant="caption" color="info.dark">
            💡 Tip: Keep initial messages welcoming and professional. 
            Patients appreciate when you remember details from previous sessions.
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ p: 3, pt: 0 }}>
        <Button 
          onClick={handleClose}
          color="inherit"
        >
          Cancel
        </Button>
        <Button
          onClick={handleSend}
          variant="contained"
          startIcon={<Send />}
          disabled={!selectedPatient || !message.trim()}
        >
          Send Message
        </Button>
      </DialogActions>
    </Dialog>
  );
}