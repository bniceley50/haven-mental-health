import React, { createContext, useContext, useState, useEffect } from 'react';
import { EncryptionService } from './encryption-service';

export const EncryptionContext = createContext();

/**
 * Encryption Provider
 * Manages encryption keys and provides encryption/decryption services
 * Uses AES-256-GCM for symmetric encryption
 */
export function EncryptionProvider({ children }) {
  const [encryptionService, setEncryptionService] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    initializeEncryption();
  }, []);

  const initializeEncryption = async () => {
    try {
      const service = new EncryptionService();
      await service.initialize();
      setEncryptionService(service);
      setIsReady(true);
    } catch (error) {
      console.error('Failed to initialize encryption:', error);
    }
  };

  const encrypt = async (data) => {
    if (!encryptionService) {
      throw new Error('Encryption service not initialized');
    }
    return encryptionService.encrypt(data);
  };

  const decrypt = async (encryptedData) => {
    if (!encryptionService) {
      throw new Error('Encryption service not initialized');
    }
    return encryptionService.decrypt(encryptedData);
  };

  const value = {
    encrypt,
    decrypt,
    isReady
  };

  return (
    <EncryptionContext.Provider value={value}>
      {children}
    </EncryptionContext.Provider>
  );
}

export function useEncryption() {
  const context = useContext(EncryptionContext);
  if (!context) {
    throw new Error('useEncryption must be used within EncryptionProvider');
  }
  return context;
}