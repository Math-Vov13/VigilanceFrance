import { Request, Response, Router } from "express";
import { verify_access_token } from "../middlewares/verify_aToken";
import { verify_issue_id } from "../middlewares/verify_issue_query";
import { createSolvedVote, getSolvedVote_byUser, getSolvedVotes_byIssueId, removeSolvedVote } from "../models/solved_db";
import { getVotes_byIssueId } from "../models/votes_db";
import { solvedIssue } from "../models/marker_db";

export const router = Router();



router.get("/", (req: Request, res: Response) => {
    res.send("Solved Votes endpoint")
})


router.get("/upvotes", verify_access_token(false), verify_issue_id, async (req: Request, res: Response) => {
    const { issue_id } = req.query;

    const results = await getVotes_byIssueId(issue_id as string);

    res.json({
        "connected": req.access_token_content !== undefined,
        "issue_id": issue_id,
        "votes": results.length,
        "voted": req.access_token_content !== undefined? (
            await getSolvedVote_byUser(req.access_token_content as string, issue_id as string) !== null
        ) : false
    })
})

router.post("/create", verify_access_token(true), verify_issue_id, async (req: Request, res: Response) => {
    const { issue_id } = req.query;

    const vote = await createSolvedVote(req.access_token_content as string, issue_id as string);
    if (! vote) {
        res.status(409).send("You have already an active vote for this issue!");
        return;
    }

    const votes = await getVotes_byIssueId(issue_id as string);
    const solved_votes = await getSolvedVotes_byIssueId(issue_id as string);

    if ((votes.length / 2)+1 < solved_votes.length) {
        // Delete Issue by Socialism!
        await solvedIssue(issue_id as string);

        res.status(201).json({
            "solved": true,
            "user_id": req.access_token_content,
            "issue_id": issue_id,
            "vote_id": vote.id
        })
    }

    res.status(201).json({
        "solved": false,
        "user_id": req.access_token_content,
        "issue_id": issue_id,
        "vote_id": vote.id
    })
})

router.delete("/", verify_access_token(true), verify_issue_id, async (req: Request, res: Response) => {
    const { issue_id } = req.query;

    const response = await removeSolvedVote(req.access_token_content as string, issue_id as string);
    if (response.success === false) {
        res.status(response.status).send(response.message);
        return;
    }

    res.status(200).send("Solved Vote deleted!");
})