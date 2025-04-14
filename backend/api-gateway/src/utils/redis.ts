import { createClient, RedisClientType } from 'redis';

export const redisClient = createClient({ url: "redis://redis-data:6379", password: "mypassword" });

redisClient.on('connect', () => {
    console.log(`[API GATEWAY] Connected to Redis on (redis://redis-data:6379)`);
});

function connectRedis() {
    console.log("[API GATEWAY] Connecting to Redis server...")
    redisClient.connect().catch((err) => {
        console.error('Erreur lors de la connexion à Redis:', err);
    });
};
connectRedis();