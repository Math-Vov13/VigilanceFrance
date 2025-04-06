import express, { Request, Response } from 'express';
import { router as AuthRouter } from './endpoints/users';

// Vars
const app = express();
const PORT = process.env["PORT"] || 8001;

// Middlewares
app.use("", AuthRouter);


// Endpoint
app.get('/', (req: Request, res: Response) => {
    res.send("Hello from Service: 'Auth'");
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