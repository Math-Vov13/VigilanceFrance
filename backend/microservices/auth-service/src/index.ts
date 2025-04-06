import express, { Request, Response } from 'express';
import { router as AuthRouter } from './endpoints/users';
import morgan from 'morgan';
import { debug } from 'node:console';

// Vars
const app = express();
const PORT = process.env["PORT"] || 3000;

// Middlewares
app.use("/account", AuthRouter);
app.use(morgan("dev"));

// Endpoint
app.get('/', (req: Request, res: Response) => {
    res.send("Hello from Service: 'Auth'");
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