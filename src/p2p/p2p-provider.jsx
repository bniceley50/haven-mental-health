import React, { createContext, useContext, useState, useEffect } from 'react';
import { P2PService } from './p2p-service';

const P2PContext = createContext();

/**
 * P2P Provider
 * Manages peer-to-peer connections for secure messaging and video
 * Uses WebRTC for direct therapist-patient communication
 */
export function P2PProvider({ children }) {
  const [p2pService, setP2PService] = useState(null);
  const [connections, setConnections] = useState(new Map());
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initializeP2P();
  }, []);

  const initializeP2P = async () => {
    try {
      const service = new P2PService();
      await service.initialize();
      setP2PService(service);
      setIsReady(true);
    } catch (error) {
      console.error('Failed to initialize P2P:', error);
    }
  };

  const connectToPeer = async (peerId) => {
    if (!p2pService) {
      throw new Error('P2P service not initialized');
    }

    // Check if already connected
    if (connections.has(peerId)) {
      return connections.get(peerId);
    }

    // Create new connection
    const connection = await p2pService.connectToPeer(peerId);
    setConnections(new Map(connections.set(peerId, connection)));
    
    return connection;
  };

  const sendMessage = async (peerId, message) => {
    const connection = await connectToPeer(peerId);
    return connection.send(message);
  };

  const onMessage = (peerId, callback) => {
    const connection = connections.get(peerId);
    if (!connection) {
      console.warn('No connection found for peer:', peerId);
      return () => {};
    }

    return connection.onMessage(callback);
  };

  const startCall = async (peerId, localStream) => {
    const connection = await connectToPeer(peerId);
    return connection.startCall(localStream);
  };

  const endCall = (peerId) => {
    const connection = connections.get(peerId);
    if (connection) {
      connection.endCall();
    }
  };

  const value = {
    isReady,
    connectToPeer,
    sendMessage,
    onMessage,
    startCall,
    endCall,
    connections
  };

  return (
    <P2PContext.Provider value={value}>
      {children}
    </P2PContext.Provider>
  );
}

export function useP2P(peerId) {
  const context = useContext(P2PContext);
  if (!context) {
    throw new Error('useP2P must be used within P2PProvider');
  }

  const { connections, sendMessage, onMessage, startCall, endCall, connectToPeer } = context;
  const connection = connections.get(peerId);

  return {
    isConnected: connection?.isConnected || false,
    connectionState: connection?.state || 'disconnected',
    sendMessage: (message) => sendMessage(peerId, message),
    onMessage: (callback) => onMessage(peerId, callback),
    startCall: (stream) => startCall(peerId, stream),
    endCall: () => endCall(peerId),
    connect: () => connectToPeer(peerId),
    onRemoteStream: (callback) => {
      if (connection) {
        return connection.onRemoteStream(callback);
      }
      return () => {};
    },
    toggleVideo: () => connection?.toggleVideo(),
    toggleAudio: () => connection?.toggleAudio()
  };
}