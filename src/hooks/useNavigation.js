import { useNavigate } from 'react-router-dom';
import { useCallback } from 'react';

/**
 * Custom navigation hook with error handling and loading states
 * Provides a clean interface for navigation throughout the app
 */
export function useNavigation() {
  const navigate = useNavigate();

  // Navigate to session note creation with patient context
  const navigateToSessionNote = useCallback((patientData = null) => {
    try {
      if (patientData) {
        // Pass patient data through navigation state
        navigate('/note/new', { 
          state: { 
            patientId: patientData.id,
            patientName: patientData.patient || patientData.name,
            appointmentTime: patientData.time,
            appointmentType: patientData.type || 'session'
          } 
        });
      } else {
        // New note without patient context
        navigate('/note/new');
      }
    } catch (error) {
      console.error('Navigation error:', error);
      // In production, this would report to error tracking
    }
  }, [navigate]);

  // Navigate to secure messaging
  const navigateToMessage = useCallback((patientId = null) => {
    try {
      if (patientId) {
        navigate(`/chat/${patientId}`);
      } else {
        // Go to message list if no specific patient
        navigate('/messages');
      }
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }, [navigate]);

  // Navigate to video session
  const navigateToVideo = useCallback((sessionData) => {
    try {
      if (!sessionData) {
        console.error('Session data required for video call');
        return;
      }
      
      // Generate session ID from appointment data
      const sessionId = `session-${sessionData.id}-${Date.now()}`;
      
      navigate(`/video/${sessionId}`, {
        state: {
          patientName: sessionData.patient,
          appointmentTime: sessionData.time
        }
      });
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }, [navigate]);

  // Navigate to schedule
  const navigateToSchedule = useCallback(() => {
    try {
      navigate('/schedule');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }, [navigate]);

  // Navigate to all messages
  const navigateToAllMessages = useCallback(() => {
    try {
      navigate('/messages');
    } catch (error) {
      console.error('Navigation error:', error);
    }
  }, [navigate]);

  return {
    navigateToSessionNote,
    navigateToMessage,
    navigateToVideo,
    navigateToSchedule,
    navigateToAllMessages
  };
}