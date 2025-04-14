import { Server } from "socket.io";
import { getAllMessages } from './model/db_messages';
import jwt from 'jsonwebtoken';
import { TokenPayload } from './security/jwt';
import http from 'http';

const JWT_SECRET = process.env.ACCESSTOKEN_SECRET_KEY || 'access_token_secret_key';

const activeUsers = new Map<string, string>(); // userid & socketid

export function setupSocket(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: true, 
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);
    // Ajoute un middleware pour vérifier l'authentification avant d'écouter les événements
    // => socket.use((packet, next) => {

    // Ensuite, en fonction du MarkerID, redirige le vers une Room avec le MarkerID
    // socket.join(MarkerID); // Remplacez MarkerID par l'ID de la room souhaitée
    
    sendAllMessages(socket);
    //  //////////////// Pas besoin de l'évènement "authenticate" ici ////////////////////

    // socket.on("authenticate", (token: string) => {
    //   try {
    //     const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;
    //     const userId = payload.userId;

    //     if (activeUsers.has(userId)) {
    //       const previousSocketId = activeUsers.get(userId);
    //       if (previousSocketId && previousSocketId !== socket.id) {
    //         const oldSocket = io.sockets.sockets.get(previousSocketId);
    //         if (oldSocket) {
    //           oldSocket.emit("duplicate_session");
    //           oldSocket.disconnect(true);
    //         }
    //       }
    //     }

    //     activeUsers.set(userId, socket.id);
    //     (socket as any).user = payload;

    //     console.log("Authenticated user:", payload);
    //     socket.emit("authentication_successful", { username: payload.username });

    //   } catch (err) {
    //     console.error("Authentication failed:", err);
    //     socket.emit("unauthorized");
    //   }
    // });

    // ///////////////////////// Ajoute un évènement message ! Pour envoyer un message et le recevoir par tous les utilisateurs connectés dans la room du MarkerID ///////////////////
    //socket.on("message", () => {

    socket.on("disconnect", () => {
      for (const [userId, socketId] of activeUsers.entries()) {
        if (socketId === socket.id) {
          activeUsers.delete(userId);
          console.log(`User ${userId} disconnected and session cleared.`);
          break;
        }
      }
    });
  });

  async function sendAllMessages(socket: any) {
    try {
      const messages = getAllMessages(); // Envoie Juste le dernier message envoyé ??? Pas besoin de tout envoyer.
      socket.emit("all_messages", messages);
    } catch (err) {
      console.error("Error fetching messages:", err);
      socket.emit("error_fetching_messages");
    }
  }
}