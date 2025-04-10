import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import { MarkerDB } from "../schemas/marker_sc";
import { getIssue_byId } from "../models/marker_db";


declare global {
    namespace Express {
        interface Request {
            issue_content?: z.infer<typeof MarkerDB>;
        }
    }
}

export const verify_issue_id = async (req: Request, res: Response, next: NextFunction) => {
    const { issue_id } = req.query;
    if (! issue_id) {
        res.sendStatus(400);
        return;
    }

    const issue_db = await getIssue_byId(issue_id as string);
    if (! issue_db) {
        res.status(404).send("Issue not found! Or has been solved.");
        return;
    }
    
    req.issue_content = issue_db as z.infer<typeof MarkerDB>;
    next(); // Continue
}