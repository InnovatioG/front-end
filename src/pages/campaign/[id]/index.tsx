import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import JSON from "@/HardCode/campaignId.json";
import styles from "./campainPagelayout.module.scss";
import CampaignHeader from '@/components/campaign/campaignHeader/CampaignHeader';
import CampaignDashCreation from '@/components/campaign/campaignHeader/CampaignDash';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import ProjectContainer from '@/components/projectContainer/ProjectContainer';
import LoadingPage from '@/components/LoadingPage/LoadingPage';
import { useSession } from 'next-auth/react';
import CampaignButtonContainer from './campainButtonsContainer';

interface CampaignVisualizationProps {
    // Define props here
}

const CampaignVisualization: React.FC<CampaignVisualizationProps> = (props) => {
    const { data: session } = useSession();
    const router = useRouter();
    const { id } = router.query;
    const { project, setProject, setEditionMode, isLoading, setIsLoading, setIsAdmin, isAdmin } = useProjectDetailStore();



    /* MOMENTANEO */

    useEffect(() => {
        setIsLoading(true);
        setEditionMode(false);

        if (id) {
            const campaignId = Number(id);
            const campaign = JSON.campaigns.find((camp) => camp.id === campaignId);
            console.log('campaign', campaign);
            const user = JSON.users.find((user) => user.wallet_address === session?.user?.address);
            console.log("user", user);

            if (campaign) {
                setProject(campaign);
                setIsAdmin(campaign.user_id === user?.id);
            }
        }

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, [id, setProject, setIsAdmin, session?.user?.address]);

    if (isLoading) {
        return <LoadingPage />;
    }

    return (
        <main className={styles.layout}>
            {project.id !== 0 ? (
                <div className={styles.campaignContainerCreator}>
                    <CampaignHeader />
                    <CampaignDashCreation />
                    <ProjectContainer />
                </div>
            ) : (
                <p>Campaign not found</p>
            )}

            <CampaignButtonContainer />
        </main>
    );
}

export default CampaignVisualization;

