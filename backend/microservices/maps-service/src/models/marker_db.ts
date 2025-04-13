import { z } from "zod";
import { IssueCreate, MarkerDB } from "../schemas/marker_sc";
import { createVote } from "./votes_db";

const fake_db: z.infer<typeof MarkerDB>[] = [];



export async function getIssue_byId(issue_id: string): Promise<z.infer<typeof MarkerDB> | null> {
    const issue = fake_db.find((issue) => issue.id === issue_id && issue.solved_at === null)
    return issue || null;
}

export async function getIssues(): Promise<z.infer<typeof MarkerDB>[]> {
    const results = []
    for (const issue of fake_db) {
        if (issue.solved_at !== null) { continue; }
        results.push(issue);
    }
    
    return results;
}

export async function createIssue(issuer_id: string, issue: z.infer<typeof IssueCreate>): Promise<z.infer<typeof MarkerDB> | null> {
    const data = {
        id: crypto.randomUUID(),
        reporterID: issuer_id,
        date: new Date(),
        solved_at: null,
        
        ...issue
    }

    const vote = await createVote(issuer_id, data.id);
    if (! vote) { // Unexpected Error ?!!
        return null;
    }

    fake_db.push(data);
    return data;
}

export async function solvedIssue(issue_id: string): Promise<z.infer<typeof MarkerDB> | null> {
    const issue = await getIssue_byId(issue_id);
    if (! issue) {
        return null;
    }

    issue.solved_at = new Date(); //Set Issue as solved :D
    return issue;
}