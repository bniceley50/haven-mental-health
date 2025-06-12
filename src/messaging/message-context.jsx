import React, { createContext, useContext, useState, useEffect } from 'react';

const MessageContext = createContext();

/**
 * Message Context
 * Manages unread messages and notifications
 * Simple state management for messaging features
 */
export function MessageProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  
  useEffect(() => {
    // Load messages from storage
    loadMessages();
  }, []);

  const loadMessages = () => {
    // In real app, this would load from secure backend
    const storedMessages = [
      {
        id: 1,
        patientId: 'patient-1',
        patientName: 'Jane Doe',
        preview: 'I wanted to discuss our last session...',
        timestamp: new Date(Date.now() - 3600000),
        read: false
      },
      {
        id: 2,
        patientId: 'patient-2',
        patientName: 'John Smith',
        preview: 'Thank you for the resources you shared',
        timestamp: new Date(Date.now() - 7200000),
        read: false
      }
    ];
    
    setMessages(storedMessages);
    setUnreadCount(storedMessages.filter(m => !m.read).length);
  };

  const markAsRead = (messageId) => {
    setMessages(messages.map(m => 
      m.id === messageId ? { ...m, read: true } : m
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const recentMessages = messages
    .filter(m => !m.read)
    .sort((a, b) => b.timestamp - a.timestamp);

  const value = {
    messages,
    unreadCount,
    recentMessages,
    markAsRead
  };

  return (
    <MessageContext.Provider value={value}>
      {children}
    </MessageContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error('useMessages must be used within MessageProvider');
  }
  return context;
}