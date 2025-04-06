import express, { Request, Response } from 'express';

// Vars
const app = express();
const PORT = process.env["PORT"] || 8005;

// Middlewares


// Endpoint
app.get('/', (req: Request, res: Response) => {
    res.send("Hello from Service: 'Notifs'");
    return;
})


// Server Listen
app.listen(PORT, (err) => {
    if (err !== undefined) {
        console.error("[server]: Error while running server:", err);
        return;
    }

    console.log(`[server]: Running Server on http://localhost:${PORT}`);
});