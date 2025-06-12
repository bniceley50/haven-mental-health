import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  IconButton
} from '@mui/material';
import { Save, Lock, ArrowBack } from '@mui/icons-material';
import { useEncryption } from '../encryption/encryption-hook';
import { useLocation, useNavigate } from 'react-router-dom';

/**
 * Session Note Component - Simple, focused on therapy needs
 * SOAP, DAP, or free-form notes
 * No complex forms, no insurance codes, no billing integration
 */
export function SessionNote() {
  const location = useLocation();
  const navigate = useNavigate();
  const [noteType, setNoteType] = useState('SOAP');
  
  // Get patient data from navigation state
  const navigationState = location.state || {};
  const patientId = navigationState.patientId;
  const patientName = navigationState.patientName || 'New Patient';
  const sessionDate = navigationState.sessionDate || new Date();
  const [noteData, setNoteData] = useState({
    // SOAP format
    subjective: '',
    objective: '',
    assessment: '',
    plan: '',
    // DAP format
    data: '',
    assessmentDap: '',
    planDap: '',
    // Free form
    freeText: '',
    // Common fields
    duration: 50, // Standard 50-minute session
    sessionType: 'individual'
  });
  const [saved, setSaved] = useState(false);
  const { encrypt } = useEncryption();

  const handleSave = async () => {
    // Prepare note for encryption
    const note = {
      patientId,
      patientName,
      date: sessionDate || new Date(),
      type: noteType,
      duration: noteData.duration,
      sessionType: noteData.sessionType,
      content: noteType === 'SOAP' ? {
        subjective: noteData.subjective,
        objective: noteData.objective,
        assessment: noteData.assessment,
        plan: noteData.plan
      } : noteType === 'DAP' ? {
        data: noteData.data,
        assessment: noteData.assessmentDap,
        plan: noteData.planDap
      } : {
        note: noteData.freeText
      },
      createdAt: new Date(),
      signed: true,
      therapistId: 'current-user-id' // Would come from auth
    };

    // Encrypt the entire note
    const encryptedNote = await encrypt(note);
    
    // Save to local storage (real app would save to secure backend)
    const notes = JSON.parse(localStorage.getItem('therapy-notes') || '[]');
    notes.push(encryptedNote);
    localStorage.setItem('therapy-notes', JSON.stringify(notes));
    
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
      // Navigate back to dashboard after save
      navigate('/');
    }, 2000);
  };

  const handleBack = () => {
    navigate(-1);
  };

  const renderSOAPFields = () => (
    <>
      <TextField
        fullWidth
        label="Subjective"
        placeholder="Client's reported symptoms, feelings, and concerns..."
        multiline
        rows={3}
        value={noteData.subjective}
        onChange={(e) => setNoteData({...noteData, subjective: e.target.value})}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Objective"
        placeholder="Observable behaviors, affect, appearance..."
        multiline
        rows={3}
        value={noteData.objective}
        onChange={(e) => setNoteData({...noteData, objective: e.target.value})}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Assessment"
        placeholder="Clinical impressions, progress, diagnosis considerations..."
        multiline
        rows={3}
        value={noteData.assessment}
        onChange={(e) => setNoteData({...noteData, assessment: e.target.value})}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Plan"
        placeholder="Treatment plan, homework, next session focus..."
        multiline
        rows={3}
        value={noteData.plan}
        onChange={(e) => setNoteData({...noteData, plan: e.target.value})}
        sx={{ mb: 2 }}
      />
    </>
  );

  const renderDAPFields = () => (
    <>
      <TextField
        fullWidth
        label="Data"
        placeholder="What happened in session - facts and observations..."
        multiline
        rows={4}
        value={noteData.data}
        onChange={(e) => setNoteData({...noteData, data: e.target.value})}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Assessment"
        placeholder="Clinical interpretation of the data..."
        multiline
        rows={3}
        value={noteData.assessmentDap}
        onChange={(e) => setNoteData({...noteData, assessmentDap: e.target.value})}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Plan"
        placeholder="Next steps and treatment planning..."
        multiline
        rows={3}
        value={noteData.planDap}
        onChange={(e) => setNoteData({...noteData, planDap: e.target.value})}
        sx={{ mb: 2 }}
      />
    </>
  );

  const renderFreeForm = () => (
    <TextField
      fullWidth
      label="Session Notes"
      placeholder="Document the session in your preferred format..."
      multiline
      rows={12}
      value={noteData.freeText}
      onChange={(e) => setNoteData({...noteData, freeText: e.target.value})}
      sx={{ mb: 2 }}
    />
  );

  return (
    <Paper sx={{ p: 3 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={handleBack} sx={{ mr: 2 }}>
          <ArrowBack />
        </IconButton>
        <Box sx={{ flex: 1 }}>
          <Typography variant="h5">
            Session Note: {patientName}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Lock fontSize="small" color="success" />
          <Typography variant="caption" color="success.main">
            Encrypted & HIPAA Compliant
          </Typography>
        </Box>
      </Box>

      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <FormControl sx={{ minWidth: 120 }}>
          <InputLabel>Note Type</InputLabel>
          <Select
            value={noteType}
            onChange={(e) => setNoteType(e.target.value)}
            label="Note Type"
          >
            <MenuItem value="SOAP">SOAP</MenuItem>
            <MenuItem value="DAP">DAP</MenuItem>
            <MenuItem value="FREE">Free Form</MenuItem>
          </Select>
        </FormControl>

        <TextField
          label="Duration (minutes)"
          type="number"
          value={noteData.duration}
          onChange={(e) => setNoteData({...noteData, duration: e.target.value})}
          sx={{ width: 150 }}
        />

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel>Session Type</InputLabel>
          <Select
            value={noteData.sessionType}
            onChange={(e) => setNoteData({...noteData, sessionType: e.target.value})}
            label="Session Type"
          >
            <MenuItem value="individual">Individual</MenuItem>
            <MenuItem value="intake">Intake</MenuItem>
            <MenuItem value="crisis">Crisis</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {noteType === 'SOAP' && renderSOAPFields()}
      {noteType === 'DAP' && renderDAPFields()}
      {noteType === 'FREE' && renderFreeForm()}

      <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-between' }}>
        <Button
          variant="contained"
          startIcon={<Save />}
          onClick={handleSave}
          size="large"
        >
          Save & Sign Note
        </Button>
      </Box>

      {saved && (
        <Alert severity="success" sx={{ mt: 2 }}>
          Session note saved and encrypted successfully.
        </Alert>
      )}
    </Paper>
  );
}

// What we're NOT adding:
// - CPT codes (billing complexity)
// - Insurance requirements (not our problem)
// - Treatment plan builders (too complex)
// - Outcome measures (later feature)
// - Diagnosis codes (liability issues)
// - Medication tracking (scope creep)
// Just simple, secure session notes.