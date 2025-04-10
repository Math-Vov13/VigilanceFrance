import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import http from 'http';
import os from 'os';
import cookieParser from 'cookie-parser';
import messagesRouter from './endpoint/messages';
// import { setupWebSocket } from './ws';
import { setupSocket } from './socket';

const app = express();
const PORT = process.env["PORT"] || 3004;

// Configuration CORS - spécifiez une origine précise ou ajustez le client pour ne pas utiliser withCredentials
app.use(cors({
    // origin: "*", // Ne fonctionne pas avec credentials: true
    origin: true, // Réfléchit l'origine de la requête
    credentials: true
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use('/messages', messagesRouter);

app.get('/', (req: Request, res: Response) => {
    res.send("Hello from Service: 'Messages'");
    return;
});

// Endpoint de health check
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
    console.log(`[server]: Running Server on http://localhost:${PORT}`);
});

setupSocket(server);
// setupWebSocket(server);

process.on("SIGTERM", () => {
    console.debug('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.debug('HTTP server closed!');
    });
});