import React, { createContext, useContext, useState, useEffect } from 'react';

const MessageStorageContext = createContext();

export function useMessageStorage() {
  const context = useContext(MessageStorageContext);
  if (!context) {
    throw new Error('useMessageStorage must be used within MessageStorageProvider');
  }
  return context;
}

export function MessageStorageProvider({ children }) {
  const [conversations, setConversations] = useState(() => {
    // Load from localStorage on init
    const saved = localStorage.getItem('haven-conversations');
    if (saved) {
      return JSON.parse(saved);
    }
    
    // Default demo conversations
    return {
      'patient-1': {
        patientId: 'patient-1',
        patientName: 'Jane Doe',
        messages: [
          {
            id: '1',
            text: 'Hi Dr. Smith, I wanted to discuss our last session.',
            sender: 'patient',
            timestamp: new Date(Date.now() - 3600000).toISOString(),
            encrypted: true
          },
          {
            id: '2',
            text: 'Of course, Jane. What aspects would you like to explore further?',
            sender: 'therapist',
            timestamp: new Date(Date.now() - 3500000).toISOString(),
            encrypted: true
          },
          {
            id: '3',
            text: 'I\'ve been practicing the mindfulness exercises you suggested.',
            sender: 'patient',
            timestamp: new Date(Date.now() - 3400000).toISOString(),
            encrypted: true
          }
        ],
        lastActivity: new Date(Date.now() - 3400000).toISOString(),
        unread: true
      },
      'patient-2': {
        patientId: 'patient-2',
        patientName: 'John Smith',
        messages: [
          {
            id: '1',
            text: 'Thank you for the resources you shared last week.',
            sender: 'patient',
            timestamp: new Date(Date.now() - 7200000).toISOString(),
            encrypted: true
          },
          {
            id: '2',
            text: 'You\'re welcome, John. How are the breathing exercises working for you?',
            sender: 'therapist',
            timestamp: new Date(Date.now() - 7100000).toISOString(),
            encrypted: true
          }
        ],
        lastActivity: new Date(Date.now() - 7100000).toISOString(),
        unread: true
      },
      'patient-3': {
        patientId: 'patient-3',
        patientName: 'Mary Johnson',
        messages: [
          {
            id: '1',
            text: 'Looking forward to our session on Tuesday!',
            sender: 'patient',
            timestamp: new Date(Date.now() - 86400000).toISOString(),
            encrypted: true
          },
          {
            id: '2',
            text: 'See you then, Mary! Remember to bring your journal.',
            sender: 'therapist',
            timestamp: new Date(Date.now() - 86300000).toISOString(),
            encrypted: true
          }
        ],
        lastActivity: new Date(Date.now() - 86300000).toISOString(),
        unread: false
      }
    };
  });

  // Save to localStorage whenever conversations change
  useEffect(() => {
    localStorage.setItem('haven-conversations', JSON.stringify(conversations));
  }, [conversations]);

  const sendMessage = (patientId, message) => {
    setConversations(prev => {
      const newConv = { ...prev };
      
      // Create conversation if it doesn't exist
      if (!newConv[patientId]) {
        newConv[patientId] = {
          patientId,
          patientName: message.patientName || 'New Patient',
          messages: [],
          lastActivity: new Date().toISOString(),
          unread: false
        };
      }
      
      // Add the message
      const newMessage = {
        id: Date.now().toString(),
        text: message.text,
        sender: message.sender || 'therapist',
        timestamp: new Date().toISOString(),
        encrypted: true
      };
      
      newConv[patientId].messages.push(newMessage);
      newConv[patientId].lastActivity = new Date().toISOString();
      
      // If it's from a patient, mark as unread
      if (message.sender === 'patient') {
        newConv[patientId].unread = true;
      }
      
      return newConv;
    });
  };

  const markAsRead = (patientId) => {
    setConversations(prev => {
      if (!prev[patientId]) return prev;
      
      return {
        ...prev,
        [patientId]: {
          ...prev[patientId],
          unread: false
        }
      };
    });
  };

  const getConversation = (patientId) => {
    return conversations[patientId] || null;
  };

  const getAllConversations = () => {
    return Object.values(conversations).sort((a, b) => 
      new Date(b.lastActivity) - new Date(a.lastActivity)
    );
  };

  return (
    <MessageStorageContext.Provider value={{
      conversations,
      sendMessage,
      markAsRead,
      getConversation,
      getAllConversations
    }}>
      {children}
    </MessageStorageContext.Provider>
  );
}