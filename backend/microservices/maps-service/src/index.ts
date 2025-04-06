import express, { Request, Response } from 'express';
import { debug } from 'node:console';

// Vars
const app = express();
const PORT = process.env["PORT"] || 8003;

// Middlewares


// Endpoint
app.get('/', (req: Request, res: Response) => {
    res.send("Hello from Service: 'Maps'");
    return;
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
    debug('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        debug('HTTP server closed!');
    })
})