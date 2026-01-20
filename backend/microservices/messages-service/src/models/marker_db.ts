import { IIssue, IssuesModel } from "../schemas/mongo_issues_sc";



export async function getIssue_byId(issue_id: string): Promise<IIssue | null> {
    try {
        const issue = await IssuesModel.findById(issue_id);
        return issue;
    } catch (err) {
        console.log("NOT FOUND:", err);
        return null;
    }
}