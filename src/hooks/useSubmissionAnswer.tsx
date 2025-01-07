import React, { useState, useEffect } from "react";
import JSON from "@/HardCode/campaignId.json";
import { useProjectDetailStore } from "@/store/projectdetail/useProjectDetail";

export default function useSubmissionAnswer({ id }: { id: number }) {
    /*     const { project } = useProjectDetailStore();
        const { id } = project; */

    const [approved, setApproved] = useState<string | null>(null);
    const [answer, setAnswer] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(true);

    useEffect(() => {
        setLoading(true);
        if (id) {
            const campaignSubmission = JSON.campaign_submissions.find((camp: any) => camp.campaign_id === id);
            if (campaignSubmission) {
                const justificationMap: { [key: number]: string } = {
                    2: campaignSubmission.approved_justification,
                    3: campaignSubmission.rejected_justification,
                };
                setAnswer(justificationMap[campaignSubmission.submission_status_id] || null);
                setApproved(campaignSubmission.submission_status_id === 2 ? "Approved" : "Rejected");
            }
            setLoading(false);
        }
    }, [id]);

    return { answer, loading, approved };
}