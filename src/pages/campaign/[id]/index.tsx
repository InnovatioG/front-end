import React from 'react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import JSON from "@/HardCode/campaignId.json";
import styles from "./campainPagelayout.module.scss"
import CampaignHeader from '@/components/campaign/campaignHeader/CampaignHeader';
import CampaignDashCreation from '@/components/campaign/campaignHeader/CampaignDash';
import { useProjectDetailStore } from '@/store/projectdetail/useProjectDetail';
import ProjectContainer from '@/components/projectContainer/ProjectContainer';
import LoadingPage from '@/components/LoadingPage/LoadingPage';


interface CampaignVisualizationProps {
    // Define props here
}

const CampaignVisualization: React.FC<CampaignVisualizationProps> = (props) => {

    const router = useRouter();
    const { id } = router.query;
    const { project, setProject, setEditionMode, editionMode, isLoading, setIsLoading } = useProjectDetailStore();
    console.log(project)



    useEffect(() => {
        setIsLoading(true);
        setEditionMode(false);

        if (id) {
            const campaignId = Number(id);
            const campaign = JSON.campaigns.find((camp) => camp.id === campaignId);

            if (campaign) {
                setProject(campaign);
            }
        }

        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);

        return () => clearTimeout(timer);
    }, [id, setProject]);

    if (isLoading) {
        return <LoadingPage />;
    }




    return (
        <main className={styles.layout}>
            {
            }
            {project.id !== 0 ? (
                <div className={styles.campaignContainerCreator}>
                    <CampaignHeader />
                    <CampaignDashCreation
                    />
                    <ProjectContainer />
                </div>
            ) : (
                <p>Campaign not found</p>
            )}
        </main>
    );
}

export default CampaignVisualization;

