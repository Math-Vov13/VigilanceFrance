import { Server, Socket } from "socket.io";
import { getAllMessages, getMessagesByMarkID } from './dbtest/db_messages'; //  get ALL Messages: optionnel (ligne  115)
import jwt from "jsonwebtoken";
import http from 'http';
import { decode_AccessToken } from "./security/jwt";


export function extractUserFromSocket(socket: Socket) {
  const token =
    socket.handshake.auth?.token ||
    socket.handshake.headers?.authorization?.split(" ")[1] ||
    socket.handshake.headers?.cookie?.split("Atk=")[1];

  if (!token) return null;

  try {
    const user = decode_AccessToken(token, socket.handshake.headers["user-agent"] as string);
    return user; 
  } catch (err) {
    return null;
  }
}


const JWT_SECRET = process.env.ACCESSTOKEN_SECRET_KEY || 'access_token_secret_key';

interface tkPL { //token PayLoad
  userId: string;
  username: string;
  role?: string;
  iat?: number;
  exp?: number;
}

const activeUsers = new Map<string, string>(); // userid & socketid

export function setupSocket(server: http.Server) {
  const io = new Server(server, {
    cors: {
      origin: true,
      credentials: true
    }
  });


// Middleware
  io.use((socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.split(" ")[1];

    if (!token) { // Le Token est  obligatoire.
      console.log("Bah y'a pas de token :/");
      return next(new Error("No Token")); 
    }

    try {
      const PL = jwt.verify(token, JWT_SECRET) as tkPL; // Verification du Payload (PL) / ressource -> https://www.npmjs.com/package/jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
      (socket as any).user = PL;
      next();
    } catch (e) {
      console.log("Token invalide :/", e);
      return next(new Error("authentication error"));
    }
  });

  io.on("connection", (socket) => {
    const user = (socket as any).user as tkPL | undefined;
    
    console.log(`Client connected: ${socket.id}${user ? ` (user: ${user.username})` : " (unauthenticated)"}`);

    if (user) {
      activeUsers.set(user.userId, socket.id);
    }

    const markerID = socket.handshake.query.markerID as string;
    if (markerID) {
      socket.join(markerID);
      console.log(`${socket.id} joined comments section (room) ${markerID}`);
    } else if (!markerID) { 
      console.log("Erreur MarkerID");
      return new Error("MarkerID NotFound"); 
    }

    sendAllMessages(socket, markerID);

    socket.on("message", (data) => {
      if (!user) {
        console.warn(`Non-authenticated user tried to send message: ${socket.id}`);
        socket.emit("error_no_auth");
        return;
      }

      if (markerID) {
        io.to(markerID).emit("message", {
          user: user.username,
          content: data
        });
      }
    });

    socket.on("disconnect", () => {
      if (user && activeUsers.get(user.userId) === socket.id) {
        activeUsers.delete(user.userId);
        console.log(`User ${user.username} disconnected and session cleared.`);
      }
    });
  });

  async function sendAllMessages(socket: Socket, markerID?: string) {

    try {
      /* Optionnel - Logique Test pour retourner getAllMessages() si le MarkerID n'est pas présent.
      if (!markerID) {
        const messages = await getAllMessages();
        socket.emit("all_messages", messages);
        return;
      }
      */

      const messages = await getMessagesByMarkID(markerID as string);
      socket.emit("all_messages_by_marker", messages);
    } catch (err) {
      console.error("Error fetching messages:", err);
      socket.emit("error_fetching_messages");
    }
  }
}
