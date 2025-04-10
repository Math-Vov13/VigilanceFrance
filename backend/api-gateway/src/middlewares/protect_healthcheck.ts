import { Request, Response, NextFunction } from "express";


export const no_health_check = async (req: Request, res: Response, next: NextFunction) => {
    if (req.url.search("health") > 0) {
        res.sendStatus(404);
        return;
    }
    next(); // Continue
}