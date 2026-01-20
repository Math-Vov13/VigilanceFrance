import { Request, Response, Router } from "express";
import { verify_access_token } from "../middlewares/verify_aToken";
import { verify_issue_id } from "../middlewares/verify_issue_query";
import { createSolvedVote, getSolvedVotes_byIssueId, removeSolvedVote } from "../models/solved_db";
import { getVotes_byIssueId } from "../models/votes_db";
import { solvedIssue } from "../models/marker_db";
import { redisClient } from "../models/redis-connector";

export const router = Router();

const ISSUE_SOLVED_CHANNEL = "issue_solved";
const SOLVED_VOTE_ADDED_CHANNEL = "new_solved_vote";


router.get("/", (req: Request, res: Response) => {
    res.send("Solved Votes endpoint")
})


router.get("/upvotes", verify_access_token(false), verify_issue_id, async (req: Request, res: Response) => {
    const { issue_id } = req.query;

    const results = await getSolvedVotes_byIssueId(issue_id as string);
    console.log("Resultats:", results);
    if (! results) {
        res.sendStatus(500);
        return;
    }

    const votes = results.solved;
    let user_has_voted = false;
    if (req.access_token_content !== undefined) {
        // Connected
        for (const vote of votes) {
            if (vote.user_id === req.access_token_content) {
                user_has_voted = true;
            }
        }
    }

    res.json({
        "connected": req.access_token_content !== undefined,
        "issue_id": issue_id,
        "votes": votes.length,
        "voted": user_has_voted
        // "voted": req.access_token_content !== undefined? (
        //     await getVote_byUser(req.access_token_content as string, issue_id as string) !== null
        // ) : false
    })

    // const { issue_id } = req.query;

    // const results = await getVotes_byIssueId(issue_id as string);

    // res.json({
    //     "connected": req.access_token_content !== undefined,
    //     "issue_id": issue_id,
    //     "votes": results.length,
    //     "voted": req.access_token_content !== undefined? (
    //         await getSolvedVote_byUser(req.access_token_content as string, issue_id as string) !== null
    //     ) : false
    // })
})

router.post("/vote", verify_access_token(true), verify_issue_id, async (req: Request, res: Response) => {
    const { issue_id } = req.query;

    const vote = await createSolvedVote(req.access_token_content as string, issue_id as string);
    if (! vote) {
        res.status(409).send("You have already an active vote for this issue!");
        return;
    }

    let issue_solved = false;

    const votes = await getVotes_byIssueId(issue_id as string);
    const solved_votes = await getSolvedVotes_byIssueId(issue_id as string);

    // PUB EVENT (add solved vote)
    await redisClient.publish(SOLVED_VOTE_ADDED_CHANNEL, JSON.stringify({
        "issue_id": issue_id,
        "user_id": req.access_token_content
    }))

    const is_reporter = (vote.reporter_id === req.access_token_content)
    const set_as_solved = (votes.length / 2)+5 <= solved_votes.length // -> minimum 5 votes 'résoluts'
    if (is_reporter || set_as_solved) {
        // Delete Issue by Socialism!
        await solvedIssue(issue_id as string);

        // PUB EVENT (issue solved)
        await redisClient.publish(ISSUE_SOLVED_CHANNEL, JSON.stringify({
            "issue_id": issue_id,
            "user_id": req.access_token_content,
            "nbr_votes": votes.length,
            "nrb_solved": solved_votes.length
        }))

        issue_solved = true;
    }

    res.status(201).json({
        "solved": issue_solved,
        "user_id": req.access_token_content,
        "issue_id": issue_id,
        "vote_id": vote.id
    })
})

router.delete("/vote", verify_access_token(true), verify_issue_id, async (req: Request, res: Response) => {
    const { issue_id } = req.query;

    const response = await removeSolvedVote(req.access_token_content as string, issue_id as string);
    if (response.success === false) {
        res.status(response.status).send(response.message);
        return;
    }

    res.status(200).send("Solved Vote deleted!");
})