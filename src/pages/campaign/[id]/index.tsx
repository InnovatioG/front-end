import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import JSON from "@/HardCode/campaignId.json";
import CampaignHeader from '@/components/campaign/campaignHeader/CampaignHeader';
import styles from "./campaignIdLayout.module.scss";
import CampaignDashCreation from '@/components/campaign/campaignHeader/CampaignDash';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import ProjectEditionContainer from '@/components/campaign/creator/projectEditionContainer/ProjectEditionContainer';

interface CampaignByIndexProps {
    // Define props aquí si es necesario
}

const CampaignByIndex: React.FC<CampaignByIndexProps> = (props) => {
    const router = useRouter();
    const { id } = router.query;

    const { setProject, project } = useProjectDetailStore();

    useEffect(() => {
        if (id) {
            const campaignId = Number(id);
            const campaign = JSON.find((camp) => camp.id === campaignId);

            if (campaign) {
                setProject(campaign);
            }
        }
    }, [id, setProject]);

    return (
        <main className={styles.layout}>
            {project.id !== 0 ? (
                <div className={styles.campaignContainerCreator}>
                    <CampaignHeader />
                    <CampaignDashCreation
                        styles={styles}
                    />
                    <ProjectEditionContainer />
                </div>
            ) : (
                <p>Campaign not found</p>
            )}
        </main>
    );
}

export default CampaignByIndex;