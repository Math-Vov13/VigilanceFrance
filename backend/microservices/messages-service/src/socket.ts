import { Server, Socket } from "socket.io";
import { addMessage } from './models/db_messages'; //  get ALL Messages: optionnel (ligne  115)
import http from 'http';
import { decode_AccessToken } from "./security/jwt";
import { createMessage } from "./schemas/message_sc";
import { Request } from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import { redisClient } from "./models/redis-connector";
import { sessionMiddleware } from "./sessionStorage";
import { getUserById } from "./models/users_db";


// export function extractUserFromSocket(socket: Socket) {
//   const token =
//     socket.handshake.auth?.token ||
//     socket.handshake.headers?.authorization?.split(" ")[1] ||
//     socket.handshake.headers?.cookie?.split("Atk=")[1];

//   if (!token) return null;

//   try {
//     const user = decode_AccessToken(token, socket.handshake.headers["user-agent"] as string);
//     return user;
//   } catch (err) {
//     return null;
//   }
// }



const activeUsers = new Map<string, string>(); // userid & socketid
const INCOMING_MESSAGE_CHANNEL = "new_message";


export function setupSocket(server: http.Server) {
  const io = new Server(server, {
    cors: {
      "origin": "http://localhost:3000",
      "credentials": true,
      "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      "allowedHeaders": ["Content-Type", "Authorization"],
      "exposedHeaders": ["Content-Type", "Authorization"]
    }
  });

  io.engine.use(morgan('tiny'));
  io.engine.use(cookieParser());
  io.engine.use(
      sessionMiddleware
  );


  // Middlewares
  io.use(async (socket, next) => {
    console.log("Socket connection attempt:", socket.id);
    const token = socket.handshake.headers?.cookie?.split("Atk=")[1].split(";")[0]
      // socket.handshake.auth?.token ||
      // socket.handshake.headers?.authorization?.split(" ")[1] ||

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
      const user = await getUserById(user_id);
      console.log("User found:", user);

      socket.data.user_id = user_id;
      socket.data.user = user;
      console.log(`User ID from token: ${socket.data.user_id}`);

    } catch (err) {
      console.log("Invalid Token! error:", err);
      return next(new Error("authentication error"));
    }

    console.log(`User authenticated: ${socket.data.user_id}`);

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
    // const session = (socket.request as Request).session;

    console.log(`Client connected: ${socket.id}${socket.data ? ` (user: ${socket.data.user_id})` : " (unauthenticated)"}`);
    if (socket.data.user.email === undefined) {
      return new Error("Session ID is not valid!");
    }

    if (socket.data) {
      activeUsers.set(socket.data.user_id, socket.id);
    }

    const issue_id = socket.handshake.query?.issue_id as string;
    if (!issue_id) {
      console.log("Erreur MarkerID");
      return new Error("MarkerID NotFound");
    }

    socket.join(issue_id);
    console.log(`${socket.id} joined comments section (room) ${issue_id}`);
    // sendAllMessages(socket, markerID);

    socket.on("message", async (data) => {
      if (socket.data.user.email === undefined) {
        return new Error("Session ID is not valid!");
      }

      let newMessage = null;
      try {
        console.log("Received message data:", data);
        newMessage = await createMessage.parseAsync(data);
      } catch(err) {
        console.log("Error validating message schema:", err);
        socket.emit("error", "Schema not valid!");
        return;
      }


      if (!socket.data) {
        console.warn(`Non-authenticated user tried to send message: ${socket.id}`);
        socket.emit("error_no_auth");
        return;
      }

      if (issue_id) {
        const mess = await addMessage(issue_id, socket.data.user_id, socket.data.user.lastName as string, socket.data.user.firstName as string, newMessage.message);

        // PUB EVENT (add message)
        await redisClient.publish(INCOMING_MESSAGE_CHANNEL, JSON.stringify(mess));

        io.to(issue_id).emit("message", mess);
      }
    });

    socket.on("disconnect", () => {
      if (socket.data && activeUsers.get(socket.data.userId) === socket.id) {
        activeUsers.delete(socket.data.userId);
        console.log(`User ${socket.data.userId} disconnected and session cleared.`);
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
