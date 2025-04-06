import express, { Request, Response } from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import morgan from 'morgan';
import { debug } from 'node:console';

const PORT = process.env.PORT || 3000;

const app = express();

app.use(morgan("combined"));


// PROXY
app.use('/auth', createProxyMiddleware({ target: 'http://auth-service:80', changeOrigin: true }));
app.use('/maps', createProxyMiddleware({ target: 'http://maps-service:80', changeOrigin: true }));
app.use('/mess', createProxyMiddleware({ target: 'http://mess-service:80', changeOrigin: true }));
app.use('/notifs', createProxyMiddleware({ target: 'http://notifs-service:80', changeOrigin: true }));


app.get("/health", (req: Request, res: Response) => {
    res.send({
        "version": "1.0.0",
        "state": "running"
    })
})


// Server Listen
const server = app.listen(PORT, () => {
    console.log(`[API GATEWAY] Running Gateway on http://localhost:${PORT}`);
})


// Close Server with Event
process.on("SIGTERM", () => {
    debug('SIGTERM signal received: closing HTTP server');
    server.close(() => {
        debug('HTTP server closed!');
    })
})