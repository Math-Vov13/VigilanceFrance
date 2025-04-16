import { io, Socket } from 'socket.io-client';
import { Comment, SocketMessage } from '../types';


let socket: Socket | null = null;
let currentIssueId: string | null = null;

// Callback storage
const messageCallbacks = new Set<(message: Comment) => void>();
const errorCallbacks = new Set<(error: string) => void>();
const connectionCallbacks = new Set<() => void>();
const disconnectionCallbacks = new Set<() => void>();

/**
 * Initialize the socket
 * @param issueId 
 */
export const initializeSocket = (issueId: string): void => {
    console.log(`Initializing socket for issue ${issueId}...`);
    
    if (socket && currentIssueId === issueId && socket.connected) {
      console.log('Socket already connected to this issue');
      return;
    }
  
    if (socket) {
      console.log(`Disconnecting existing socket for issue ${currentIssueId}...`);
      socket.disconnect();
    }
  
    currentIssueId = issueId;
    
    console.log(`Creating new socket for issue ${issueId}...`);
    socket = io('ws://localhost:3000/v1/mess', {
      query: { issue_id: issueId },
      withCredentials: true,
      transports: ['websocket', 'polling'],
      autoConnect: true
    });
  
    socket.on('connect', () => {
      console.log(`Socket connected to issue ${issueId}`);
      connectionCallbacks.forEach(callback => callback());
    });
  
    socket.on('disconnect', () => {
      console.log(`Socket disconnected from issue ${issueId}`);
      disconnectionCallbacks.forEach(callback => callback());
    });

  socket.on('message', (message: Comment) => {
    console.log('New message received:', message);
    messageCallbacks.forEach(callback => callback(message));
  });

  socket.on('error', (error: string) => {
    console.error('Socket error:', error);
    errorCallbacks.forEach(callback => callback(error));
  });

  socket.on('error_no_auth', () => {
    console.error('Authentication error');
    errorCallbacks.forEach(callback => callback('Authentication required'));
  });

  socket.on('connect_error', (error) => {
    console.error('Connection error:', error);
    errorCallbacks.forEach(callback => callback(`Connection error: ${error.message}`));
  });
};

export const socketMessageToComment = (socketMessage: SocketMessage): Comment => {
    return {
      id: socketMessage._id,
      text: socketMessage.message,
      user: `${socketMessage.firstName} ${socketMessage.lastName}`.trim() || 'Utilisateur',
      firstName: socketMessage.firstName,
      lastName: socketMessage.lastName,
      date: socketMessage.created_at,
      likes: socketMessage.likes || 0,
      reported: socketMessage.reported || false
    };
  };
  
  /**
   * Convert an array of SocketMessages to Comments
   */
  export const socketMessagesToComments = (socketMessages: SocketMessage[]): Comment[] => {
    return socketMessages.map(socketMessageToComment);
  };

/**
 * Send a message
 * @param text
 */
export const sendMessage = (text: string): void => {
  if (!socket || !socket.connected) {
    console.error('Socket not connected');
    errorCallbacks.forEach(callback => callback('Socket not connected'));
    return;
  }

  socket.emit('message', { message: text });
};

/**
 * Disconnect the socket
 */
export const disconnectSocket = (): void => {
    if (socket) {
        if (socket.connected) {
            socket.disconnect();
        }     else {
            const disconnectOnce = () => {
            socket?.disconnect();
            socket?.off('connect', disconnectOnce);
            };
            socket.once('connect', disconnectOnce);
        }
      
        socket = null;
        currentIssueId = null;
    }
  }

/**
 * Register a callback for new messages
 * @param callback - Function to call when a new message is received
 */
export const onMessage = (callback: (message: Comment) => void): () => void => {
  messageCallbacks.add(callback);
  return () => {
    messageCallbacks.delete(callback);
  };
};

/**
 * Register a callback for socket errors
 * @param callback - Function to call when a socket error occurs
 */
export const onError = (callback: (error: string) => void): () => void => {
  errorCallbacks.add(callback);
  return () => {
    errorCallbacks.delete(callback);
  };
};

/**
 * Register a callback for socket connection
 * @param callback - Function to call when socket connects
 */
export const onConnect = (callback: () => void): () => void => {
  connectionCallbacks.add(callback);
  return () => {
    connectionCallbacks.delete(callback);
  };
};

/**
 * Register a callback for socket disconnection
 * @param callback
 */
export const onDisconnect = (callback: () => void): () => void => {
  disconnectionCallbacks.add(callback);
  return () => {
    disconnectionCallbacks.delete(callback);
  };
};

export default {
  initializeSocket,
  sendMessage,
  disconnectSocket,
  onMessage,
  onError,
  onConnect,
  onDisconnect
};