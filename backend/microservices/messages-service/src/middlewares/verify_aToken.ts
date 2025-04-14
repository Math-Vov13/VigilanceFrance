import { Request, Response, NextFunction } from "express";
import { decode_AccessToken } from "../security/jwt";


declare global {
    namespace Express {
        interface Request {
            access_token?: string;
            access_token_content?: string;
        }
    }
}


export const verify_access_token_strict = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies["Atk"];

    if (token === undefined) {
        res.status(401).send("Access token is missing");
        return;
    }

    // Decode the token
    const decodedToken = decode_AccessToken(token, req.headers["user-agent"] as string);
    if (! decodedToken) {
        res.status(401).send("Invalid access token");
        return;
    }
    
    req.access_token = token; // Add the decoded token to the request object
    req.access_token_content = decodedToken; // Add the decoded token content to the request object
    next(); // Continue
}