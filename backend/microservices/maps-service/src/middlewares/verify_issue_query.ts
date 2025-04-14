import { Request, Response, NextFunction } from "express";
import { getIssue_byId } from "../models/marker_db";
import { IIssue } from "../schemas/mongo_issues_sc";


declare global {
    namespace Express {
        interface Request {
            issue_content?: IIssue;
        }
    }
}

export const verify_issue_id = async (req: Request, res: Response, next: NextFunction) => {
    const { issue_id } = req.query;
    if (! issue_id) {
        res.status(400).send("Query: 'issue_id' can't be null!");
        return;
    }

    const issue_db = await getIssue_byId(issue_id as string);
    if (! issue_db) {
        res.status(404).send("Issue not found! Or has been solved.");
        return;
    }
    
    req.issue_content = issue_db as IIssue;
    next(); // Continue
}