import { Request, Response, Router } from "express";
import { body_schema_validation } from "../middlewares/verify_schema";
import { IssueCreate } from "../schemas/marker_sc";
import { verify_access_token } from "../middlewares/verify_aToken";
import { createIssue, getIssues } from "../models/marker_db";

export const router = Router();



router.get("/", (req: Request, res: Response) => {
    res.send("Markers endpoint");
})


router.get("/show", async (req: Request, res: Response) => {
    const results = await getIssues();

    res.send({
        length: results.length,
        content: results
    });
})

router.post("/create", verify_access_token, body_schema_validation(IssueCreate), async (req: Request, res: Response) => {
    const issue = await createIssue(req.access_token_content as string, req.body);

    if (!issue) {
        res.sendStatus(409);
        return;
    }

    res.status(201).send({
        "created": true,
        "issuer": req.access_token_content,
        "issue": issue
    })
})