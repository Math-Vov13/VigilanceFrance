import { createClient } from 'redis';

const redis_url = `redis://${process.env.REDIS_HOST || 'localhost'}:${process.env.REDIS_PORT || '6379'}`
export const redisClient = createClient({ url: redis_url, password: process.env.REDIS_PSWD || "mypassword" });

redisClient.on('connect', () => {
    console.log(`[${process.env.TAG || 'server'}]: Connected to Redis on (${redis_url})`);
});
redisClient.on('error', (err) => {
    console.log(`[${process.env.TAG || 'server'}]: Redis Error: ${err}`);
});

function connectRedis() {
    console.log(`[${process.env.TAG || 'server'}]: Connecting to Redis server...`)
    redisClient.connect().catch((err) => {
        console.error(`[${process.env.TAG || 'server'}]: Error while trying to connect with Redis:`, err);
    });
};
connectRedis();