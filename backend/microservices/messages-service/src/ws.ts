import WebSocket from 'ws';
import { Server } from 'http';
import { getAllMessages, addMessage, Message } from './model/db_messages';
import jwt from 'jsonwebtoken';
import { TokenPayload } from './security/jwt';

// La clé secrète devrait être la même que celle utilisée dans jwt.ts
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Interface pour les messages WebSocket
interface WSMessage {
  type: 'authentication' | 'message' | 'getMessages' | 'newMessage';
  payload: any;
}

export function setupWebSocket(server: Server) {
  const wss = new WebSocket.Server({ server });
  
  wss.on('connection', (ws) => {
    console.log('Client connecté au WebSocket');
    
    let isAuthenticated = false;
    let user: TokenPayload | null = null;
    
    ws.on('message', (message: string) => {
      try {
        const data: WSMessage = JSON.parse(message);
        
        // Gestion des types de messages
        switch (data.type) {
          case 'authentication':
            // Authentification avec le token JWT
            try {
              const token = data.payload.token;
              user = jwt.verify(token, JWT_SECRET) as TokenPayload;
              isAuthenticated = true;
              ws.send(JSON.stringify({ 
                type: 'authentication', 
                payload: { success: true, message: 'Authentifié avec succès' } 
              }));
              
              // Envoyer les messages existants après authentification
              const messages = getAllMessages();
              ws.send(JSON.stringify({ type: 'messages', payload: messages }));
            } catch (error) {
              ws.send(JSON.stringify({ 
                type: 'authentication', 
                payload: { success: false, message: 'Échec de l\'authentification' } 
              }));
            }
            break;
          
          case 'getMessages':
            // Vérifier l'authentification avant d'envoyer les messages
            if (!isAuthenticated) {
              ws.send(JSON.stringify({ 
                type: 'error', 
                payload: { message: 'Authentification requise' } 
              }));
              break;
            }
            
            const messages = getAllMessages();
            ws.send(JSON.stringify({ type: 'messages', payload: messages }));
            break;
          
          case 'message':
            // Vérifier l'authentification avant d'ajouter un message
            if (!isAuthenticated || !user) {
              ws.send(JSON.stringify({ 
                type: 'error', 
                payload: { message: 'Authentification requise' } 
              }));
              break;
            }
            
            const { text, coordinates } = data.payload;
            
            if (!text) {
              ws.send(JSON.stringify({ 
                type: 'error', 
                payload: { message: 'Le contenu du message est requis' } 
              }));
              break;
            }
            
            const newMessage = addMessage({
              user: user.username,
              text,
              date: new Date().toISOString(),
              coordinates
            });
            
            // Diffuser le nouveau message à tous les clients connectés
            broadcastMessage(wss, {
              type: 'newMessage',
              payload: newMessage
            });
            break;
          
          default:
            ws.send(JSON.stringify({ 
              type: 'error', 
              payload: { message: 'Type de message non pris en charge' } 
            }));
        }
      } catch (error) {
        console.error('Erreur lors du traitement du message WebSocket:', error);
        ws.send(JSON.stringify({ 
          type: 'error', 
          payload: { message: 'Format de message invalide' } 
        }));
      }
    });
    
    ws.on('close', () => {
      console.log('Client déconnecté du WebSocket');
    });
  });
  
  // Fonction pour diffuser un message à tous les clients connectés
  function broadcastMessage(wss: WebSocket.Server, message: WSMessage) {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(message));
      }
    });
  }
  
  console.log('Serveur WebSocket configuré');
  return wss;
}