import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import morgan from 'morgan';
import cors from 'cors';
import axios from 'axios';
import { no_health_check } from "./middlewares/protect_healthcheck";
import { RedisClientType } from 'redis';
import { rate_limiter } from "./middlewares/rate_limiter";
import { redisClient } from "./utils/redis";

const PORT = process.env.PORT || 3000;

const app = express();

app.use(morgan("combined"));
app.use(cors({
    "origin": "http://localhost:5173"
}));


// PROXY
app.use('/auth', rate_limiter(redisClient as RedisClientType, "3r/1s"), no_health_check, createProxyMiddleware({ target: 'http://auth-service:80', changeOrigin: true }));
app.use('/maps', rate_limiter(redisClient as RedisClientType, "10r/1s"), no_health_check, createProxyMiddleware({ target: 'http://maps-service:80', changeOrigin: true }));
app.use('/mess', rate_limiter(redisClient as RedisClientType, "10r/1s"), no_health_check, createProxyMiddleware({ target: 'http://mess-service:80', changeOrigin: true }));
app.use('/notifs', rate_limiter(redisClient as RedisClientType, "10r/1s"), no_health_check, createProxyMiddleware({ target: 'http://notifs-service:80', changeOrigin: true }));


// Server Listen
const server = app.listen(PORT, () => {
    console.log(`[API GATEWAY] Running Gateway on (http://localhost:${PORT})`);
})


// Close Server with Event
process.on("SIGTERM", () => {
    console.debug('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.debug('HTTP server closed!');
    })
})




// Check Services State
async function checkServiceHealth(base_url: string): Promise<boolean> {
    try {
        const startT = new Date().getUTCMilliseconds()
        const response = await axios.get(base_url + "/health",
            {
                headers: {
                    "Cache-Control": "no-cache"
                }
            }
        )
        const endT = new Date().getUTCMilliseconds()
        const delta = endT - startT

        // Verify time taken for response ( >30s )
        if (delta > 30 * 1000) {
            throw new Error(`API took ${delta / 1000}s to respond!`);
        }

        return true;
    } catch (err) {
        console.warn(`MicroService (${base_url}) error: "${err}"`);
        return false;
    }
}

async function checkMicroServices() {
    await checkServiceHealth("http://auth-service:80");
    await checkServiceHealth("http://maps-service:80");
    await checkServiceHealth("http://mess-service:80");
    await checkServiceHealth("http://notifs-service:80");

    // Verif each minutes (60s)
    setTimeout(async () => {
        await checkMicroServices();
    }, 1000 * 60)
}
checkMicroServices(); // Start Verification