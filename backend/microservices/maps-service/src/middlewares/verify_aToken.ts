import { Request, Response, NextFunction } from "express";
import { decode_AccessToken } from "../security/access_token";


declare global {
    namespace Express {
        interface Request {
            access_token?: string;
            access_token_content?: string;
        }
    }
}


export const verify_access_token = (strict: boolean) => async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies["Atk"];

    if (token === undefined) {
        if (strict === false) {
            next(); // Continue
        } else {
            res.status(401).send("Access token is missing");
        }
        return;
    }

    // Decode the token
    const decodedToken = decode_AccessToken(token, req.headers["user-agent"] as string);
    if (! decodedToken) {
        if (strict === false) {
            next(); // Continue
        } else {
            res.status(401).send("Invalid access token");
        }
        return;
    }
    
    req.access_token = token; // Add the decoded token to the request object
    req.access_token_content = decodedToken; // Add the decoded token content to the request object
    
    next(); // Continue
}