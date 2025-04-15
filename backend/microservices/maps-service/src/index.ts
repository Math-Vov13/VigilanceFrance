import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import os from 'os';
import cookieParser from "cookie-parser";
import session from "express-session";
import connectRedis from "connect-redis";

import { redisClient } from "./models/redis-connector";
import { router as routerIssues } from './endpoints/markers';
import { router as routerVotes } from './endpoints/votes';
import { router as routerSolved } from './endpoints/solved';
import "./models/mongo-connector"; // NE PAS RETIRER !

// Vars
const app = express();
const PORT = process.env["PORT"] || 3003;


// Proxy
app.set("trust proxy", process.env.NODE_ENV === "production"? (process.env.PROXY_IP || false): true);  // API Gateway ==> Trusted Proxy


// Middlewares
app.use(cors({
    "origin": "http://localhost:5173",
    "credentials": true,
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allowedHeaders": ["Content-Type", "Authorization"],
    "exposedHeaders": ["Content-Type", "Authorization"]
}));
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
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


// Routers
app.use("/interactions/issues", routerIssues);
app.use("/interactions/votes", routerVotes);
app.use("/interactions/solved", routerSolved);



// Endpoints
app.get('/', (req: Request, res: Response) => {
    console.log("Session id:", req.sessionID);
    res.send("Hello from Service: 'Maps'");
    return;
})

app.get("/health", (req: Request, res: Response) => {
    // Set no cache (faster response!)
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
    })
})



// Server Listen
const server = app.listen(PORT, (err) => {
    if (err !== undefined) {
        console.error(`[${process.env.TAG || 'server'}]: Error while running server:`, err);
        return;
    }

    console.log(`[${process.env.TAG || 'server'}]: Running Server on http://localhost:${PORT}`);
});


// Close Server with Event
process.on("SIGTERM", () => {
    console.debug('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.debug('HTTP server closed!');
        console.log(`[${process.env.TAG || 'server'}]: Server closed!`);
    })
})