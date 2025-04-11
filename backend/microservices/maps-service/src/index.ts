import express, { Request, Response } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import os from 'os';
import { router as routerIssues } from './endpoints/markers';
import { router as routerVotes } from './endpoints/votes';
import { router as routerSolved } from './endpoints/solved';
import cookieParser from "cookie-parser";

// Vars
const app = express();
const PORT = process.env["PORT"] || 3003;

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


app.set('trust proxy', true);


// Endpoints
app.use("/interactions/issues", routerIssues);
app.use("/interactions/votes", routerVotes);
app.use("/interactions/solved", routerSolved);


app.get('/', (req: Request, res: Response) => {
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
        console.error("[server]: Error while running server:", err);
        return;
    }

    console.log(`[server]: Running Server on http://localhost:${PORT}`);
});


// Close Server with Event
process.on("SIGTERM", () => {
    console.debug('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        console.debug('HTTP server closed!');
    })
})