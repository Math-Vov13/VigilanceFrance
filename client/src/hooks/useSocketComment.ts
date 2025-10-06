import { useState, useEffect, useCallback, useRef } from 'react';
import socketService, { socketMessagesToComments } from '../services/socketService';

import { Comment } from '../types';
import { Socket } from 'socket.io-client';

const API_URL = import.meta.env.VITE_PUBLIC_API_MESS_URL || 'http://localhost:8000/api/mess';

/**
 * Custom hook for managing comments using WebSockets
 * @param issueId - The ID of the issue to connect to
 */
export const useSocketComments = (issueId: string) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    if (!issueId) return;

    const fetchInitialComments = async () => {
        try {
          setLoading(true);
          
          // Utiliser le bon chemin d'endpoint
          const response = await fetch(`${API_URL}/messages?issue_id=${issueId}`, {
            credentials: 'include'
          });
          
          if (!response.ok) {
            console.warn(`API returned ${response.status} for messages`);
            // Initialiser avec un tableau vide en cas d'erreur
            setComments([]);
            setError("Impossible de charger les commentaires initiaux");
            return;
          }
          
          const data = await response.json();
          // Convertir les messages
          const convertedComments = Array.isArray(data.messages) 
            ? socketMessagesToComments(data.messages) 
            : [];
          setComments(convertedComments);
          setError(null);
        } catch (err) {
          console.error('Error fetching initial comments:', err);
          setComments([]); 
          setError('Impossible de charger les commentaires');
        } finally {
          setLoading(false);
        }
      };
    socketRef.current = socketService.initializeSocket(issueId);
    
    // Register event handlers
    const unsubscribeMessage = socketService.onMessage((message) => {
      setComments(prev => [...prev, message]);
    });
    
    const unsubscribeError = socketService.onError((errorMessage) => {
      setError(errorMessage);
    });
    
    const unsubscribeConnect = socketService.onConnect(() => {
      setIsConnected(true);
      setError(null);
    });
    
    const unsubscribeDisconnect = socketService.onDisconnect(() => {
      setIsConnected(false);
    });
    
    fetchInitialComments();

    return () => {
      unsubscribeMessage();
      unsubscribeError();
      unsubscribeConnect();
      unsubscribeDisconnect();
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
      socketService.disconnectSocket();
    };
  }, [issueId]);

  const sendComment = useCallback((text: string) => {
    if (!isConnected) {
      setError('Not connected to the comment server');
      return;
    }
    
    socketService.sendMessage(text);
  }, [isConnected]);

  return {
    comments,
    isConnected,
    error,
    loading,
    sendComment
  };
};

export default useSocketComments;