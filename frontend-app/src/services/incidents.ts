const API_URL = process.env.NEXT_PUBLIC_API_MAPS_URL || "http://localhost:8000/api";

export async function GetIssueById(issue_id: string) {
    try {
        const response = await fetch(`${API_URL}/interactions/issues/${issue_id}/show`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies in the request
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching incident:', error);
        throw error;
    }

}

export async function GetAllIssues() {
    try {
        const response = await fetch(`${API_URL}/interactions/issues/show`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include', // Include cookies in the request
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching incidents:', error);
        throw error;
    }
}

export async function CreateIssue(issueData: any) {
    try {
        const response = await fetch(`${API_URL}/interactions/issues/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(issueData),
            credentials: 'include', // Include cookies for authentication
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating incident:', error);
        throw error;
    }
}