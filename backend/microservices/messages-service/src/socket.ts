import { Server } from "socket.io";
import { getAllMessages } from './model/db_messages';
import jwt from 'jsonwebtoken';
import { TokenPayload } from './security/jwt';
import http from 'http';

const JWT_SECRET = process.env.JWT_SECRET || 'scecretcte_ckeyekeykeykey';

const activeUsers = new Map<string, string>(); // userid & socketid

export function setupSocket(server: http.Server) {
  const io = new Server(server, {
    cors: {
      // origin: "*", // Ne fonctionne pas avec credentials: true
      origin: true, 
      credentials: true
    }
  });

  io.on("connection", (socket) => {
    console.log(`Client connected: ${socket.id}`);

    socket.on("authenticate", (token: string) => {
      try {
        const payload = jwt.verify(token, JWT_SECRET) as TokenPayload;
        const userId = payload.userId;

        if (activeUsers.has(userId)) {
          const previousSocketId = activeUsers.get(userId);
          if (previousSocketId && previousSocketId !== socket.id) { // déco ancien socket (verif par rapport a actuelle)
            const oldSocket = io.sockets.sockets.get(previousSocketId);
            if (oldSocket) {
              oldSocket.emit("duplicate_session");
              oldSocket.disconnect(true);
            }
          }
        }

        activeUsers.set(userId, socket.id);
        (socket as any).user = payload;

        console.log("Authenticated user:", payload);
        sendAllMessages(socket);

      } catch (err) {
        console.error("Authentication failed:", err);
        socket.emit("unauthorized");
      }
    });

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
      const messages = await getAllMessages(); // de db_messages.ts
      socket.emit("all_messages", messages); // emit --> client
    } catch (err) { // si erreur
      console.error("Error fetching messages:", err); // debug
      socket.emit("error_fetching_messages");
    }
  }
}