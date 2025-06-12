import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Card,
  CardContent,
  Chip,
  IconButton
} from '@mui/material';
import { Add, Cancel, CheckCircle } from '@mui/icons-material';
import { DatePicker, TimePicker } from '@mui/x-date-pickers';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

/**
 * Simple Scheduler - Basic appointment management
 * No complex recurring appointments, no resource management
 * Just simple time slots for therapy sessions
 */
export function SimpleScheduler() {
  const [appointments, setAppointments] = useState([
    {
      id: 1,
      patientName: 'Jane Doe',
      date: new Date(2024, 0, 15, 10, 0),
      duration: 50,
      type: 'session',
      status: 'confirmed'
    },
    {
      id: 2,
      patientName: 'John Smith',
      date: new Date(2024, 0, 15, 14, 0),
      duration: 50,
      type: 'intake',
      status: 'confirmed'
    }
  ]);
  
  const [showNewAppointment, setShowNewAppointment] = useState(false);
  const [newAppointment, setNewAppointment] = useState({
    patientName: '',
    date: new Date(),
    time: new Date(),
    duration: 50,
    type: 'session'
  });

  const handleCreateAppointment = () => {
    const appointmentDate = new Date(
      newAppointment.date.getFullYear(),
      newAppointment.date.getMonth(),
      newAppointment.date.getDate(),
      newAppointment.time.getHours(),
      newAppointment.time.getMinutes()
    );

    const appointment = {
      id: Date.now(),
      patientName: newAppointment.patientName,
      date: appointmentDate,
      duration: newAppointment.duration,
      type: newAppointment.type,
      status: 'confirmed'
    };

    setAppointments([...appointments, appointment]);
    setShowNewAppointment(false);
    setNewAppointment({
      patientName: '',
      date: new Date(),
      time: new Date(),
      duration: 50,
      type: 'session'
    });
  };

  const handleCancelAppointment = (id) => {
    setAppointments(appointments.map(apt => 
      apt.id === id ? { ...apt, status: 'cancelled' } : apt
    ));
  };

  const getAppointmentsByDate = (date) => {
    return appointments.filter(apt => 
      apt.date.toDateString() === date.toDateString()
    ).sort((a, b) => a.date - b.date);
  };

  const today = new Date();
  const todayAppointments = getAppointmentsByDate(today);
  const tomorrowAppointments = getAppointmentsByDate(
    new Date(today.getTime() + 24 * 60 * 60 * 1000)
  );

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">Schedule</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setShowNewAppointment(true)}
          >
            New Appointment
          </Button>
        </Box>

        {/* Today's Schedule */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Typography variant="h6" gutterBottom>
            Today - {today.toLocaleDateString()}
          </Typography>
          {todayAppointments.length === 0 ? (
            <Typography color="text.secondary">No appointments scheduled</Typography>
          ) : (
            <Grid container spacing={2}>
              {todayAppointments.map(apt => (
                <Grid item xs={12} md={6} key={apt.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                        <Box>
                          <Typography variant="h6">
                            {apt.date.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </Typography>
                          <Typography>{apt.patientName}</Typography>
                          <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
                            <Chip 
                              label={apt.type} 
                              size="small" 
                              color={apt.type === 'intake' ? 'primary' : 'default'}
                            />
                            <Chip 
                              label={`${apt.duration} min`} 
                              size="small" 
                            />
                          </Box>
                        </Box>
                        {apt.status === 'confirmed' && (
                          <IconButton 
                            color="error" 
                            onClick={() => handleCancelAppointment(apt.id)}
                          >
                            <Cancel />
                          </IconButton>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>

        {/* Tomorrow's Schedule */}
        <Paper sx={{ p: 2 }}>
          <Typography variant="h6" gutterBottom>
            Tomorrow
          </Typography>
          {tomorrowAppointments.length === 0 ? (
            <Typography color="text.secondary">No appointments scheduled</Typography>
          ) : (
            <Grid container spacing={2}>
              {tomorrowAppointments.map(apt => (
                <Grid item xs={12} md={6} key={apt.id}>
                  <Card variant="outlined">
                    <CardContent>
                      <Typography variant="subtitle1">
                        {apt.date.toLocaleTimeString([], { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })} - {apt.patientName}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Paper>

        {/* New Appointment Dialog */}
        <Dialog 
          open={showNewAppointment} 
          onClose={() => setShowNewAppointment(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Schedule New Appointment</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Patient Name"
                value={newAppointment.patientName}
                onChange={(e) => setNewAppointment({
                  ...newAppointment,
                  patientName: e.target.value
                })}
              />

              <DatePicker
                label="Date"
                value={newAppointment.date}
                onChange={(date) => setNewAppointment({
                  ...newAppointment,
                  date
                })}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />

              <TimePicker
                label="Time"
                value={newAppointment.time}
                onChange={(time) => setNewAppointment({
                  ...newAppointment,
                  time
                })}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />

              <FormControl fullWidth>
                <InputLabel>Appointment Type</InputLabel>
                <Select
                  value={newAppointment.type}
                  onChange={(e) => setNewAppointment({
                    ...newAppointment,
                    type: e.target.value
                  })}
                  label="Appointment Type"
                >
                  <MenuItem value="session">Regular Session</MenuItem>
                  <MenuItem value="intake">Intake Session</MenuItem>
                  <MenuItem value="crisis">Crisis Session</MenuItem>
                </Select>
              </FormControl>

              <FormControl fullWidth>
                <InputLabel>Duration</InputLabel>
                <Select
                  value={newAppointment.duration}
                  onChange={(e) => setNewAppointment({
                    ...newAppointment,
                    duration: e.target.value
                  })}
                  label="Duration"
                >
                  <MenuItem value={30}>30 minutes</MenuItem>
                  <MenuItem value={50}>50 minutes</MenuItem>
                  <MenuItem value={60}>60 minutes</MenuItem>
                  <MenuItem value={90}>90 minutes</MenuItem>
                </Select>
              </FormControl>

              <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button 
                  variant="contained" 
                  onClick={handleCreateAppointment}
                  disabled={!newAppointment.patientName}
                  fullWidth
                >
                  Schedule
                </Button>
                <Button 
                  variant="outlined" 
                  onClick={() => setShowNewAppointment(false)}
                  fullWidth
                >
                  Cancel
                </Button>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      </Box>
    </LocalizationProvider>
  );
}

// What we're NOT building:
// - Complex recurring appointments (too complex)
// - Multi-therapist scheduling (solo practice focus)
// - Waitlist management (overengineering)
// - Appointment reminders (can add later)
// - Calendar sync (privacy concerns)
// - Resource scheduling (rooms, equipment)
// Just simple appointment booking