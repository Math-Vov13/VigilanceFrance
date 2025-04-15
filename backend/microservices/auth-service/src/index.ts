import express, { Request, Response } from 'express';
import { router as AuthRouter } from './endpoints/auth';
import { router as UserRouter } from './endpoints/users';
import morgan from 'morgan';
import cors from 'cors';
import os from 'os';
import cookieParser from "cookie-parser";
import session from "express-session";
import connectRedis from "connect-redis";
import "./models/mongo-connector"; // NE PAS RETIRER !
import "./models/redis-connector"; // NE PAS RETIRER !
import { redisClient } from './models/redis-connector';

// Vars
const app = express();
const PORT = process.env["PORT"] || 3001;


declare module "express-session" {
    interface SessionData {
        connected: boolean;
        user_id: string;

        last_pos_updated: string;

        last_lat: number;
        last_lng: number;
    }
}


// Proxy
//app.set("trust proxy", process.env.NODE_ENV === "production"? (process.env.PROXY_IP || false): true);  // API Gateway ==> Trusted Proxy


// Middlewares
app.use(morgan("dev"));
app.use(cors({
    "origin": "http://localhost:5173",
    "credentials": true,
    "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    "allowedHeaders": ["Content-Type", "Authorization"],
    "exposedHeaders": ["Content-Type", "Authorization"]
}));
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


app.set('trust proxy', true);

// Routes
app.use("/auth", AuthRouter);
app.use("/account", UserRouter);

// Endpoint
app.get('/', (req: Request, res: Response) => {
    res.send("Hello from Service: 'Auth'");
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