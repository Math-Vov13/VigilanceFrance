import { Request, Response, NextFunction } from "express";
import { decode_RefreshToken } from "../security/refresh_token";


declare global {
    namespace Express {
        interface Request {
            refresh_token?: string;
            refresh_token_content?: string;
        }
    }
}

export const verify_refresh_token = async (req: Request, res: Response, next: NextFunction) => {
    const token: string | undefined = req.headers["authorization"]
    if (token === undefined) {
        res.status(401).send("Token is missing");
        return;
    }

    // Check if the token starts with "Bearer "
    if (!token.startsWith("Bearer ")) {
        res.status(401).send("Token is missing");
        return;
    }

    // Decode the token
    const decodedToken = decode_RefreshToken(token.split(" ")[1], req.headers["user-agent"] as string);
    if (! decodedToken) {
        res.status(401).send("Invalid refresh token");
        return;
    }
    
    req.refresh_token = token.split(" ")[1]; // Add the decoded token to the request object
    req.refresh_token_content = decodedToken; // Add the decoded token content to the request object
    next(); // Continue
}