import { z } from "zod";
import { IssueCreate, MarkerDB } from "../schemas/marker_sc";

const fake_db: z.infer<typeof MarkerDB>[] = [];



export async function getIssues(): Promise<z.infer<typeof MarkerDB>[]> {
    return fake_db;
}

export async function createIssue(issuer_id: string, issue: z.infer<typeof IssueCreate>): Promise<z.infer<typeof MarkerDB>> {
    const data = {
        id: crypto.randomUUID(),
        reporterID: issuer_id,
        date: new Date(),
        
        ...issue
    }

    fake_db.push(data);
    return data;
}