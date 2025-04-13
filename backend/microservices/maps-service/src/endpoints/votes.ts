import { Request, Response, Router } from "express";
import { verify_access_token } from "../middlewares/verify_aToken";
import { verify_issue_id } from "../middlewares/verify_issue_query";
import { createVote, getVote_byUser, getVotes_byIssueId, removeVote } from "../models/votes_db";

export const router = Router();



router.get("/", (req: Request, res: Response) => {
    res.send("Votes endpoint")
})


router.get("/upvotes", verify_access_token(false), verify_issue_id, async (req: Request, res: Response) => {
    const { issue_id } = req.query;

    const results = await getVotes_byIssueId(issue_id as string);

    res.json({
        "connected": req.access_token_content !== undefined,
        "issue_id": issue_id,
        "votes": results.length,
        "voted": req.access_token_content !== undefined? (
            await getVote_byUser(req.access_token_content as string, issue_id as string) !== null
        ) : false
    })
})

router.post("/create", verify_access_token(true), verify_issue_id, async (req: Request, res: Response) => {
    const { issue_id } = req.query;

    const vote = await createVote(req.access_token_content as string, issue_id as string);
    if (! vote) {
        res.status(409).send("You have already an active vote for this issue!");
        return;
    }

    res.status(201).json({
        "user_id": req.access_token_content,
        "issue_id": issue_id,
        "vote_id": vote.id
    })
})

router.delete("/", verify_access_token(true), verify_issue_id, async (req: Request, res: Response) => {
    const { issue_id } = req.query;

    const response = await removeVote(req.access_token_content as string, issue_id as string);
    if (response.success === false) {
        res.status(response.status).send(response.message);
        return;
    }

    res.status(200).send("Vote deleted!");
})