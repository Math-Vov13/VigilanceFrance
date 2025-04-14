import { z } from "zod";
import { IssueCreate, MarkerDB } from "../schemas/marker_sc";
import { createVote } from "./votes_db";
import { IIssue, IssuesModel } from "../schemas/mongo_issues_sc";

// const fake_db: z.infer<typeof MarkerDB>[] = [];



export async function getIssue_byId(issue_id: string): Promise<IIssue | null> {
    try {
        const issue = await IssuesModel.findById(issue_id);
        return issue;
    } catch (err) {
        console.log("NOT FOUND:", err);
        return null;
    }

    // const issue = fake_db.find((issue) => issue.id === issue_id && issue.solved_at === null)
    // return issue || null;
}

export async function getIssues(): Promise<IIssue[] | null> {
    try {
        const results = await IssuesModel.find({ solved_at: null });
        // TODO : get near locations
        return results;
    } catch(err) {
        console.log("NOT FOUND:", err);
        return null;
    }

    // const results = []
    // for (const issue of fake_db) {
    //     if (issue.solved_at !== null) { continue; }
    //     results.push(issue);
    // }
    
    // return results;
}

export async function createIssue(issuer_id: string, issueData: z.infer<typeof IssueCreate>): Promise<IIssue | null> {
    try {
        const newIssue = IssuesModel.create({
            ...issueData,
            reporter_id: issuer_id,
            votes: [{
                user_id: issuer_id
            }],
        });
        // Create Vote
        return newIssue;

    } catch(err) {
        console.log("CONFLICT:", err);
        return null;
    }

    // const data = {
    //     id: crypto.randomUUID(),
    //     reporterID: issuer_id,
    //     date: new Date(),
    //     solved_at: null,
        
    //     ...issueData
    // }

    // const vote = await createVote(issuer_id, data.id);
    // if (! vote) { // Unexpected Error ?!!
    //     return null;
    // }

    // fake_db.push(data);
    // return data;
}

export async function solvedIssue(issue_id: string): Promise<boolean> {
    try {
        const issue = await IssuesModel.updateOne({ "id": issue_id }, { $set: { "solved_at": new Date() } }).exec();
        return true;

    } catch(err) {
        console.log("CONFLICT:", err);
        return false;
    }

    // const issue = await getIssue_byId(issue_id);
    // if (! issue) {
    //     return null;
    // }

    // issue.solved_at = new Date(); //Set Issue as solved :D
    // return issue;
}