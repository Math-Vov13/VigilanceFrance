import { RedisClientType } from "redis";
import { rateLimit } from "express-rate-limit";
import { RedisStore } from "rate-limit-redis";


export const rate_limiter = (redisClient: RedisClientType, rate_limit: string) => {
    const windowMs = Number(rate_limit.split("/")[1].split("s")[0]) * 1000;
    const limit = Number(rate_limit.split("/")[0].split("r")[0]);

    return rateLimit({
        windowMs,
        limit,
        standardHeaders: "draft-8",
        legacyHeaders: false,
        store: new RedisStore({
            sendCommand: async (...args) => {
                if (redisClient.isOpen) {
                    return redisClient.sendCommand(args);
                } else {
                    throw new Error('Redis client is not connected');
                }
            }
        })
    });
}