import { Server, Socket } from "socket.io";
import { addMessage } from './models/db_messages'; //  get ALL Messages: optionnel (ligne  115)
import http from 'http';
import { decode_AccessToken } from "./security/jwt";
import { createMessage } from "./schemas/message_sc";
import { Request } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { redisClient } from "./models/redis-connector";


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


interface tkPL { //token PayLoad
  userId: string;
  username: string;
  role?: string;
  iat?: number;
  exp?: number;
}

const activeUsers = new Map<string, string>(); // userid & socketid
const INCOMING_MESSAGE_CHANNEL = "new_message";


export function setupSocket(server: http.Server) {
  const io = new Server(server, {
    cors: {
      "origin": "http://localhost:5173",
      "credentials": true,
      "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      "allowedHeaders": ["Content-Type", "Authorization"],
      "exposedHeaders": ["Content-Type", "Authorization"]
    }
  });

  io.engine.use(morgan('tiny'));
  io.engine.use(cookieParser());


  // Middlewares
  io.use((socket, next) => {
    const token =
      socket.handshake.auth?.token ||
      socket.handshake.headers?.authorization?.split(" ")[1] ||
      socket.handshake.headers?.cookie?.split("Atk=")[1];

    if (!token) {
      console.log("No Token found!");
      return next(new Error("No Token"));
    };

    try {
      const user_id = decode_AccessToken(token, socket.handshake.headers["user-agent"] as string);
      if (!user_id) {
        console.log("Invalid Token!");
        return next(new Error("authentication error"));
      }

      // Verify User with id in DB !

      socket.data.user_id = user_id;

    } catch (err) {
      console.log("Invalid Token!", err);
      return next(new Error("authentication error"));
    }

    next();
    // const token =
    //   socket.handshake.auth?.token ||
    //   socket.handshake.headers?.authorization?.split(" ")[1] ||
    //   socket.handshake.headers?.cookie?.split("Atk=")[1];

    // if (!token) { // Le Token est  obligatoire.
    //   console.log("No Token found!");
    //   return next(new Error("No Token"));
    // }

    // try {
    //   const PL = jwt.verify(token, JWT_SECRET) as tkPL; // Verification du Payload (PL) / ressource -> https://www.npmjs.com/package/jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
    //   (socket as any).user = PL;
    //   next();
    // } catch (e) {
    //   console.log("Token invalide :/", e);
    //   return next(new Error("authentication error"));
    // }
  });



  io.on("connection", (socket) => {
    const session = (socket.request as Request).session;
    const user = (socket as any).user as tkPL | undefined;

    console.log(`Client connected: ${socket.id}${user ? ` (user: ${user.username})` : " (unauthenticated)"}`);
    if (!session) {
      return new Error("Session ID is not valid!");
    }

    if (user) {
      activeUsers.set(user.userId, socket.id);
    }

    const issue_id = socket.handshake.query.issue_id as string;
    if (!issue_id) {
      console.log("Erreur MarkerID");
      return new Error("MarkerID NotFound");
    }

    socket.join(issue_id);
    console.log(`${socket.id} joined comments section (room) ${issue_id}`);
    // sendAllMessages(socket, markerID);

    socket.on("message", async (data) => {
      if (!session || session.connected !== true) {
        return new Error("Session ID is not valid!");
      }

      let newMessage = null;
      try {
        newMessage = await createMessage.parseAsync(data);
      } catch {
        socket.emit("error", "Schema not valid!");
        return;
      }


      if (!user) {
        console.warn(`Non-authenticated user tried to send message: ${socket.id}`);
        socket.emit("error_no_auth");
        return;
      }

      if (issue_id) {
        const mess = await addMessage(issue_id, socket.data.user_id, session.lastName as string, session.firstName as string, newMessage.message);

        // PUB EVENT (add message)
        await redisClient.publish(INCOMING_MESSAGE_CHANNEL, JSON.stringify(mess));

        io.to(issue_id).emit("message", mess);
      }
    });

    socket.on("disconnect", () => {
      if (user && activeUsers.get(user.userId) === socket.id) {
        activeUsers.delete(user.userId);
        console.log(`User ${user.username} disconnected and session cleared.`);
      }
    });
  });

  // async function sendAllMessages(socket: Socket, markerID?: string) {

  //   try {
  //     /* Optionnel - Logique Test pour retourner getAllMessages() si le MarkerID n'est pas présent.
  //     if (!markerID) {
  //       const messages = await getAllMessages();
  //       socket.emit("all_messages", messages);
  //       return;
  //     }
  //     */

  //     const messages = await getMessagesByMarkID(markerID as string);
  //     socket.emit("all_messages_by_marker", messages);
  //   } catch (err) {
  //     console.error("Error fetching messages:", err);
  //     socket.emit("error_fetching_messages");
  //   }
  // }
}
