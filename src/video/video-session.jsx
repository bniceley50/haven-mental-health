import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField
} from '@mui/material';
import {
  Videocam,
  VideocamOff,
  Mic,
  MicOff,
  CallEnd,
  ScreenShare,
  StopScreenShare,
  Lock,
  Warning
} from '@mui/icons-material';
import { useP2P } from '../p2p/p2p-hook';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

/**
 * Video Session Component - Simple, secure video therapy
 * WebRTC peer-to-peer, no recording, no fancy features
 * Just reliable video calls between therapist and patient
 */
export function VideoSession() {
  const { sessionId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get patient data from navigation state
  const { patientName = 'Patient' } = location.state || {};
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState('connecting');
  const [sessionNotes, setSessionNotes] = useState('');
  const [showEndDialog, setShowEndDialog] = useState(false);
  
  const { 
    startCall, 
    endCall, 
    toggleVideo, 
    toggleAudio, 
    onRemoteStream,
    connectionState 
  } = useP2P(sessionId);

  useEffect(() => {
    // Initialize video call
    initializeCall();
    
    return () => {
      // Cleanup on unmount
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    // Handle remote stream
    const unsubscribe = onRemoteStream((stream) => {
      setRemoteStream(stream);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
    });

    return unsubscribe;
  }, [onRemoteStream]);

  const initializeCall = async () => {
    try {
      // Get user media
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });

      setLocalStream(stream);
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Start the call
      await startCall(stream);
      setConnectionStatus('connected');
    } catch (error) {
      console.error('Failed to initialize call:', error);
      setConnectionStatus('failed');
    }
  };

  const handleToggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoOn(videoTrack.enabled);
        toggleVideo();
      }
    }
  };

  const handleToggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioOn(audioTrack.enabled);
        toggleAudio();
      }
    }
  };

  const handleScreenShare = async () => {
    if (!isScreenSharing) {
      try {
        const screenStream = await navigator.mediaDevices.getDisplayMedia({
          video: true,
          audio: false
        });

        // Replace video track with screen share
        const screenTrack = screenStream.getVideoTracks()[0];
        // In real implementation, would get peer connection from P2P service
        // For now, just log the action
        console.log('Would share screen with track:', screenTrack);
        screenTrack.onended = () => {
          handleStopScreenShare();
        };

        setIsScreenSharing(true);
      } catch (error) {
        console.error('Failed to share screen:', error);
      }
    } else {
      handleStopScreenShare();
    }
  };

  const handleStopScreenShare = () => {
    // Return to camera
    const videoTrack = localStream.getVideoTracks()[0];
    // In real implementation, would get peer connection from P2P service
    console.log('Would stop screen share and return to video:', videoTrack);
    
    setIsScreenSharing(false);
  };

  const handleEndCall = () => {
    setShowEndDialog(true);
  };

  const confirmEndCall = () => {
    // Stop all tracks
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
    }
    
    // End the call
    endCall();
    
    // Save session notes if any
    if (sessionNotes) {
      // In real app, this would save to secure backend
      localStorage.setItem(`session-${sessionId}-notes`, sessionNotes);
    }
    
    // Navigate back to dashboard
    navigate('/');
  };

  return (
    <Box sx={{ height: '100vh', bgcolor: 'grey.900', position: 'relative' }}>
      {/* Connection Status */}
      {connectionStatus !== 'connected' && (
        <Alert severity="warning" sx={{ position: 'absolute', top: 0, left: 0, right: 0 }}>
          {connectionStatus === 'connecting' ? 'Connecting to secure session...' : 'Connection failed'}
        </Alert>
      )}

      {/* Main Video Area */}
      <Box sx={{ height: '100%', display: 'flex', p: 2, gap: 2 }}>
        {/* Remote Video (Main) */}
        <Box sx={{ flex: 1, position: 'relative' }}>
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 8,
              backgroundColor: '#000'
            }}
          />
          <Box sx={{ 
            position: 'absolute', 
            top: 16, 
            left: 16,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            bgcolor: 'rgba(0,0,0,0.6)',
            p: 1,
            borderRadius: 2
          }}>
            <Typography color="white">{patientName}</Typography>
            <Lock fontSize="small" sx={{ color: 'success.light' }} />
          </Box>
        </Box>

        {/* Local Video (PiP) */}
        <Box sx={{ 
          position: 'absolute', 
          bottom: 100, 
          right: 20,
          width: 240,
          height: 180
        }}>
          <video
            ref={localVideoRef}
            autoPlay
            muted
            playsInline
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              borderRadius: 8,
              backgroundColor: '#000',
              border: '2px solid #fff'
            }}
          />
        </Box>
      </Box>

      {/* Controls */}
      <Paper sx={{ 
        position: 'absolute', 
        bottom: 0, 
        left: 0, 
        right: 0,
        p: 2,
        display: 'flex',
        justifyContent: 'center',
        gap: 2,
        borderRadius: 0
      }}>
        <IconButton
          onClick={handleToggleVideo}
          color={isVideoOn ? 'default' : 'error'}
          sx={{ bgcolor: 'action.hover' }}
        >
          {isVideoOn ? <Videocam /> : <VideocamOff />}
        </IconButton>

        <IconButton
          onClick={handleToggleAudio}
          color={isAudioOn ? 'default' : 'error'}
          sx={{ bgcolor: 'action.hover' }}
        >
          {isAudioOn ? <Mic /> : <MicOff />}
        </IconButton>

        <IconButton
          onClick={handleScreenShare}
          color={isScreenSharing ? 'primary' : 'default'}
          sx={{ bgcolor: 'action.hover' }}
        >
          {isScreenSharing ? <StopScreenShare /> : <ScreenShare />}
        </IconButton>

        <Button
          variant="contained"
          color="error"
          onClick={handleEndCall}
          startIcon={<CallEnd />}
        >
          End Session
        </Button>
      </Paper>

      {/* End Call Dialog */}
      <Dialog open={showEndDialog} onClose={() => setShowEndDialog(false)}>
        <DialogTitle>End Video Session?</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={4}
            label="Quick session notes (optional)"
            value={sessionNotes}
            onChange={(e) => setSessionNotes(e.target.value)}
            placeholder="Any important observations from this session..."
            sx={{ mb: 2 }}
          />
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
              variant="contained" 
              color="error" 
              onClick={confirmEndCall}
              fullWidth
            >
              End Session
            </Button>
            <Button 
              variant="outlined" 
              onClick={() => setShowEndDialog(false)}
              fullWidth
            >
              Continue
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}

// What we're NOT implementing:
// - Recording (legal/privacy complexity)
// - Virtual backgrounds (not essential)
// - Breakout rooms (not needed for 1:1)
// - Chat during video (distraction)
// - Reactions/emojis (not professional)
// - Whiteboard (scope creep)
// Just simple, secure video therapy