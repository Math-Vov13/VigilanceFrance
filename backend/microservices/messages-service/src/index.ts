import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import os from 'os';
import cookieParser from 'cookie-parser';
import messagesRouter from './endpoints/messages';
import { setupSocket } from './socket';
import session from "express-session";
import connectRedis from "connect-redis";
import { redisClient } from './models/redis-connector';
import "./models/mongo-connector";

const app = express();
const PORT = process.env["PORT"] || 3004;


declare module "express-session" {
    interface SessionData {
        connected: boolean;
        user_id: string;
        firstName: string;
        lastName: string;

        last_pos_updated: string;

        last_lat: number;
        last_lng: number;
    }
}


// Middlewares
app.use(cors({
    "origin": "http://localhost:5173",
    "credentials": true,
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allowedHeaders": ["Content-Type", "Authorization"],
    "exposedHeaders": ["Content-Type", "Authorization"]
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(
    session({
        name: "SID",
        store: new connectRedis.RedisStore({
           client: redisClient
        }),
        secret: process.env.REDIS_SESSION_SECRET || 'your-secret-key', // Replace with a secure secret
        resave: false,
        saveUninitialized: false,
        cookie: { sameSite: "lax", httpOnly: true, secure: process.env.NODE_ENV === "production" },
    })
);


app.use('/messages', messagesRouter);

app.get('/', (req: Request, res: Response) => {
    res.send("Hello from Service: 'Messages'");
    return;
});

// health check
app.get("/health", (req: Request, res: Response) => {
    res.setHeader("Cache-Control", "no-cache");
    // Understanding Health Check inside MicroServices (https://testfully.io/blog/api-health-check-monitoring/)
    // Ideas from Docker github (https://github.com/dmportella/rancher-docker-node/blob/master/routes/status.js)
    res.send({
        "version": process.env.CONT_IMG_VER || "N/A",
        "status": 'OK',
        "hostname": os.hostname(),
        "versions": process.versions,
        "process": {
            "uptime": process.uptime(),
            "memoryUsage": process.memoryUsage(),
            "platform": process.platform,
            "arch": process.arch,
            "title": process.title
        },
        "cpus": os.cpus(),
        "network": os.networkInterfaces(),
        "environment": process.env
    });
});

const server = app.listen(PORT, () => {
    console.log(`[${process.env.TAG}]: Running Server on http://localhost:${PORT}`);
});

setupSocket(server);
// setupWebSocket(server);

process.on("SIGTERM", () => {
    console.debug('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.debug('HTTP server closed!');
        console.log(`[${process.env.TAG || 'server'}]: Server closed!`);
    })
})