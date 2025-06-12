import { randomBytes } from '@noble/hashes/utils';

/**
 * Encryption Service
 * Handles all encryption/decryption operations for PHI data
 * Uses Web Crypto API with AES-256-GCM
 */
export class EncryptionService {
  constructor() {
    this.algorithm = 'AES-GCM';
    this.keyLength = 256;
    this.ivLength = 12; // 96 bits for GCM
    this.tagLength = 128; // 128-bit auth tag
    this.masterKey = null;
  }

  async initialize() {
    // In production, this would retrieve/generate keys securely
    // For now, we'll generate a new key per session
    this.masterKey = await this.generateKey();
    
    // Store key in session storage (not ideal for production)
    // Real implementation would use secure key management
    const exportedKey = await window.crypto.subtle.exportKey('raw', this.masterKey);
    sessionStorage.setItem('haven-temp-key', this.arrayBufferToBase64(exportedKey));
  }

  async generateKey() {
    return window.crypto.subtle.generateKey(
      {
        name: this.algorithm,
        length: this.keyLength
      },
      true, // extractable
      ['encrypt', 'decrypt']
    );
  }

  async encrypt(data) {
    if (!this.masterKey) {
      throw new Error('Encryption key not initialized');
    }

    // Convert data to JSON string
    const plaintext = JSON.stringify(data);
    const encoder = new TextEncoder();
    const encodedData = encoder.encode(plaintext);

    // Generate random IV
    const iv = randomBytes(this.ivLength);

    // Encrypt
    const ciphertext = await window.crypto.subtle.encrypt(
      {
        name: this.algorithm,
        iv: iv,
        tagLength: this.tagLength
      },
      this.masterKey,
      encodedData
    );

    // Combine IV and ciphertext
    const combined = new Uint8Array(iv.length + ciphertext.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(ciphertext), iv.length);

    // Return base64 encoded
    return {
      data: this.arrayBufferToBase64(combined),
      algorithm: this.algorithm,
      timestamp: Date.now()
    };
  }

  async decrypt(encryptedData) {
    if (!this.masterKey) {
      throw new Error('Encryption key not initialized');
    }

    // Decode from base64
    const combined = this.base64ToArrayBuffer(encryptedData.data);
    
    // Extract IV and ciphertext
    const iv = combined.slice(0, this.ivLength);
    const ciphertext = combined.slice(this.ivLength);

    // Decrypt
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: this.algorithm,
        iv: iv,
        tagLength: this.tagLength
      },
      this.masterKey,
      ciphertext
    );

    // Decode and parse JSON
    const decoder = new TextDecoder();
    const plaintext = decoder.decode(decrypted);
    return JSON.parse(plaintext);
  }

  // Utility functions
  arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  }

  base64ToArrayBuffer(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  }

  // Generate encryption metadata for audit logs
  getEncryptionMetadata() {
    return {
      algorithm: this.algorithm,
      keyLength: this.keyLength,
      ivLength: this.ivLength,
      tagLength: this.tagLength,
      timestamp: new Date().toISOString()
    };
  }
}

// What we're NOT implementing:
// - Key rotation (can add later)
// - Hardware security module (HSM) integration
// - Multi-tenant key management
// - Encrypted search capabilities
// - Homomorphic encryption
// Just solid, standard AES-256-GCM encryption