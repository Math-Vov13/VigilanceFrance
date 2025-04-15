import { Request, Response, Router } from "express";
import { body_schema_validation } from "../middlewares/verify_schema";
import { IssueCreate } from "../schemas/marker_sc";
import { verify_access_token } from "../middlewares/verify_aToken";
import { createIssue, getIssues } from "../models/marker_db";
import { createMessagesDoc } from "../models/messages_db";

export const router = Router();



router.get("/", (req: Request, res: Response) => {
    res.send("Issues endpoint");
})


router.get("/show", verify_access_token(false), async (req: Request, res: Response) => {
    const results = await getIssues();
    if (! results) {
        res.sendStatus(500);
        return;
    }

    res.send({
        "connected": req.access_token_content !== undefined,
        "length": results.length,
        "content": results
    });
})

router.post("/create", verify_access_token(true), body_schema_validation(IssueCreate), async (req: Request, res: Response) => {
    const issue = await createIssue(req.access_token_content as string, req.body);
    if (!issue) {
        res.sendStatus(409);
        return;
    }

    const messages = await createMessagesDoc(issue.id);
    if (!messages) {
        console.error("Error occured while trying to create document from 'Messages' Collection!");
    }

    res.status(201).send({
        "created": true,
        "issuer": req.access_token_content,
        "issue": issue
    })
})