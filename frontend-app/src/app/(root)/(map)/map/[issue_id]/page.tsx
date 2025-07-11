import { GetAllIssues } from '@/services/incidents';
import React from 'react';

// export async function getServerSideProps() {
//   try {
    
//     return { props: { data: "success" } };

//   } catch (error) {
//     return { notFound: true };

//   }
// }

export default async function IssuePage({params}: { params: { issue_id: string } }) {
    const { issue_id } = await params;
    const a = await GetAllIssues();
    console.log(a);

    return (
        <div>
            <h1>Issue Page : {issue_id}</h1>
            <p>This is the issue page content.</p>
        </div>
    );
}