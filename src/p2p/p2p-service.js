/**
 * P2P Service
 * Handles WebRTC peer-to-peer connections
 * Simple signaling through WebSocket, direct data/media channels
 */
export class P2PService {
  constructor() {
    this.signalingServer = null;
    this.localPeerId = null;
    this.iceServers = [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' }
    ];
  }

  async initialize() {
    // Generate local peer ID
    this.localPeerId = this.generatePeerId();
    
    // Connect to signaling server
    // In production, this would be a secure WebSocket server
    this.connectToSignalingServer();
  }

  generatePeerId() {
    return 'peer-' + Math.random().toString(36).substr(2, 9);
  }

  connectToSignalingServer() {
    // Simplified for demo - real implementation would use secure WebSocket
    console.log('Connecting to signaling server...');
    
    // Simulate connection
    setTimeout(() => {
      console.log('Connected to signaling server');
    }, 1000);
  }

  async connectToPeer(peerId) {
    return new P2PConnection(peerId, this.iceServers);
  }
}

/**
 * Individual P2P Connection
 * Manages a single peer connection with data and media channels
 */
class P2PConnection {
  constructor(peerId, iceServers) {
    this.peerId = peerId;
    this.pc = null;
    this.dataChannel = null;
    this.localStream = null;
    this.remoteStream = null;
    this.isConnected = false;
    this.state = 'new';
    this.messageHandlers = [];
    this.remoteStreamHandlers = [];
    
    this.initializePeerConnection(iceServers);
  }

  initializePeerConnection(iceServers) {
    this.pc = new RTCPeerConnection({
      iceServers: iceServers
    });

    // Handle connection state changes
    this.pc.onconnectionstatechange = () => {
      this.state = this.pc.connectionState;
      this.isConnected = this.state === 'connected';
      console.log('Connection state:', this.state);
    };

    // Handle incoming tracks (for video/audio)
    this.pc.ontrack = (event) => {
      if (event.streams && event.streams[0]) {
        this.remoteStream = event.streams[0];
        this.remoteStreamHandlers.forEach(handler => handler(this.remoteStream));
      }
    };

    // Create data channel for messages
    this.dataChannel = this.pc.createDataChannel('messages', {
      ordered: true
    });

    this.dataChannel.onopen = () => {
      console.log('Data channel opened');
      this.isConnected = true;
    };

    this.dataChannel.onmessage = (event) => {
      const message = JSON.parse(event.data);
      this.messageHandlers.forEach(handler => handler(message));
    };

    // Start connection process
    this.createOffer();
  }

  async createOffer() {
    try {
      const offer = await this.pc.createOffer();
      await this.pc.setLocalDescription(offer);
      
      // In real implementation, send offer through signaling server
      console.log('Offer created and set as local description');
    } catch (error) {
      console.error('Failed to create offer:', error);
    }
  }

  async handleAnswer(answer) {
    try {
      await this.pc.setRemoteDescription(answer);
      console.log('Answer set as remote description');
    } catch (error) {
      console.error('Failed to handle answer:', error);
    }
  }

  send(message) {
    if (this.dataChannel && this.dataChannel.readyState === 'open') {
      this.dataChannel.send(JSON.stringify(message));
      return true;
    }
    return false;
  }

  onMessage(callback) {
    this.messageHandlers.push(callback);
    return () => {
      this.messageHandlers = this.messageHandlers.filter(h => h !== callback);
    };
  }

  onRemoteStream(callback) {
    this.remoteStreamHandlers.push(callback);
    // If stream already available, call immediately
    if (this.remoteStream) {
      callback(this.remoteStream);
    }
    return () => {
      this.remoteStreamHandlers = this.remoteStreamHandlers.filter(h => h !== callback);
    };
  }

  async startCall(localStream) {
    this.localStream = localStream;
    
    // Add tracks to peer connection
    localStream.getTracks().forEach(track => {
      this.pc.addTrack(track, localStream);
    });

    // Renegotiate if needed
    if (this.pc.signalingState === 'stable') {
      await this.createOffer();
    }
  }

  endCall() {
    // Stop all local tracks
    if (this.localStream) {
      this.localStream.getTracks().forEach(track => track.stop());
    }
    
    // Close peer connection
    if (this.pc) {
      this.pc.close();
    }
    
    this.isConnected = false;
    this.state = 'closed';
  }

  toggleVideo() {
    if (this.localStream) {
      const videoTrack = this.localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
      }
    }
  }

  toggleAudio() {
    if (this.localStream) {
      const audioTrack = this.localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
      }
    }
  }
}

// What we're NOT implementing:
// - Complex signaling protocols (SIP, XMPP)
// - Multi-party video conferencing
// - Screen recording
// - Network quality adaptation
// - Simulcast/SVC
// Just simple, reliable P2P connections