import session from "express-session";
import connectRedis from "connect-redis";
import { redisClient } from './models/redis-connector';

export const sessionMiddleware = session({
        name: "SID",
        store: new connectRedis.RedisStore({
           client: redisClient
        }),
        secret: process.env.REDIS_SESSION_SECRET || 'your-secret-key', // Replace with a secure secret
        resave: false,
        saveUninitialized: false,
        cookie: { sameSite: "lax", httpOnly: true, secure: process.env.NODE_ENV === "production" },
    })